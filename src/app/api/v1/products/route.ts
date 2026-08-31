import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getProductsForTenant } from '@/data/products';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends').toLowerCase().trim();
  const category = searchParams.get('category');
  const department = searchParams.get('department');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const db = await getDatabase();
    if (db) {
      const collection = db.collection('products');

      // Check if products exist for this tenant in MongoDB Atlas
      let tenantCount = await collection.countDocuments({
        $or: [{ tenantSlug: tenantSlug }, { storeSlug: tenantSlug }],
      });

      // If no products in DB for this store yet, auto-seed DB partition with initial catalog
      if (tenantCount === 0) {
        const seedProducts = getProductsForTenant(tenantSlug).map((p) => ({
          ...p,
          tenantSlug,
          storeSlug: tenantSlug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        if (seedProducts.length > 0) {
          await collection.insertMany(seedProducts);
          tenantCount = seedProducts.length;
        }
      }

      // Build MongoDB query
      const query: Record<string, any> = {
        $or: [{ tenantSlug: tenantSlug }, { storeSlug: tenantSlug }],
      };

      if (category && category !== 'all') {
        query.$or = query.$or.map((cond: any) => ({
          ...cond,
          $and: [{ $or: [{ category: category }, { categoryName: category }, { slug: { $regex: category, $options: 'i' } }] }],
        }));
      }

      if (department) {
        query.department = department;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      let cursor = collection.find(query);

      if (sort === 'price') cursor = cursor.sort({ price: 1 });
      else if (sort === '-price') cursor = cursor.sort({ price: -1 });
      else if (sort === '-created_at') cursor = cursor.sort({ createdAt: -1 });
      else cursor = cursor.sort({ isFeatured: -1, isBestSeller: -1, createdAt: -1 });

      const products = await cursor
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      const cleanProducts = products.map(({ _id, ...rest }) => rest);

      return NextResponse.json(
        {
          data: cleanProducts,
          total: tenantCount,
          page,
          limit,
          source: 'mongodb_atlas',
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err) {
    console.error('MongoDB products query error:', err);
  }

  // Fallback if DB unavailable
  const fallback = getProductsForTenant(tenantSlug);
  return NextResponse.json(
    {
      data: fallback,
      total: fallback.length,
      page: 1,
      limit,
      source: 'memory_fallback',
    },
    { headers: corsHeaders() }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    const tenantSlug = (body.tenantSlug || body.storeSlug || 'jqtrends').toLowerCase().trim();
    const doc = {
      ...body,
      tenantSlug,
      storeSlug: tenantSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('products').insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        insertedId: result.insertedId,
        data: doc,
        source: 'mongodb_atlas',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

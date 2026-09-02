import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('categories');
      const count = await collection.countDocuments({
        $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
      });

      if (count === 0) {
        // Auto-seed MongoDB with primary luxury categories
        const initialCategories = [
          {
            id: 'cat_dresses',
            tenantId: tenantSlug,
            name: 'Dresses & Gowns',
            slug: 'dresses',
            description: 'Handcrafted evening gowns, midi dresses and cocktail couture.',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
            parentId: null,
            displayOrder: 1,
            isVisible: true,
            productCount: 12,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'cat_outerwear',
            tenantId: tenantSlug,
            name: 'Coats & Blazers',
            slug: 'outerwear',
            description: 'Tailored blazers, trench coats, and cashmere outer garments.',
            imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
            parentId: null,
            displayOrder: 2,
            isVisible: true,
            productCount: 8,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'cat_tops',
            tenantId: tenantSlug,
            name: 'Tops & Blouses',
            slug: 'tops',
            description: 'Silk shirts, linen tunics, and structured corset tops.',
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
            parentId: null,
            displayOrder: 3,
            isVisible: true,
            productCount: 15,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        await collection.insertMany(initialCategories);
      }

      const docs = await collection
        .find({
          $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
        })
        .sort({ displayOrder: 1 })
        .toArray();

      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newCategory = {
      ...body,
      id: body.id || `cat_${Date.now()}`,
      tenantId: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('categories').insertOne(newCategory);
    }

    return NextResponse.json(
      { success: true, data: newCategory, message: 'Category created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

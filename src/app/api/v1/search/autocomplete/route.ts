import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/products';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        query,
        suggestions: [],
      }, { headers: corsHeaders() });
    }

    const tenantSlug = (
      searchParams.get('tenant') ||
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-tenant') ||
      'demo'
    ).replace(/^store_/, '').toLowerCase().trim();

    const { getTenantDatabase } = await import('@/lib/mongodb');
    const db = await getTenantDatabase(tenantSlug);

    let allProducts: any[] = [];
    let dbCategories: any[] = [];

    if (db) {
      const rawProds = await db.collection('products').find({
        $or: [
          { status: { $in: ['published', 'active'] } },
          { status: { $exists: false } },
        ],
      }).toArray();
      allProducts = rawProds.map((doc: any) => {
        const { _id, ...clean } = doc;
        return {
          ...clean,
          id: clean.id || _id.toString(),
          name: clean.name || clean.title,
        };
      });

      dbCategories = await db.collection('categories').find({
        $or: [{ tenantSlug }, { storeSlug: tenantSlug }, { tenantId: tenantSlug }, { tenantId: `store_${tenantSlug}` }],
      }).toArray();
    }

    if (allProducts.length === 0) {
      const prodsRes = await ProductService.getAllProducts(tenantSlug);
      allProducts = prodsRes.data || [];
    }

    const suggestions: any[] = [];

    // Matching products
    const matchingProds = allProducts
      .filter((p: any) => p.name?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query))
      .slice(0, 4);

    for (const p of matchingProds) {
      const pUrl = tenantSlug && tenantSlug !== 'demo'
        ? `/stores/${tenantSlug}/${p.category || 'products'}/${p.slug || p.id}`
        : `/products/${p.slug || p.id}`;
      suggestions.push({
        type: 'product',
        id: p.id,
        label: p.name,
        category: p.category,
        price: p.price,
        image: Array.isArray(p.images) ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url) : (p.image || ''),
        url: pUrl,
      });
    }

    // Matching categories from DB
    const matchingCats = dbCategories
      .filter((c: any) => (c.name || '').toLowerCase().includes(query) || (c.slug || '').toLowerCase().includes(query))
      .slice(0, 2);

    for (const c of matchingCats) {
      const catUrl = tenantSlug && tenantSlug !== 'demo'
        ? `/stores/${tenantSlug}/${c.slug || c.id}`
        : `/collections/${c.slug || c.id}`;
      suggestions.push({
        type: 'category',
        label: `Explore in ${c.name}`,
        url: catUrl,
      });
    }

    return NextResponse.json({
      success: true,
      query,
      suggestions,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

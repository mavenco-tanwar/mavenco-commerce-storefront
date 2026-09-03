import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PimService } from '@/server/pim/pim.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  const minCompleteness = searchParams.get('minCompleteness') ? parseInt(searchParams.get('minCompleteness')!, 10) : undefined;
  const minQuality = searchParams.get('minQuality') ? parseInt(searchParams.get('minQuality')!, 10) : undefined;
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const db = await getDatabase();
    let dbProducts: any[] = [];
    if (db) {
      const tenantMatchConditions: any[] = [{ tenantSlug }, { storeSlug: tenantSlug }, { tenantId: tenantSlug }];
      if (tenantSlug === 'demo' || tenantSlug === 'lumina') {
        tenantMatchConditions.push({ tenantSlug: 'demo' }, { tenantSlug: 'lumina' }, { tenantId: 'demo' }, { tenantId: 'lumina' });
      }

      const query: Record<string, any> = {
        $or: tenantMatchConditions,
      };

      if (category && category !== 'all') {
        query.$and = [{ $or: [{ categoryIds: category }, { category: category }, { categories: category }] }];
      }

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const raw = await db.collection('products').find(query).toArray();
      dbProducts = raw.map(({ _id, ...clean }) => ({
        ...clean,
        id: clean.id || clean._id,
        title: clean.title || clean.name,
        name: clean.name || clean.title,
      }));
    }

    const { products: pimProducts, total: pimTotal } = await PimService.getProducts(tenantSlug, {
      category,
      search,
      status,
      brandId,
      minCompleteness,
      minQuality,
      page,
      limit,
    });

    // Merge MongoDB products and PIM products (dedup by slug / id)
    const existingSlugs = new Set<string>();
    const merged: any[] = [];

    for (const p of dbProducts) {
      if (p.slug && !existingSlugs.has(p.slug)) {
        existingSlugs.add(p.slug);
        merged.push(p);
      }
    }

    for (const p of pimProducts) {
      if (p.slug && !existingSlugs.has(p.slug)) {
        existingSlugs.add(p.slug);
        merged.push(p);
      }
    }

    return NextResponse.json(
      {
        data: merged,
        total: merged.length,
        page,
        limit,
        source: 'pim_authoritative',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('PIM products query error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantSlug = (body.tenantSlug || body.tenantId || request.headers.get('x-tenant-slug') || 'demo').toLowerCase().trim();
    const operator = request.headers.get('x-user-name') || 'Admin Curator';

    const saved = await PimService.upsertProduct(tenantSlug, body, operator);

    // Sync to MongoDB products collection with safe upsert
    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('products').updateOne(
          { $or: [{ id: saved.id }, { slug: saved.slug }] },
          {
            $set: {
              ...saved,
              tenantId: tenantSlug,
              tenantSlug,
              storeSlug: tenantSlug,
              updatedAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );
      }
    } catch (e) {
      console.warn('Failed to upsert product in MongoDB:', e);
    }

    return NextResponse.json(
      {
        success: true,
        data: saved,
        source: 'pim_authoritative',
        message: 'Product created and validated in PIM',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

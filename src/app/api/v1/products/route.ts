import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PimService } from '@/server/pim/pim.service';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name, X-Store-ID, X-API-Key, X-Tenant-Slug, x-store-id, x-api-key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
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
    const tenantSlug = await resolveRequestTenantSlug(request, searchParams, db);
    let dbProducts: any[] = [];
    if (db) {
      const tenantMatchConditions: any[] = [];
      if (tenantSlug) {
        tenantMatchConditions.push(
          { tenantSlug },
          { storeSlug: tenantSlug },
          { tenantId: tenantSlug },
          { tenantId: `store_${tenantSlug}` }
        );
      }

      const query: Record<string, any> = tenantMatchConditions.length > 0 ? { $or: tenantMatchConditions } : {};

      if (category && category !== 'all') {
        query.$and = [{ $or: [{ categoryIds: category }, { category: category }, { categories: category }] }];
      }

      if (status && status !== 'all') {
        if (status === 'published') {
          query.status = { $in: ['published', 'active'] };
        } else {
          query.status = status;
        }
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

      // Also check pim_products collection in MongoDB
      try {
        const rawPim = await db.collection('pim_products').find(query).toArray();
        const existingIds = new Set(dbProducts.map((p) => p.id));
        for (const rawItem of rawPim) {
          const { _id, ...clean } = rawItem;
          const itemId = clean.id || _id;
          if (!existingIds.has(itemId)) {
            existingIds.add(itemId);
            dbProducts.push({
              ...clean,
              id: itemId,
              title: clean.title || clean.name,
              name: clean.name || clean.title,
            });
          }
        }
      } catch {}
    }

    let finalProducts = dbProducts;

    // Only if database returned zero products AND tenant is demo, fall back to PimService
    if (finalProducts.length === 0 && (!tenantSlug || tenantSlug === 'demo')) {
      const { products: pimProducts } = await PimService.getProducts(tenantSlug || 'demo', {
        category,
        search,
        status,
        brandId,
        minCompleteness,
        minQuality,
        page,
        limit,
      });
      finalProducts = pimProducts;
    }

    return NextResponse.json(
      {
        data: finalProducts,
        total: finalProducts.length,
        page,
        limit,
        source: 'authoritative_db',
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
    const db = await getDatabase();
    const rawResolved =
      request.headers.get('x-tenant-slug') ||
      request.headers.get('x-store-slug') ||
      body.tenantId ||
      body.storeSlug ||
      body.tenantSlug ||
      (await resolveRequestTenantSlug(request, undefined, db));
    const tenantSlug = (rawResolved || '').replace(/^store_/, '').toLowerCase().trim();
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('slug');
    const ids = searchParams.get('ids')?.split(',') || [];
    if (id) ids.push(id);

    const db = await getDatabase();
    if (db && ids.length > 0) {
      const { ObjectId } = await import('mongodb');
      const orConditions: any[] = [];
      for (const rawId of ids) {
        const clean = decodeURIComponent(rawId).trim();
        orConditions.push({ id: clean }, { slug: clean }, { sku: clean });
        if (ObjectId.isValid(clean) && clean.length === 24) {
          orConditions.push({ _id: new ObjectId(clean) });
        }
      }

      const pRes = await db.collection('products').deleteMany({ $or: orConditions });
      const pimRes = await db.collection('pim_products').deleteMany({ $or: orConditions });

      return NextResponse.json(
        {
          success: true,
          message: 'Products permanently deleted from database',
          deletedCount: (pRes.deletedCount || 0) + (pimRes.deletedCount || 0),
        },
        { headers: corsHeaders() }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

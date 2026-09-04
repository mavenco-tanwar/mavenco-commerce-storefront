import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getProductsForTenant } from '@/data/products';
import { PimService } from '@/server/pim/pim.service';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name, X-Store-ID, X-API-Key, X-Tenant-Slug, x-store-id, x-api-key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const { searchParams } = new URL(request.url);
  const db = await getDatabase();
  const tenantSlug = await resolveRequestTenantSlug(request, searchParams, db);

  // Try PIM first
  try {
    const pimProduct = await PimService.getProductById(tenantSlug, decodedSlug);
    if (pimProduct) {
      return NextResponse.json({ data: pimProduct, source: 'pim_authoritative' }, { headers: corsHeaders() });
    }
  } catch {}

  // Try MongoDB
  if (db) {
    const { ObjectId } = await import('mongodb');
    let objId = null;
    try {
      if (ObjectId.isValid(decodedSlug) && decodedSlug.length === 24) {
        objId = new ObjectId(decodedSlug);
      }
    } catch {}

    const product = await db.collection('products').findOne({
      $and: [
        {
          $or: [
            { tenantSlug },
            { storeSlug: tenantSlug },
            { tenantId: tenantSlug },
            { tenantId: `store_${tenantSlug}` },
          ],
        },
        {
          $or: [
            { slug: decodedSlug },
            { id: decodedSlug },
            { sku: decodedSlug },
            ...(objId ? [{ _id: objId }] : []),
          ],
        },
      ],
    });

    if (product) {
      const { _id, ...rest } = product;
      return NextResponse.json({ data: { ...rest, id: rest.id || _id.toString() }, source: 'database' }, { headers: corsHeaders() });
    }
  }

  // Fallback to static tenant catalog
  const tenantCatalog = getProductsForTenant(tenantSlug);
  const found = tenantCatalog.find(
    (p) => p.slug === decodedSlug || p.id === decodedSlug || p.sku === decodedSlug
  );

  return NextResponse.json({ data: found || null, source: 'fallback' }, { headers: corsHeaders() });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return handleUpdate(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return handleUpdate(request, params);
}

async function handleUpdate(
  request: NextRequest,
  params: Promise<{ slug: string }>
) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const db = await getDatabase();
  const tenantSlug = await resolveRequestTenantSlug(request, undefined, db);
  const operator = request.headers.get('x-user-name') || 'Admin User';

  try {
    const body = await request.json();

    // Update through authoritative PIM service if available
    try {
      const existingPim = await PimService.getProductById(tenantSlug, decodedSlug);
      if (existingPim) {
        await PimService.upsertProduct(
          tenantSlug,
          {
            ...existingPim,
            ...body,
            id: existingPim.id || decodedSlug,
            slug: body.slug || existingPim.slug || decodedSlug,
          },
          operator
        );
      }
    } catch {}

    // Update MongoDB products and pim_products collections
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(decodedSlug) && decodedSlug.length === 24) {
          objId = new ObjectId(decodedSlug);
        }
      } catch {}

      const matchQuery: Record<string, any> = {
        $or: [
          { slug: decodedSlug },
          { id: decodedSlug },
          { sku: decodedSlug },
          ...(objId ? [{ _id: objId }] : []),
        ],
      };

      const updatePayload = {
        ...body,
        updatedAt: new Date().toISOString(),
      };

      await db.collection('products').updateMany(matchQuery, { $set: updatePayload });
      await db.collection('pim_products').updateMany(matchQuery, { $set: updatePayload });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const tenantSlug = (request.headers.get('x-tenant-slug') || request.headers.get('x-store-slug') || '').toLowerCase().trim();
  const operator = request.headers.get('x-user-name') || 'Admin User';

  try {
    if (tenantSlug) {
      try {
        const existing = await PimService.getProductById(tenantSlug, decodedSlug);
        if (existing) {
          await PimService.deleteProduct(tenantSlug, existing.id, operator);
        }
      } catch {}
    }

    const db = await getDatabase();
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(decodedSlug) && decodedSlug.length === 24) {
          objId = new ObjectId(decodedSlug);
        }
      } catch {}

      const deleteQuery: Record<string, any> = {
        $or: [
          { slug: decodedSlug },
          { id: decodedSlug },
          { sku: decodedSlug },
          ...(objId ? [{ _id: objId }] : []),
        ],
      };

      const pRes = await db.collection('products').deleteMany(deleteQuery);
      const pimRes = await db.collection('pim_products').deleteMany(deleteQuery);

      return NextResponse.json(
        {
          success: true,
          message: 'Product permanently deleted from database',
          deletedCount: (pRes.deletedCount || 0) + (pimRes.deletedCount || 0),
        },
        { headers: corsHeaders() }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted' }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

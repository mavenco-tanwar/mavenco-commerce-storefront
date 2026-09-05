import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getProductsForTenant } from '@/data/products';
import { PimService } from '@/server/pim/pim.service';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-Tenant-Slug, x-tenant, x-store-slug, x-store-id, x-user-name, X-Store-ID, X-API-Key, x-api-key, *',
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

      const updatePayload: Record<string, any> = {
        ...body,
        updatedAt: new Date().toISOString(),
      };
      delete updatePayload._id;

      // Harmonize flags & badges without dot notation conflict
      const isFeatured = Boolean(body.badges?.isFeatured ?? body.flags?.isFeatured ?? body.isFeatured ?? false);
      const isNewArrival = Boolean(body.badges?.isNewArrival ?? body.flags?.isNew ?? body.isNewArrival ?? false);
      const isBestSeller = Boolean(body.badges?.isBestSeller ?? body.flags?.isBestSeller ?? body.isBestSeller ?? false);

      updatePayload.flags = {
        ...(body.flags && typeof body.flags === 'object' ? body.flags : {}),
        isFeatured,
        isNew: isNewArrival,
        isBestSeller,
      };
      updatePayload.badges = {
        ...(body.badges && typeof body.badges === 'object' ? body.badges : {}),
        isFeatured,
        isNewArrival,
        isBestSeller,
      };
      updatePayload.isFeatured = isFeatured;
      updatePayload.isNewArrival = isNewArrival;
      updatePayload.isBestSeller = isBestSeller;

      // Ensure no conflicting dot-notation keys exist
      delete updatePayload['flags.isFeatured'];
      delete updatePayload['flags.isNew'];
      delete updatePayload['flags.isBestSeller'];
      delete updatePayload['badges.isFeatured'];
      delete updatePayload['badges.isNewArrival'];
      delete updatePayload['badges.isBestSeller'];

      if (body.shipping?.weightKg !== undefined) {
        updatePayload.weight = body.shipping.weightKg;
      }

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
  const { searchParams } = new URL(request.url);
  const extraSlug = searchParams.get('slug') ? decodeURIComponent(searchParams.get('slug')!).trim() : undefined;
  const tenantSlug = (
    searchParams.get('tenant') ||
    searchParams.get('tenantSlug') ||
    request.headers.get('x-tenant-slug') ||
    request.headers.get('x-store-slug') ||
    ''
  ).toLowerCase().trim();
  const operator = request.headers.get('x-user-name') || 'Admin User';

  try {
    if (tenantSlug) {
      try {
        const existing = await PimService.getProductById(tenantSlug, decodedSlug);
        if (existing) {
          await PimService.deleteProduct(tenantSlug, existing.id, operator);
        }
      } catch {}
      if (extraSlug) {
        try {
          const existingExtra = await PimService.getProductById(tenantSlug, extraSlug);
          if (existingExtra) {
            await PimService.deleteProduct(tenantSlug, existingExtra.id, operator);
          }
        } catch {}
      }
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

      const deleteConditions: any[] = [
        { slug: decodedSlug },
        { id: decodedSlug },
        { _id: decodedSlug },
        { sku: decodedSlug },
        ...(objId ? [{ _id: objId }] : []),
      ];

      if (extraSlug) {
        deleteConditions.push({ slug: extraSlug }, { id: extraSlug }, { _id: extraSlug });
      }

      const pRes = await db.collection('products').deleteMany({ $or: deleteConditions });
      const pimRes = await db.collection('pim_products').deleteMany({ $or: deleteConditions });

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

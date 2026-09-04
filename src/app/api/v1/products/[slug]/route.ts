import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getProductsForTenant } from '@/data/products';
import { PimService } from '@/server/pim/pim.service';

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
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();

  // Try PIM first
  const pimProduct = await PimService.getProductById(tenantSlug, slug);
  if (pimProduct) {
    return NextResponse.json({ data: pimProduct, source: 'pim_authoritative' }, { headers: corsHeaders() });
  }

  try {
    const db = await getDatabase();
    if (db) {
      // 1. Primary query: match slug/id with tenant
      const tenantMatchConditions: any[] = [{ tenantSlug }, { storeSlug: tenantSlug }, { tenantId: tenantSlug }];
      if (tenantSlug === 'demo' || tenantSlug === 'lumina') {
        tenantMatchConditions.push({ tenantSlug: 'demo' }, { tenantSlug: 'lumina' }, { tenantId: 'demo' }, { tenantId: 'lumina' });
      }

      const query: Record<string, any> = {
        $or: [{ slug: slug }, { id: slug }],
      };

      if (tenantSlug) {
        query.$and = [{ $or: tenantMatchConditions }];
      }

      let product = await db.collection('products').findOne(query);

      // 2. Secondary query: if not found with tenant filter, check by slug directly
      if (!product) {
        product = await db.collection('products').findOne({
          $or: [{ slug: slug }, { id: slug }],
        });
      }

      if (product) {
        const { _id, ...clean } = product;
        return NextResponse.json({ data: clean, source: 'mongodb_atlas' }, { headers: corsHeaders() });
      }
    }
  } catch (err) {
    console.error('MongoDB product by slug error:', err);
  }

  // Fallback
  const all = getProductsForTenant(tenantSlug);
  const found = all.find((p) => p.slug === slug || p.id === slug) || null;

  return NextResponse.json({ data: found, source: 'fallback' }, { headers: corsHeaders() });
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
  const tenantSlug = (request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
  const operator = request.headers.get('x-user-name') || 'Admin User';

  try {
    const body = await request.json();

    // Update through authoritative PIM service
    const existingPim = await PimService.getProductById(tenantSlug, slug);
    const updated = await PimService.upsertProduct(
      tenantSlug,
      {
        ...(existingPim || {}),
        ...body,
        id: existingPim?.id || slug,
        slug: body.slug || existingPim?.slug || slug,
      },
      operator
    );

    // Sync to legacy MongoDB products collection if available
    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('products').updateOne(
          { $or: [{ slug: slug }, { id: slug }] },
          { $set: { ...body, updatedAt: new Date().toISOString() } }
        );
      }
    } catch {}

    return NextResponse.json({ success: true, data: updated, message: 'Product updated successfully' }, { headers: corsHeaders() });
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

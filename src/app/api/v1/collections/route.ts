import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name, X-Store-ID, X-API-Key, X-Tenant-Slug, x-store-id, x-api-key, *',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTenant =
      searchParams.get('tenant') ||
      searchParams.get('store') ||
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-tenant') ||
      req.headers.get('X-Tenant-Slug');

    const tenantSlug = rawTenant ? rawTenant.replace(/^store_/, '').trim().toLowerCase() : undefined;

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('collections');

      let query: Record<string, any> = {};
      if (tenantSlug && tenantSlug !== 'all') {
        query = {
          $or: [
            { tenantId: tenantSlug },
            { tenantId: `store_${tenantSlug}` },
            { tenantId: new RegExp(tenantSlug, 'i') },
            { storeSlug: tenantSlug },
            { tenantSlug: tenantSlug },
          ],
        };
      }

      const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch collections' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const rawTenant =
      body.tenantSlug ||
      body.storeSlug ||
      body.tenantId ||
      searchParams.get('tenant') ||
      searchParams.get('store') ||
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-tenant') ||
      req.headers.get('X-Tenant-Slug') ||
      'jq-trends';

    const tenantSlug = rawTenant.replace(/^store_/, '').trim().toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const cleanId = body.id || `col_${Date.now()}`;
    const cleanTitle = body.title || body.name || 'New Collection';
    const cleanSlug = body.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCollection = {
      ...body,
      id: cleanId,
      title: cleanTitle,
      slug: cleanSlug,
      tenantId: tenantSlug,
      tenantSlug: tenantSlug,
      storeSlug: tenantSlug,
      productIds: Array.isArray(body.productIds) ? body.productIds : [],
      productCount: Array.isArray(body.productIds) ? body.productIds.length : (body.productCount || 0),
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('collections').updateOne(
        { $or: [{ id: cleanId }, { slug: cleanSlug, tenantId: tenantSlug }] },
        { $set: newCollection },
        { upsert: true }
      );
    }

    return NextResponse.json(
      { success: true, data: newCollection, message: 'Collection saved in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id') || searchParams.get('slug');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id || body?.slug;
      } catch {}
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID or slug is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const cleanId = decodeURIComponent(id).trim();
    const db = await getDatabase();
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(cleanId) && cleanId.length === 24) objId = new ObjectId(cleanId);
      } catch {}

      await db.collection('collections').deleteMany({
        $or: [{ id: cleanId }, { slug: cleanId }, ...(objId ? [{ _id: objId }] : [])],
      });
    }

    return NextResponse.json(
      { success: true, message: 'Collection deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

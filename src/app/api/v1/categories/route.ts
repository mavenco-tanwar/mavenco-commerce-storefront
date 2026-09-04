import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const db = await getDatabase();

    const rawTenant =
      searchParams.get('tenant') ||
      searchParams.get('store') ||
      searchParams.get('tenantSlug') ||
      searchParams.get('tenantId') ||
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-tenant') ||
      req.headers.get('X-Tenant-Slug');

    let tenantSlug = rawTenant
      ? rawTenant.replace(/^store_/, '').trim().toLowerCase()
      : await resolveRequestTenantSlug(req, searchParams, db);

    if (!tenantSlug || tenantSlug === 'all' || tenantSlug === 'lumina') {
      tenantSlug = 'jq-trends';
    }

    const department = searchParams.get('department') || undefined;

    if (db) {
      const collection = db.collection('categories');
      const tenantMatchConditions: any[] = [
        { tenantSlug },
        { storeSlug: tenantSlug },
        { tenantId: tenantSlug },
        { tenantId: `store_${tenantSlug}` },
      ];

      const query: Record<string, any> = {
        $or: tenantMatchConditions,
      };

      if (department) {
        query.department = department;
      }

      const docs = await collection
        .find(query)
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
    const db = await getDatabase();
    const { searchParams } = new URL(req.url);

    // Explicit tenant from body has highest precedence, followed by query params, then headers
    const rawTenant =
      body.tenantSlug ||
      body.storeSlug ||
      body.tenantId ||
      searchParams.get('tenant') ||
      searchParams.get('store') ||
      req.headers.get('x-tenant-slug') ||
      req.headers.get('x-tenant') ||
      req.headers.get('X-Tenant-Slug');

    let tenantSlug = rawTenant
      ? rawTenant.replace(/^store_/, '').trim().toLowerCase()
      : await resolveRequestTenantSlug(req, searchParams, db);

    if (!tenantSlug || tenantSlug === 'all' || tenantSlug === 'lumina') {
      tenantSlug = 'jq-trends';
    }

    const now = new Date().toISOString();
    const cleanName = body.name || 'New Category';
    const cleanSlug = body.slug || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const catId = body.id || `cat_${cleanSlug}_${tenantSlug}`;

    const newCategory = {
      ...body,
      id: catId,
      name: cleanName,
      slug: cleanSlug,
      tenantId: `store_${tenantSlug}`,
      tenantSlug,
      storeSlug: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('categories').updateOne(
        { $or: [{ id: catId }, { slug: cleanSlug, tenantSlug }] },
        { $set: newCategory },
        { upsert: true }
      );
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

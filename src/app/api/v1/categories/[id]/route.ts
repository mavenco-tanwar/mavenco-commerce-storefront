import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const body = await req.json();
    const db = await getDatabase();
    const { searchParams } = new URL(req.url);

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

    if (db) {
      const { _id, createdAt, ...updates } = body;
      const tenantMatchConditions = [
        { tenantSlug },
        { storeSlug: tenantSlug },
        { tenantId: tenantSlug },
        { tenantId: `store_${tenantSlug}` },
      ];

      await db.collection('categories').updateOne(
        {
          $and: [
            { $or: [{ id }, { slug: id }] },
            { $or: tenantMatchConditions },
          ],
        },
        {
          $set: {
            ...updates,
            tenantSlug,
            storeSlug: tenantSlug,
            tenantId: `store_${tenantSlug}`,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    }
    return NextResponse.json({ success: true, message: 'Category updated in MongoDB' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const db = await getDatabase();
    const { searchParams } = new URL(req.url);

    const rawTenant =
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

    if (db) {
      const tenantMatchConditions = [
        { tenantSlug },
        { storeSlug: tenantSlug },
        { tenantId: tenantSlug },
        { tenantId: `store_${tenantSlug}` },
      ];

      // 1. Locate the exact category belonging to this tenant
      const targetCat = await db.collection('categories').findOne({
        $and: [
          { $or: [{ id }, { slug: id }] },
          { $or: tenantMatchConditions },
        ],
      });

      if (!targetCat) {
        return NextResponse.json(
          { success: true, message: 'Category not found or already deleted' },
          { headers: corsHeaders() }
        );
      }

      const targetId = targetCat.id || id;

      if (targetCat.parentId) {
        // SUBCATEGORY: Delete ONLY this specific subcategory! Do not delete parent or other subcategories!
        await db.collection('categories').deleteOne({
          $and: [
            { id: targetId },
            { $or: tenantMatchConditions },
          ],
        });
      } else {
        // PRIMARY DEPARTMENT: Delete this department and its direct children within THIS tenant only
        await db.collection('categories').deleteMany({
          $and: [
            { $or: [{ id: targetId }, { parentId: targetId }] },
            { $or: tenantMatchConditions },
          ],
        });
      }
    }
    return NextResponse.json({ success: true, message: 'Category deleted from MongoDB' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;
    const id = decodeURIComponent(rawId || '').trim();

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400, headers: corsHeaders() }
      );
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
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(id) && id.length === 24) objId = new ObjectId(id);
      } catch {}

      const { _id, createdAt, ...updates } = body;

      const updateData: Record<string, any> = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (tenantSlug) {
        updateData.tenantSlug = tenantSlug;
        updateData.storeSlug = tenantSlug;
        updateData.tenantId = `store_${tenantSlug}`;
      }

      await db.collection('categories').updateOne(
        {
          $or: [
            { id },
            { slug: id },
            ...(objId ? [{ _id: objId }] : []),
          ],
        },
        { $set: updateData }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Category updated in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;
    const id = decodeURIComponent(rawId || '').trim();

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 500, headers: corsHeaders() }
      );
    }

    const { ObjectId } = await import('mongodb');
    let objId = null;
    try {
      if (ObjectId.isValid(id) && id.length === 24) {
        objId = new ObjectId(id);
      }
    } catch {}

    const idMatches = [
      { id },
      { slug: id },
      ...(objId ? [{ _id: objId }] : []),
    ];

    // 1. Locate category to see if it is a department or subcategory
    const targetCat = await db.collection('categories').findOne({
      $or: idMatches,
    });

    if (targetCat) {
      const targetId = targetCat.id || id;
      const targetSlug = targetCat.slug;

      if (targetCat.parentId) {
        // SUBCATEGORY: Delete ONLY this specific subcategory
        await db.collection('categories').deleteMany({
          $or: [
            { id: targetId },
            ...(targetCat._id ? [{ _id: targetCat._id }] : []),
          ],
        });
      } else {
        // PRIMARY DEPARTMENT: Delete department and all nested subcategories
        await db.collection('categories').deleteMany({
          $or: [
            { id: targetId },
            { parentId: targetId },
            ...(targetSlug ? [{ parentId: targetSlug }] : []),
            ...(targetCat._id ? [{ _id: targetCat._id }] : []),
          ],
        });
      }
    } else {
      // Fallback cleanup in case of orphaned or mismatched records
      await db.collection('categories').deleteMany({
        $or: [
          ...idMatches,
          { parentId: id },
        ],
      });
    }

    // 2. Automatically unassign deleted category from any products in the database
    const deletedIdentifiers = [
      id,
      targetCat?.id,
      targetCat?.slug,
      targetCat?._id?.toString(),
      `cat_${id}`,
    ].filter(Boolean);

    await db.collection('products').updateMany(
      {
        $or: [
          { categoryIds: { $in: deletedIdentifiers } },
          { categoryId: { $in: deletedIdentifiers } },
          { department: { $in: deletedIdentifiers } },
          { category: { $in: deletedIdentifiers } },
          { categorySlug: { $in: deletedIdentifiers } },
        ],
      },
      {
        $pull: { categoryIds: { $in: deletedIdentifiers } } as any,
        $set: {
          category: null,
          categoryName: null,
          categorySlug: null,
          department: null,
          categoryId: null,
        },
      }
    );

    return NextResponse.json(
      { success: true, message: 'Category deleted successfully from MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

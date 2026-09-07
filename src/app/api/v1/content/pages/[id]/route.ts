import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, X-Tenant-Slug',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

/**
 * GET /api/v1/content/pages/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    let query: any = { $or: [{ id }, { slug: id }, { slug: `/${id}` }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const doc = await db.collection('cms_pages').findOne(query);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404, headers: corsHeaders() });
    }

    const { _id, ...clean } = doc;
    return NextResponse.json(
      {
        success: true,
        data: { id: clean.id || _id.toString(), ...clean },
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * PATCH /api/v1/content/pages/[id]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const db = await getDatabase();

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    let query: any = { $or: [{ id }, { slug: id }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt: now };

    if (cleanUpdates.slug) {
      cleanUpdates.slug = cleanUpdates.slug.replace(/^\//, '');
    }

    const result = await db.collection('cms_pages').findOneAndUpdate(
      query,
      { $set: cleanUpdates },
      { returnDocument: 'after' }
    );

    const updatedDoc = result ? ((result as any).value || result) : null;

    try {
      if (updatedDoc?.slug) {
        revalidatePath(`/${updatedDoc.slug}`);
        if (updatedDoc.tenantSlug) {
          revalidatePath(`/stores/${updatedDoc.tenantSlug}/${updatedDoc.slug}`);
        }
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: updatedDoc,
        message: 'Page updated successfully',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

/**
 * PUT /api/v1/content/pages/[id]
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(req, context);
}

/**
 * DELETE /api/v1/content/pages/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    let query: any = { $or: [{ id }, { slug: id }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const pageToDelete = await db.collection('cms_pages').findOne(query);
    await db.collection('cms_pages').deleteOne(query);

    try {
      if (pageToDelete?.slug) {
        revalidatePath(`/${pageToDelete.slug}`);
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Page deleted successfully',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

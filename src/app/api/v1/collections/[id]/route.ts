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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;
    const id = decodeURIComponent(rawId || '').trim();
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ success: false, error: 'Collection ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const db = await getDatabase();
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(id) && id.length === 24) objId = new ObjectId(id);
      } catch {}

      const col = await db.collection('collections').findOne({
        $or: [{ id }, { slug: id }, ...(objId ? [{ _id: objId }] : [])],
      });
      if (col) {
        const { _id, ...clean } = col;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }
    return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
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
      return NextResponse.json({ success: false, error: 'Collection ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const body = await req.json();
    const db = await getDatabase();
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(id) && id.length === 24) objId = new ObjectId(id);
      } catch {}

      const updateData: any = { ...body, updatedAt: new Date().toISOString() };
      if (Array.isArray(body.productIds)) {
        updateData.productCount = body.productIds.length;
      }
      await db.collection('collections').updateMany(
        { $or: [{ id }, { slug: id }, ...(objId ? [{ _id: objId }] : [])] },
        { $set: updateData }
      );
    }
    return NextResponse.json({ success: true, message: 'Collection updated in MongoDB' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
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
      return NextResponse.json({ success: false, error: 'Collection ID is required' }, { status: 400, headers: corsHeaders() });
    }

    const db = await getDatabase();
    if (db) {
      const { ObjectId } = await import('mongodb');
      let objId = null;
      try {
        if (ObjectId.isValid(id) && id.length === 24) objId = new ObjectId(id);
      } catch {}

      await db.collection('collections').deleteMany({
        $or: [{ id }, { slug: id }, ...(objId ? [{ _id: objId }] : [])],
      });
    }
    return NextResponse.json({ success: true, message: 'Collection deleted from MongoDB' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

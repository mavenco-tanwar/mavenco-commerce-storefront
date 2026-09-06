import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || '').toLowerCase().trim();

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const query: any = {
      $or: [
        { id },
        { slug: id },
      ],
    };

    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const doc = await db.collection('cms_pages').findOne(query);
    if (!doc) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: corsHeaders() });
    }

    const { _id, ...cleanDoc } = doc;
    return NextResponse.json(
      {
        data: { id: doc.id || _id.toString(), ...cleanDoc },
        status: 'success',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const query: any = {
      $or: [{ id }, { slug: id }],
    };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) updateFields.name = body.name;
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.slug !== undefined) updateFields.slug = body.slug;
    if (body.content !== undefined) updateFields.content = body.content;
    if (body.seo !== undefined) updateFields.seo = body.seo;
    if (body.settings !== undefined) updateFields.settings = body.settings;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.version !== undefined) updateFields.version = body.version;

    const result = await db.collection('cms_pages').updateOne(query, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Page not found to update' }, { status: 404, headers: corsHeaders() });
    }

    try {
      if (body.slug) {
        revalidatePath(`/${body.slug}`);
      }
    } catch {}

    return NextResponse.json(
      { success: true, message: 'Page draft saved successfully' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const query: any = {
      $or: [{ id }, { slug: id }],
    };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    await db.collection('cms_pages').deleteOne(query);

    return NextResponse.json(
      { success: true, message: 'Page deleted successfully' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

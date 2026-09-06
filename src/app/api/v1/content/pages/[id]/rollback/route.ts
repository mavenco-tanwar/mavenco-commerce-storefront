import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const targetVersion = body.version;

    if (!targetVersion) {
      return NextResponse.json({ error: 'Target version number required' }, { status: 400, headers: corsHeaders() });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503, headers: corsHeaders() });
    }

    // 1. Find the historical version snapshot
    const snapshot = await db.collection('cms_page_versions').findOne({
      $or: [{ pageId: id }, { slug: id }],
      version: Number(targetVersion),
    });

    if (!snapshot) {
      return NextResponse.json({ error: `Version ${targetVersion} not found` }, { status: 404, headers: corsHeaders() });
    }

    // 2. Find the current live page
    const query: any = { $or: [{ id }, { slug: id }] };
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }
    const currentDoc = await db.collection('cms_pages').findOne(query);
    if (!currentDoc) {
      return NextResponse.json({ error: 'Current page not found' }, { status: 404, headers: corsHeaders() });
    }

    const newVersion = (currentDoc.version || 1) + 1;
    const now = new Date().toISOString();

    // 3. Create a new version record representing the rollback
    await db.collection('cms_page_versions').insertOne({
      id: `ver_${Date.now().toString(36)}`,
      pageId: currentDoc.id || currentDoc._id.toString(),
      tenantId: currentDoc.tenantId || currentDoc.tenantSlug || 'lumina',
      version: newVersion,
      name: snapshot.name || currentDoc.name,
      slug: snapshot.slug || currentDoc.slug,
      type: snapshot.type || currentDoc.type,
      content: snapshot.content,
      seo: snapshot.seo || currentDoc.seo,
      settings: snapshot.settings || currentDoc.settings,
      publishReason: `Rolled back to Version ${targetVersion}`,
      publishedAt: now,
      createdAt: now,
    });

    // 4. Update the live page document
    await db.collection('cms_pages').updateOne(query, {
      $set: {
        status: 'published',
        version: newVersion,
        content: snapshot.content,
        seo: snapshot.seo || currentDoc.seo,
        settings: snapshot.settings || currentDoc.settings,
        updatedAt: now,
        publishedAt: now,
      },
    });

    try {
      revalidatePath(`/${currentDoc.slug}`);
      revalidatePath(`/stores/${currentDoc.tenantSlug || currentDoc.tenantId}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: `Successfully rolled back to Version ${targetVersion}. Published as Version ${newVersion}.`,
        newVersion,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

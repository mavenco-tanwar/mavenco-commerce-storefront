import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { validateTree } from '@/lib/page-builder/tree-utils';

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

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

    const doc = await db.collection('cms_pages').findOne(query);
    if (!doc) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: corsHeaders() });
    }

    // Merge incoming content if provided
    const content = body.content || doc.content;
    if (content?.root) {
      const validation = validateTree(content.root);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: 'Page structure validation failed', errors: validation.errors },
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    const nextVersion = (doc.version || 1) + 1;
    const now = new Date().toISOString();

    // 1. Create Immutable Version Snapshot
    const versionRecord = {
      id: `ver_${Date.now().toString(36)}`,
      pageId: doc.id || doc._id.toString(),
      tenantId: doc.tenantId || doc.tenantSlug || 'lumina',
      version: nextVersion,
      name: doc.name || doc.title,
      slug: doc.slug,
      type: doc.type,
      content,
      seo: doc.seo,
      settings: doc.settings,
      publishReason: body.publishReason || 'Published live from Visual Builder',
      publishedAt: now,
      createdAt: now,
    };

    await db.collection('cms_page_versions').insertOne(versionRecord);

    // 2. Update Live Page Document
    await db.collection('cms_pages').updateOne(query, {
      $set: {
        status: 'published',
        version: nextVersion,
        content,
        updatedAt: now,
        publishedAt: now,
      },
    });

    // 3. Revalidate ISR / Next.js Caches
    try {
      revalidatePath(`/${doc.slug}`);
      revalidatePath(`/stores/${doc.tenantSlug || doc.tenantId}`);
      if (doc.type === 'homepage') {
        revalidatePath('/');
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: `Version ${nextVersion} published live successfully`,
        version: nextVersion,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

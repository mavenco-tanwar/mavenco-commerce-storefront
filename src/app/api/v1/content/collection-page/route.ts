import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultCollectionPageConfig } from '@/lib/collection-page-presets';
import { CollectionPageConfig } from '@/types/collection-page.types';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (
    searchParams.get('tenant') ||
    request.headers.get('x-tenant-slug') ||
    'lumina'
  )
    .toLowerCase()
    .trim();
  const templateId = searchParams.get('template') || 'default_fashion';
  const isPreview = searchParams.get('preview') === 'draft';

  const defaultCfg = getDefaultCollectionPageConfig(tenantSlug);

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('collection_page_configs').findOne({
        tenantId: tenantSlug,
        templateId,
      });

      if (doc) {
        if (isPreview && doc.draft) {
          return NextResponse.json(
            { success: true, data: { ...defaultCfg, ...doc.draft, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
        if (doc.published) {
          return NextResponse.json(
            { success: true, data: { ...defaultCfg, ...doc.published, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
        if (doc.draft) {
          return NextResponse.json(
            { success: true, data: { ...defaultCfg, ...doc.draft, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
      }
    }
  } catch (err) {
    console.warn('Collection page config fetch error, falling back to preset:', err);
  }

  return NextResponse.json({ success: true, data: defaultCfg }, { headers: corsHeaders() });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (
    searchParams.get('tenant') ||
    request.headers.get('x-tenant-slug') ||
    'lumina'
  )
    .toLowerCase()
    .trim();

  try {
    const body: CollectionPageConfig = await request.json();
    const db = await getDatabase();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    const templateId = body.templateId || 'default_fashion';
    const now = new Date().toISOString();
    const isPublish = body.status === 'published';

    const updateQuery: any = {
      $set: {
        tenantId: tenantSlug,
        templateId,
        updatedAt: now,
      },
    };

    if (isPublish) {
      const pubVersion = body.version || 1;
      const publishedDoc: CollectionPageConfig = {
        ...body,
        tenantId: tenantSlug,
        templateId,
        status: 'published',
        version: pubVersion,
        publishedAt: now,
        updatedAt: now,
      };

      updateQuery.$set.published = publishedDoc;
      updateQuery.$set.draft = publishedDoc;

      // Save version snapshot
      await db.collection('collection_page_versions').insertOne({
        tenantId: tenantSlug,
        templateId,
        version: pubVersion,
        name: `Version ${pubVersion}`,
        config: publishedDoc,
        publishedAt: now,
        createdAt: now,
      });
    } else {
      const draftDoc: CollectionPageConfig = {
        ...body,
        tenantId: tenantSlug,
        templateId,
        status: 'draft',
        updatedAt: now,
      };
      updateQuery.$set.draft = draftDoc;
    }

    await db.collection('collection_page_configs').updateOne(
      { tenantId: tenantSlug, templateId },
      updateQuery,
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: isPublish ? 'Collection page template published live' : 'Draft configuration saved',
        data: body,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update collection page template' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

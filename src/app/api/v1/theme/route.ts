import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultTheme } from '@/lib/theme-presets';
import { ThemeDocument } from '@/types/theme.types';

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
  const isPreview = searchParams.get('preview') === 'draft';

  const defaultDoc = getDefaultTheme(tenantSlug);

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('themes').findOne({
        tenantId: tenantSlug,
      });

      if (doc) {
        if (isPreview && doc.draft) {
          return NextResponse.json(
            { success: true, data: { ...defaultDoc, ...doc.draft, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
        if (doc.published) {
          return NextResponse.json(
            { success: true, data: { ...defaultDoc, ...doc.published, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
        if (doc.draft) {
          return NextResponse.json(
            { success: true, data: { ...defaultDoc, ...doc.draft, tenantId: tenantSlug } },
            { headers: corsHeaders() }
          );
        }
      }
    }
  } catch (err) {
    console.warn('Theme DB Fetch error, using default seed:', err);
  }

  return NextResponse.json({ success: true, data: defaultDoc }, { headers: corsHeaders() });
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
    const body: ThemeDocument = await request.json();
    const db = await getDatabase();

    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    const now = new Date().toISOString();
    const isPublish = body.status === 'published';

    const updateQuery: any = {
      $set: {
        tenantId: tenantSlug,
        updatedAt: now,
      },
    };

    if (isPublish) {
      const publishedVersion = (body.version || 1);
      const publishedDoc: ThemeDocument = {
        ...body,
        tenantId: tenantSlug,
        status: 'published',
        version: publishedVersion,
        publishedAt: now,
        updatedAt: now,
      };

      updateQuery.$set.published = publishedDoc;
      updateQuery.$set.draft = publishedDoc;

      // Save version snapshot
      await db.collection('theme_versions').insertOne({
        tenantId: tenantSlug,
        version: publishedVersion,
        name: `Version ${publishedVersion}`,
        theme: publishedDoc,
        publishedAt: now,
        createdAt: now,
      });
    } else {
      const draftDoc: ThemeDocument = {
        ...body,
        tenantId: tenantSlug,
        status: 'draft',
        updatedAt: now,
      };
      updateQuery.$set.draft = draftDoc;
    }

    await db.collection('themes').updateOne(
      { tenantId: tenantSlug },
      updateQuery,
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: isPublish ? 'Theme published live' : 'Draft theme saved',
        data: body,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update theme' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

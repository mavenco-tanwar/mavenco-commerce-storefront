import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultHeaderConfig, HeaderConfig } from '@/lib/header-config';

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

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'header' },
          { tenantSlug: 'all', type: 'header' },
        ],
      });

      if (doc?.config) {
        const { _id, ...cleanDoc } = doc;
        return NextResponse.json(
          {
            data: cleanDoc.config,
            status: 'success',
            version: cleanDoc.version || 1,
            publishedAt: cleanDoc.updatedAt || cleanDoc.publishedAt,
            source: 'mongodb_atlas',
            timestamp: new Date().toISOString(),
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.warn('MongoDB Header GET error, falling back:', err);
  }

  // Graceful fallback to default seed
  const fallback = getDefaultHeaderConfig(tenantSlug);
  return NextResponse.json(
    {
      data: fallback,
      status: 'fallback',
      version: 1,
      source: 'default_seed',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  return handleSave(request);
}

export async function POST(request: NextRequest) {
  return handleSave(request);
}

async function handleSave(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || '').toLowerCase().trim();

  try {
    const body = await request.json();
    const config: HeaderConfig = body.config || body;
    if (!tenantSlug && config.tenantSlug) {
      tenantSlug = config.tenantSlug.toLowerCase().trim();
    }
    if (!tenantSlug) tenantSlug = 'lumina';

    config.tenantSlug = tenantSlug;
    config.updatedAt = new Date().toISOString();

    const db = await getDatabase();
    if (db) {
      const existing = await db.collection('cms_pages').findOne({
        tenantSlug: tenantSlug,
        type: 'header',
      });

      const nextVersion = (existing?.version || 0) + 1;
      config.version = nextVersion;

      const recordToSave = {
        tenantSlug: tenantSlug,
        type: 'header',
        version: nextVersion,
        status: body.status || config.status || 'published',
        config: config,
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        persistedToDb: true,
      };

      await db.collection('cms_pages').updateOne(
        { tenantSlug: tenantSlug, type: 'header' },
        { $set: recordToSave },
        { upsert: true }
      );

      // Revalidate cache
      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/stores/${tenantSlug}`, 'layout');
      } catch {}

      return NextResponse.json(
        {
          success: true,
          data: config,
          version: nextVersion,
          status: 'published',
          message: `Header configuration for ${tenantSlug} successfully published to MongoDB Atlas.`,
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.error('MongoDB save Header error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to persist header config to MongoDB' },
      { status: 500, headers: corsHeaders() }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Database connection unavailable' },
    { status: 503, headers: corsHeaders() }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultFooterConfig, FooterConfig } from '@/lib/footer-config';

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
  const base = getDefaultFooterConfig(tenantSlug);

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'footer' },
          { tenantSlug: 'all', type: 'footer' },
        ],
      });

      if (doc && (doc.sections || doc.config?.sections)) {
        const raw = doc.config || doc;
        const merged: FooterConfig = {
          ...base,
          ...raw,
          tenantSlug: tenantSlug,
          theme: {
            ...base.theme,
            ...(raw.theme || {}),
          },
          sections: Array.isArray(raw.sections) ? raw.sections : base.sections,
        };

        return NextResponse.json(
          {
            data: merged,
            status: 'success',
            version: doc.version || 1,
            publishedAt: doc.updatedAt || doc.publishedAt,
            source: 'mongodb_atlas',
            timestamp: new Date().toISOString(),
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.warn('MongoDB Footer GET error, falling back:', err);
  }

  // Graceful fallback to default seed
  return NextResponse.json(
    {
      data: base,
      status: 'fallback_default',
      version: 1,
      source: 'local_preset',
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
    const incoming: FooterConfig = body.config || body;
    if (!tenantSlug && incoming.tenantSlug) {
      tenantSlug = incoming.tenantSlug.toLowerCase().trim();
    }
    if (!tenantSlug) tenantSlug = 'lumina';

    const db = await getDatabase();
    if (db) {
      const existing = await db.collection('cms_pages').findOne({
        tenantSlug: tenantSlug,
        type: 'footer',
      });

      const base = existing?.config || existing || getDefaultFooterConfig(tenantSlug);
      const nextVersion = (existing?.version || 0) + 1;

      const fullConfig: FooterConfig = {
        ...base,
        ...incoming,
        tenantSlug: tenantSlug,
        version: nextVersion,
        status: (body.status || incoming.status || 'published') as any,
        updatedAt: new Date().toISOString(),
        publishedAt: body.status === 'published' ? new Date().toISOString() : existing?.publishedAt,
      };

      // Save document to MongoDB Atlas
      const recordToSave = {
        tenantSlug: tenantSlug,
        type: 'footer',
        version: nextVersion,
        status: fullConfig.status,
        theme: fullConfig.theme,
        sections: fullConfig.sections,
        config: fullConfig,
        updatedAt: new Date().toISOString(),
        publishedAt: fullConfig.publishedAt,
        persistedToDb: true,
      };

      await db.collection('cms_pages').updateOne(
        { tenantSlug: tenantSlug, type: 'footer' },
        { $set: recordToSave },
        { upsert: true }
      );

      // Snapshot to versions collection
      try {
        await db.collection('cms_versions').insertOne({
          tenantSlug: tenantSlug,
          builderType: 'footer',
          version: nextVersion,
          status: fullConfig.status,
          snapshot: fullConfig,
          createdAt: new Date().toISOString(),
          publishedAt: fullConfig.publishedAt,
        });
      } catch (verErr) {
        console.warn('Failed to snapshot footer version:', verErr);
      }

      // Revalidate cache
      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/stores/${tenantSlug}`, 'layout');
      } catch {}

      return NextResponse.json(
        {
          success: true,
          data: fullConfig,
          version: nextVersion,
          status: fullConfig.status,
          message: `Footer configuration for ${tenantSlug} successfully saved to MongoDB Atlas.`,
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.error('MongoDB save Footer error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to persist footer config to MongoDB' },
      { status: 500, headers: corsHeaders() }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Database connection unavailable' },
    { status: 503, headers: corsHeaders() }
  );
}

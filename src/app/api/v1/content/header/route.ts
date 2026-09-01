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

  const base = getDefaultHeaderConfig(tenantSlug);

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'header' },
          { tenantSlug: 'all', type: 'header' },
        ],
      });

      if (doc && (doc.config || doc.navigationMenu || doc.mainHeader || doc.announcementBar)) {
        const raw = doc.config || doc;
        const mergedConfig: HeaderConfig = {
          ...base,
          ...raw,
          tenantSlug: tenantSlug,
          preset: raw.preset || doc.preset || base.preset,
          theme: raw.theme || doc.theme || base.theme,
          announcementBar: {
            ...base.announcementBar,
            ...(raw.announcementBar || doc.announcementBar || {}),
            styles: {
              ...base.announcementBar.styles,
              ...(raw.announcementBar?.styles || doc.announcementBar?.styles || {}),
            },
            blocks: Array.isArray(raw.announcementBar?.blocks || doc.announcementBar?.blocks)
              ? (raw.announcementBar?.blocks || doc.announcementBar?.blocks)
              : base.announcementBar.blocks,
          },
          mainHeader: {
            ...base.mainHeader,
            ...(raw.mainHeader || doc.mainHeader || {}),
            styles: {
              ...base.mainHeader.styles,
              ...(raw.mainHeader?.styles || doc.mainHeader?.styles || {}),
            },
            blocks: Array.isArray(raw.mainHeader?.blocks || doc.mainHeader?.blocks)
              ? (raw.mainHeader?.blocks || doc.mainHeader?.blocks)
              : base.mainHeader.blocks,
          },
          sticky: {
            ...base.sticky,
            ...(raw.sticky || doc.sticky || {}),
          },
          mobile: {
            ...base.mobile,
            ...(raw.mobile || doc.mobile || {}),
          },
          navigationMenu: Array.isArray(raw.navigationMenu || doc.navigationMenu)
            ? (raw.navigationMenu || doc.navigationMenu)
            : base.navigationMenu,
        };

        return NextResponse.json(
          {
            data: mergedConfig,
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
    console.warn('MongoDB Header GET error, falling back:', err);
  }

  // Graceful fallback to default seed
  return NextResponse.json(
    {
      data: base,
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
    const incoming: HeaderConfig = body.config || body;
    if (!tenantSlug && incoming.tenantSlug) {
      tenantSlug = incoming.tenantSlug.toLowerCase().trim();
    }
    if (!tenantSlug) tenantSlug = 'lumina';

    const db = await getDatabase();
    if (db) {
      const existing = await db.collection('cms_pages').findOne({
        tenantSlug: tenantSlug,
        type: 'header',
      });

      const base = existing?.config || existing || getDefaultHeaderConfig(tenantSlug);
      const nextVersion = (existing?.version || 0) + 1;

      const fullConfig: HeaderConfig = {
        ...base,
        ...incoming,
        tenantSlug: tenantSlug,
        version: nextVersion,
        status: (body.status || incoming.status || 'published') as any,
        updatedAt: new Date().toISOString(),
        announcementBar: {
          ...base.announcementBar,
          ...(incoming.announcementBar || {}),
          styles: {
            ...base.announcementBar.styles,
            ...(incoming.announcementBar?.styles || {}),
          },
          blocks:
            incoming.announcementBar?.blocks !== undefined
              ? incoming.announcementBar.blocks
              : base.announcementBar.blocks,
        },
        mainHeader: {
          ...base.mainHeader,
          ...(incoming.mainHeader || {}),
          styles: {
            ...base.mainHeader.styles,
            ...(incoming.mainHeader?.styles || {}),
          },
          blocks:
            incoming.mainHeader?.blocks !== undefined
              ? incoming.mainHeader.blocks
              : base.mainHeader.blocks,
        },
        sticky: {
          ...base.sticky,
          ...(incoming.sticky || {}),
        },
        mobile: {
          ...base.mobile,
          ...(incoming.mobile || {}),
        },
        navigationMenu:
          incoming.navigationMenu !== undefined
            ? incoming.navigationMenu
            : (base.navigationMenu || []),
      };

      // Save directly at ROOT of the MongoDB document to match the exact schema of cms_pages
      const recordToSave = {
        tenantSlug: tenantSlug,
        type: 'header',
        version: nextVersion,
        status: fullConfig.status,
        preset: fullConfig.preset || 'luxury',
        theme: fullConfig.theme || 'luxury-light',
        announcementBar: fullConfig.announcementBar,
        mainHeader: fullConfig.mainHeader,
        navigationMenu: fullConfig.navigationMenu,
        sticky: fullConfig.sticky,
        transparent: fullConfig.transparent,
        mobile: fullConfig.mobile,
        config: fullConfig,
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
          data: fullConfig,
          version: nextVersion,
          status: fullConfig.status,
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

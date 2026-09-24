import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getTenantDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Store-ID, X-API-Key, X-Tenant-Slug, x-tenant-slug',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

interface RouteParams {
  params: Promise<{ code: string }>;
}

import { inferTenantPreset, resolveBlueprintPreset } from '@/lib/server/tenant-blueprint';

/**
 * GET /api/v1/content/menus/code/[code]
 * Returns single menu by slug/code/id aligned with the tenant's category
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || '').trim();
  const { searchParams } = new URL(request.url);
  const tenantSlug = (
    searchParams.get('tenant') ||
    searchParams.get('tenantSlug') ||
    request.headers.get('x-tenant-slug') ||
    'demo'
  )
    .replace(/^store_/, '')
    .toLowerCase()
    .trim();

  try {
    const db = await getTenantDatabase(tenantSlug);
    const platformDb = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_menus').findOne({
        $or: [{ slug: code }, { id: code }],
      });

      if (doc) {
        const { _id, ...clean } = doc;
        return NextResponse.json({ success: true, data: { ...clean, tenantSlug } }, { headers: corsHeaders() });
      }

      // If menu document not stored yet, derive dynamically based on tenant category blueprint
      let tenantDoc: any = null;
      try {
        tenantDoc = await db.collection('tenants').findOne({
          $or: [{ slug: tenantSlug }, { id: tenantSlug }, { id: `store_${tenantSlug}` }, { tenantId: tenantSlug }],
        });
      } catch {}

      if (!tenantDoc && platformDb) {
        try {
          tenantDoc = await platformDb.collection('tenants').findOne({
            $or: [{ slug: tenantSlug }, { id: tenantSlug }, { id: `store_${tenantSlug}` }, { tenantId: tenantSlug }],
          });
        } catch {}
      }

      const preset = inferTenantPreset(tenantDoc, tenantSlug);
      const blueprint = resolveBlueprintPreset(preset);
      const storePrefix = tenantSlug && tenantSlug !== 'demo' && tenantSlug !== 'storefront' ? `/stores/${tenantSlug}` : '';

      let items: any[] = [];
      let menuTitle = code.replace(/[-_]+/g, ' ').toUpperCase();

      if (code === 'header-menu' || code === 'menu_header') {
        menuTitle = `${tenantDoc?.name || tenantSlug.toUpperCase()} Header Navigation`;
        if (Array.isArray(tenantDoc?.navLinks) && tenantDoc.navLinks.length > 0) {
          items = tenantDoc.navLinks.map((l: any, i: number) => ({
            id: `nav_${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            badge: l.badge,
            isVisible: true,
          }));
        } else if (Array.isArray(blueprint?.navLinks) && blueprint.navLinks.length > 0) {
          items = blueprint.navLinks.map((l: any, i: number) => ({
            id: `nav_${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            badge: l.badge,
            isVisible: true,
          }));
        }
      } else if (code === 'footer-menu-shop' || code === 'menu_footer_shop') {
        menuTitle = `${tenantDoc?.name || tenantSlug.toUpperCase()} Footer Shop Links`;
        if (Array.isArray(tenantDoc?.footerShopLinks) && tenantDoc.footerShopLinks.length > 0) {
          items = tenantDoc.footerShopLinks.map((l: any, i: number) => ({
            id: `nav_f${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            isVisible: true,
          }));
        } else if (Array.isArray(blueprint?.footerShopLinks) && blueprint.footerShopLinks.length > 0) {
          items = blueprint.footerShopLinks.map((l: any, i: number) => ({
            id: `nav_f${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            isVisible: true,
          }));
        }
      } else if (code === 'footer-menu-care' || code === 'menu_footer_care') {
        menuTitle = `${tenantDoc?.name || tenantSlug.toUpperCase()} Customer Care`;
        if (Array.isArray(tenantDoc?.footerCareLinks) && tenantDoc.footerCareLinks.length > 0) {
          items = tenantDoc.footerCareLinks.map((l: any, i: number) => ({
            id: `nav_care_${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            isVisible: true,
          }));
        } else if (Array.isArray(blueprint?.footerCareLinks) && blueprint.footerCareLinks.length > 0) {
          items = blueprint.footerCareLinks.map((l: any, i: number) => ({
            id: `nav_care_${i + 1}`,
            label: l.label,
            type: 'link',
            url: l.href.startsWith('/stores/') || l.href.startsWith('http') ? l.href : `${storePrefix}${l.href.startsWith('/') ? l.href : `/${l.href}`}`,
            isVisible: true,
          }));
        }
      }

      if (items.length > 0) {
        const generatedDoc = {
          id: `menu_${code}_${tenantSlug}`,
          title: menuTitle,
          slug: code,
          items,
          tenantSlug,
          updatedAt: new Date().toISOString(),
        };

        // Auto-seed for persistence
        try {
          await db.collection('cms_menus').updateOne(
            { slug: code },
            { $set: generatedDoc },
            { upsert: true }
          );
        } catch {}

        return NextResponse.json({ success: true, data: generatedDoc }, { headers: corsHeaders() });
      }
    }
  } catch (err) {
    console.warn(`[GET /api/v1/content/menus/code/${code}] Error:`, err);
  }

  const fallback = {
    id: `menu_${code}`,
    title: code.replace(/[-_]+/g, ' ').toUpperCase(),
    slug: code,
    items: [],
  };

  return NextResponse.json({ success: true, data: fallback }, { headers: corsHeaders() });
}

/**
 * PUT /api/v1/content/menus/code/[code]
 * Updates menu items and syncs with header and footer in cms_pages
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return handleUpdate(request, params);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return handleUpdate(request, params);
}

async function handleUpdate(request: NextRequest, params: Promise<{ code: string }>) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || '').trim();
  const { searchParams } = new URL(request.url);

  try {
    const body = await request.json();
    const tenantSlug = (
      searchParams.get('tenant') ||
      searchParams.get('tenantSlug') ||
      body.tenantSlug ||
      body.tenant ||
      request.headers.get('x-tenant-slug') ||
      'demo'
    )
      .replace(/^store_/, '')
      .toLowerCase()
      .trim();

    const items = Array.isArray(body.items) ? body.items : body;
    const now = new Date().toISOString();

    const db = await getTenantDatabase(tenantSlug);
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    // 1. Upsert into cms_menus
    const menuTitle = body.title || code.replace(/[-_]+/g, ' ').toUpperCase();

    const updateDoc = {
      id: body.id || `menu_${code}`,
      title: menuTitle,
      slug: code,
      items: items,
      tenantSlug: tenantSlug,
      updatedAt: now,
    };

    await db.collection('cms_menus').updateOne(
      { $or: [{ slug: code }, { id: code }] },
      {
        $set: updateDoc,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    // 2. Synchronize Header Navigation if code is 'header-menu'
    if (code === 'header-menu' || code === 'menu_header') {
      const headerNavItems = items.map((it: any) => ({
        id: it.id || `nav_${Date.now()}`,
        label: it.label || it.title || 'Link',
        url: it.url || it.href || '/',
        enabled: it.isVisible !== false,
        children: it.children || [],
      }));

      // Update cms_pages for type 'header' strictly for this tenant
      await db.collection('cms_pages').updateMany(
        { type: 'header' },
        {
          $set: {
            navigationMenu: headerNavItems,
            'config.navigationMenu': headerNavItems,
            tenantSlug: tenantSlug,
            updatedAt: now,
          },
        }
      );
    }

    // 3. Synchronize Footer Links if code is 'footer-menu-shop' or 'footer-menu-care'
    if (code === 'footer-menu-shop' || code === 'footer-menu-care') {
      const footerDocs = await db.collection('cms_pages').find({ type: 'footer' }).toArray();

      for (const fDoc of footerDocs) {
        let changed = false;
        const sections = Array.isArray(fDoc.sections) ? fDoc.sections : [];

        for (const sec of sections) {
          if (sec && Array.isArray(sec.blocks)) {
            for (const blk of sec.blocks) {
              if (blk?.content?.menuCode === code || blk?.id?.includes(code)) {
                blk.content.items = items.map((it: any) => ({
                  label: it.label || it.title || 'Link',
                  href: it.url || it.href || '/',
                }));
                changed = true;
              }
            }
          }
        }

        if (changed) {
          await db.collection('cms_pages').updateOne(
            { _id: fDoc._id },
            {
              $set: {
                sections,
                'config.sections': sections,
                updatedAt: now,
              },
            }
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: updateDoc,
        message: `Menu ${code} updated and synchronized live`,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

/**
 * DELETE /api/v1/content/menus/code/[code]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || '').trim();

  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (
      searchParams.get('tenant') ||
      searchParams.get('tenantSlug') ||
      request.headers.get('x-tenant-slug') ||
      request.headers.get('x-tenant') ||
      'demo'
    )
      .replace(/^store_/, '')
      .toLowerCase()
      .trim();
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      await db.collection('cms_menus').deleteOne({ $or: [{ slug: code }, { id: code }] });
      return NextResponse.json(
        { success: true, message: `Menu ${code} deleted` },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: corsHeaders() }
    );
  }

  return NextResponse.json({ success: true }, { headers: corsHeaders() });
}

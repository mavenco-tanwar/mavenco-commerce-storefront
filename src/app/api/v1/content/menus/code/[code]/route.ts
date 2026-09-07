import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

const DEFAULT_MENUS: Record<string, any> = {
  'header-menu': {
    id: 'menu_header',
    title: 'Storefront Header Main Navigation',
    slug: 'header-menu',
    items: [
      { id: 'nav_1', label: 'Women', type: 'category', url: '/women', isVisible: true },
      { id: 'nav_2', label: 'Kids', type: 'category', url: '/kids', isVisible: true },
      { id: 'nav_3', label: 'New Arrivals', type: 'collection', url: '/new-arrivals', isVisible: true },
      { id: 'nav_4', label: 'Collections', type: 'collection', url: '/collections/festive-elegance', isVisible: true },
      { id: 'nav_5', label: 'Sale', type: 'collection', url: '/sale', isVisible: true },
    ],
  },
  'footer-menu-shop': {
    id: 'menu_footer_shop',
    title: 'Footer Shop Links',
    slug: 'footer-menu-shop',
    items: [
      { id: 'nav_f1', label: "Women's Dresses", type: 'category', url: '/women', isVisible: true },
      { id: 'nav_f2', label: 'Chanderi Kurtis', type: 'category', url: '/women', isVisible: true },
      { id: 'nav_f3', label: 'Girls Party Wear', type: 'category', url: '/kids', isVisible: true },
      { id: 'nav_f4', label: 'Boys Kurtas', type: 'category', url: '/kids', isVisible: true },
    ],
  },
  'footer-menu-care': {
    id: 'menu_footer_care',
    title: 'Footer Customer Care',
    slug: 'footer-menu-care',
    items: [
      { id: 'nav_f5', label: 'Track Order', type: 'page', url: '/account', isVisible: true },
      { id: 'nav_f6', label: 'Shipping Policy', type: 'page', url: '/shipping-policy', isVisible: true },
      { id: 'nav_f7', label: 'Returns & Exchange', type: 'page', url: '/return-policy', isVisible: true },
      { id: 'nav_f8', label: 'FAQ & Contact', type: 'page', url: '/contact', isVisible: true },
    ],
  },
};

/**
 * GET /api/v1/content/menus/code/[code]
 * Returns single menu by slug/code/id
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || '').trim();
  const { searchParams } = new URL(request.url);
  const tenantSlug = (
    searchParams.get('tenant') ||
    request.headers.get('x-tenant-slug') ||
    ''
  )
    .toLowerCase()
    .trim();

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_menus').findOne({
        $and: [
          {
            $or: [
              ...(tenantSlug && tenantSlug !== 'all'
                ? [
                    { tenantSlug: tenantSlug },
                    { storeSlug: tenantSlug },
                    { tenantId: tenantSlug },
                    { tenantId: `store_${tenantSlug}` },
                  ]
                : []),
              { tenantSlug: 'all' },
              { tenantSlug: 'platform' },
              { tenantSlug: { $exists: false } },
            ],
          },
          { $or: [{ slug: code }, { id: code }] },
        ],
      });

      if (doc) {
        const { _id, ...clean } = doc;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }
  } catch (err) {
    console.warn(`[GET /api/v1/content/menus/code/${code}] Error:`, err);
  }

  const fallback = DEFAULT_MENUS[code] || {
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
      request.headers.get('x-tenant-slug') ||
      body.tenantSlug ||
      'all'
    )
      .toLowerCase()
      .trim();

    const items = Array.isArray(body.items) ? body.items : body;
    const now = new Date().toISOString();

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    // 1. Upsert into cms_menus
    const defaultMeta = DEFAULT_MENUS[code] || {};
    const menuTitle = body.title || defaultMeta.title || code.replace(/[-_]+/g, ' ').toUpperCase();

    const updateDoc = {
      id: body.id || defaultMeta.id || `menu_${code}`,
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

      // Update cms_pages for type 'header'
      await db.collection('cms_pages').updateMany(
        {
          $and: [
            { type: 'header' },
            {
              $or: [
                ...(tenantSlug && tenantSlug !== 'all' ? [{ tenantSlug }] : []),
                { tenantSlug: 'all' },
                { tenantSlug: 'demo' },
                { tenantSlug: 'gever' },
                { tenantSlug: 'lumina' },
              ],
            },
          ],
        },
        {
          $set: {
            navigationMenu: headerNavItems,
            'config.navigationMenu': headerNavItems,
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
    const db = await getDatabase();
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

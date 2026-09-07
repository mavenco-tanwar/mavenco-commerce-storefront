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

const DEFAULT_MENUS = [
  {
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
  {
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
  {
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
];

/**
 * GET /api/v1/content/menus
 * Lists all navigation menus (header-menu, footer-menu-shop, footer-menu-care)
 */
export async function GET(request: NextRequest) {
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
      const query: any = {
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
      };

      const docs = await db.collection('cms_menus').find(query).toArray();

      if (docs && docs.length > 0) {
        const cleanDocs = docs.map(({ _id, ...rest }) => rest);
        return NextResponse.json(
          {
            success: true,
            data: cleanDocs,
            menus: cleanDocs,
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.warn('[GET /api/v1/content/menus] Error:', err);
  }

  // Return fallback defaults
  return NextResponse.json(
    {
      success: true,
      data: DEFAULT_MENUS,
      menus: DEFAULT_MENUS,
    },
    { headers: corsHeaders() }
  );
}

/**
 * POST /api/v1/content/menus
 * Creates a new menu or bulk-seeds menus
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const tenantSlug = (
      searchParams.get('tenant') ||
      request.headers.get('x-tenant-slug') ||
      body.tenantSlug ||
      'all'
    )
      .toLowerCase()
      .trim();

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 503, headers: corsHeaders() }
      );
    }

    const menuData = {
      id: body.id || `menu_${Date.now()}`,
      title: body.title || 'New Navigation Menu',
      slug: body.slug || body.code || `menu-${Date.now()}`,
      items: Array.isArray(body.items) ? body.items : [],
      tenantSlug: tenantSlug,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('cms_menus').updateOne(
      { $or: [{ id: menuData.id }, { slug: menuData.slug }] },
      { $set: menuData },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        data: menuData,
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

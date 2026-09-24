import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getTenantDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';
import { getTenantConfig } from '@/lib/tenant-config';

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

/**
 * GET /api/v1/content/menus
 * Lists all navigation menus (header-menu, footer-menu-shop, footer-menu-care)
 * Backed by tenant MongoDB with zero cross-tenant leakage.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platformDb = await getDatabase();
  const fallback = await resolveRequestTenantSlug(request, searchParams, platformDb);
  const tenantSlug = (
    searchParams.get('tenant') ||
    searchParams.get('tenantSlug') ||
    searchParams.get('store') ||
    request.headers.get('x-tenant-slug') ||
    fallback ||
    'demo'
  )
    .replace(/^store_/, '')
    .toLowerCase()
    .trim();

  try {
    const db = await getTenantDatabase(tenantSlug);
    if (db) {
      const docs = await db.collection('cms_menus').find({}).toArray();

      if (docs && docs.length > 0) {
        const cleanDocs = docs.map(({ _id, ...rest }) => ({
          ...rest,
          tenantSlug,
        }));
        return NextResponse.json(
          {
            success: true,
            data: cleanDocs,
            menus: cleanDocs,
          },
          { headers: corsHeaders() }
        );
      }

      // If no menus are stored in MongoDB yet, dynamically generate tenant-specific menus from tenant data
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

      const tenantStaticCfg = getTenantConfig(tenantSlug);
      const storePrefix = tenantSlug && tenantSlug !== 'demo' && tenantSlug !== 'storefront' ? `/stores/${tenantSlug}` : '';

      // Fetch live categories to synthesize menu items if navLinks are empty
      let categories: any[] = [];
      try {
        categories = await db.collection('categories')
          .find({ parentId: { $in: [null, '', 'none', undefined] } })
          .sort({ displayOrder: 1, name: 1 })
          .limit(6)
          .toArray();
      } catch {}

      // 1. Header Menu Items
      let headerItems: any[] = [];
      if (Array.isArray(tenantDoc?.navLinks) && tenantDoc.navLinks.length > 0) {
        headerItems = tenantDoc.navLinks.map((link: any, idx: number) => ({
          id: `nav_${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          badge: link.badge,
          isVisible: true,
        }));
      } else if (tenantStaticCfg?.navLinks && tenantStaticCfg.navLinks.length > 0) {
        headerItems = tenantStaticCfg.navLinks.map((link: any, idx: number) => ({
          id: `nav_${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          badge: link.badge,
          isVisible: true,
        }));
      } else if (categories.length > 0) {
        headerItems = categories.map((cat: any, idx: number) => ({
          id: `nav_cat_${idx + 1}`,
          label: cat.name,
          type: 'category',
          url: `${storePrefix}/${cat.slug}`,
          isVisible: true,
        }));
      } else {
        headerItems = [
          { id: 'nav_all', label: 'All Products', type: 'collection', url: `${storePrefix}/collections`, isVisible: true },
          { id: 'nav_featured', label: 'Featured', type: 'collection', url: `${storePrefix}/collections`, isVisible: true },
        ];
      }

      // 2. Footer Shop Items
      let footerShopItems: any[] = [];
      if (Array.isArray(tenantDoc?.footerShopLinks) && tenantDoc.footerShopLinks.length > 0) {
        footerShopItems = tenantDoc.footerShopLinks.map((link: any, idx: number) => ({
          id: `nav_f${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          isVisible: true,
        }));
      } else if (tenantStaticCfg?.footerShopLinks && tenantStaticCfg.footerShopLinks.length > 0) {
        footerShopItems = tenantStaticCfg.footerShopLinks.map((link: any, idx: number) => ({
          id: `nav_f${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          isVisible: true,
        }));
      } else if (categories.length > 0) {
        footerShopItems = categories.slice(0, 5).map((cat: any, idx: number) => ({
          id: `nav_fcat_${idx + 1}`,
          label: cat.name,
          type: 'category',
          url: `${storePrefix}/${cat.slug}`,
          isVisible: true,
        }));
      } else {
        footerShopItems = [
          { id: 'nav_f_all', label: 'All Collections', type: 'collection', url: `${storePrefix}/collections`, isVisible: true },
          { id: 'nav_f_cat', label: 'Store Catalog', type: 'collection', url: `${storePrefix}/collections`, isVisible: true },
        ];
      }

      // 3. Footer Care Items
      let footerCareItems: any[] = [];
      if (Array.isArray(tenantDoc?.footerCareLinks) && tenantDoc.footerCareLinks.length > 0) {
        footerCareItems = tenantDoc.footerCareLinks.map((link: any, idx: number) => ({
          id: `nav_care_${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          isVisible: true,
        }));
      } else if (tenantStaticCfg?.footerCareLinks && tenantStaticCfg.footerCareLinks.length > 0) {
        footerCareItems = tenantStaticCfg.footerCareLinks.map((link: any, idx: number) => ({
          id: `nav_care_${idx + 1}`,
          label: link.label,
          type: 'link',
          url: link.href.startsWith('/stores/') || link.href.startsWith('http') ? link.href : `${storePrefix}${link.href.startsWith('/') ? link.href : `/${link.href}`}`,
          isVisible: true,
        }));
      } else {
        footerCareItems = [
          { id: 'nav_c1', label: 'Contact Us', type: 'page', url: `${storePrefix}/contact`, isVisible: true },
          { id: 'nav_c2', label: 'Shipping & Delivery', type: 'page', url: `${storePrefix}/shipping`, isVisible: true },
          { id: 'nav_c3', label: 'Returns & Exchanges', type: 'page', url: `${storePrefix}/returns`, isVisible: true },
          { id: 'nav_c4', label: 'FAQ', type: 'page', url: `${storePrefix}/faq`, isVisible: true },
          { id: 'nav_c5', label: 'Privacy & Terms', type: 'page', url: `${storePrefix}/privacy`, isVisible: true },
        ];
      }

      const generatedMenus = [
        {
          id: `menu_header_${tenantSlug}`,
          title: `${tenantDoc?.name || tenantSlug.toUpperCase()} Header Navigation`,
          slug: 'header-menu',
          items: headerItems,
          tenantSlug,
          updatedAt: new Date().toISOString(),
        },
        {
          id: `menu_footer_shop_${tenantSlug}`,
          title: `${tenantDoc?.name || tenantSlug.toUpperCase()} Footer Shop Links`,
          slug: 'footer-menu-shop',
          items: footerShopItems,
          tenantSlug,
          updatedAt: new Date().toISOString(),
        },
        {
          id: `menu_footer_care_${tenantSlug}`,
          title: `${tenantDoc?.name || tenantSlug.toUpperCase()} Customer Care`,
          slug: 'footer-menu-care',
          items: footerCareItems,
          tenantSlug,
          updatedAt: new Date().toISOString(),
        },
      ];

      // Auto-seed into tenant database for persistence
      try {
        for (const menu of generatedMenus) {
          await db.collection('cms_menus').updateOne(
            { slug: menu.slug },
            { $set: menu },
            { upsert: true }
          );
        }
      } catch (seedErr) {
        console.warn('[Menus API] Auto-seed warning:', seedErr);
      }

      return NextResponse.json(
        {
          success: true,
          data: generatedMenus,
          menus: generatedMenus,
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err) {
    console.warn('[GET /api/v1/content/menus] Error:', err);
  }

  // Fallback neutral menus (never hardcoded fashion links)
  const neutralMenus = [
    {
      id: 'menu_header',
      title: 'Storefront Header Navigation',
      slug: 'header-menu',
      items: [
        { id: 'nav_1', label: 'All Products', type: 'collection', url: '/collections', isVisible: true },
        { id: 'nav_2', label: 'Featured Collections', type: 'collection', url: '/collections', isVisible: true },
      ],
    },
    {
      id: 'menu_footer_shop',
      title: 'Footer Shop Links',
      slug: 'footer-menu-shop',
      items: [
        { id: 'nav_f1', label: 'All Products', type: 'collection', url: '/collections', isVisible: true },
        { id: 'nav_f2', label: 'Collections', type: 'collection', url: '/collections', isVisible: true },
      ],
    },
    {
      id: 'menu_footer_care',
      title: 'Footer Customer Care',
      slug: 'footer-menu-care',
      items: [
        { id: 'nav_f3', label: 'Contact Us', type: 'page', url: '/contact', isVisible: true },
        { id: 'nav_f4', label: 'Shipping & Returns', type: 'page', url: '/shipping', isVisible: true },
        { id: 'nav_f5', label: 'FAQ', type: 'page', url: '/faq', isVisible: true },
      ],
    },
  ];

  return NextResponse.json(
    {
      success: true,
      data: neutralMenus,
      menus: neutralMenus,
    },
    { headers: corsHeaders() }
  );
}

/**
 * POST /api/v1/content/menus
 * Creates or updates a menu in the tenant's isolated database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const platformDb = await getDatabase();
    const fallback = await resolveRequestTenantSlug(request, searchParams, platformDb);
    const tenantSlug = (
      body.tenantSlug ||
      body.tenantId ||
      body.storeSlug ||
      searchParams.get('tenant') ||
      searchParams.get('tenantSlug') ||
      request.headers.get('x-tenant-slug') ||
      fallback ||
      'demo'
    )
      .replace(/^store_/, '')
      .toLowerCase()
      .trim();

    const db = await getTenantDatabase(tenantSlug);
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

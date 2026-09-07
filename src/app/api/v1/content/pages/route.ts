import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, X-Tenant-Slug',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

/**
 * GET /api/v1/content/pages
 * - If ?slug=xyz is provided: returns single page
 * - If no slug: returns array of all website pages for Content Management
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || '').toLowerCase().trim();
  const slug = (searchParams.get('slug') || '').toLowerCase().trim();
  const pageType = (searchParams.get('type') || '').toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      // 1. Single page lookup by slug or specific type
      if (slug || (pageType && pageType !== 'custom' && pageType !== 'page' && pageType !== 'website-page')) {
        const targetSlug = slug || pageType;
        const tenantMatches = [
          ...(tenantSlug && tenantSlug !== 'all'
            ? [
                { tenantSlug: tenantSlug },
                { storeSlug: tenantSlug },
                { tenantId: tenantSlug },
                { tenantId: `store_${tenantSlug}` },
              ]
            : []),
          { tenantSlug: 'all' },
          { tenantSlug: 'demo' },
          { tenantSlug: 'jq-trends' },
          { tenantSlug: { $exists: false } },
        ];

        const doc = await db.collection('cms_pages').findOne({
          $and: [
            {
              $or: [
                { slug: targetSlug },
                { slug: `/${targetSlug}` },
                { id: targetSlug },
                { type: targetSlug },
              ],
            },
            { $or: tenantMatches },
          ],
        }) || await db.collection('cms_pages').findOne({
          $or: [
            { slug: targetSlug },
            { slug: `/${targetSlug}` },
            { id: targetSlug },
            { type: targetSlug },
          ],
        });

        if (doc) {
          const { _id, ...cleanDoc } = doc;
          return NextResponse.json(
            {
              success: true,
              data: {
                id: cleanDoc.id || _id.toString(),
                ...cleanDoc,
              },
              status: 'success',
              source: 'mongodb',
            },
            { headers: corsHeaders() }
          );
        }

        return NextResponse.json(
          {
            success: false,
            data: null,
            status: 'not_found',
            error: `Page '${targetSlug}' not found`,
          },
          { status: 404, headers: corsHeaders() }
        );
      }

      // 2. Multi-page listing for Admin "Website Pages" Manager
      const systemTypes = ['homepage', 'header', 'footer', 'collection-page', 'product-page'];
      const query: any = {
        $or: [
          { type: { $in: ['page', 'custom', 'website-page', 'policy', 'blog'] } },
          { blocks: { $exists: true } },
          { type: { $nin: systemTypes } },
        ],
      };

      const docs = await db.collection('cms_pages').find(query).toArray();
      const cleanPages = docs.map((doc) => {
        const { _id, ...clean } = doc;
        return {
          id: clean.id || _id.toString(),
          title: clean.title || 'Untitled Page',
          slug: clean.slug ? clean.slug.replace(/^\//, '') : 'page',
          status: clean.status || 'published',
          blocks: clean.blocks || [],
          seo: clean.seo || { title: clean.title },
          tenantSlug: clean.tenantSlug || 'all',
          updatedAt: clean.updatedAt || new Date().toISOString(),
          createdAt: clean.createdAt || new Date().toISOString(),
        };
      });

      return NextResponse.json(
        {
          success: true,
          data: cleanPages,
          status: 'success',
          count: cleanPages.length,
        },
        { headers: corsHeaders() }
      );
    }
  } catch (err: any) {
    console.error('MongoDB get CMS pages error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: [],
      status: 'empty',
    },
    { headers: corsHeaders() }
  );
}

/**
 * POST /api/v1/content/pages
 * Creates a new website page from Admin Panel
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const tenantSlug = (body.tenantSlug || searchParams.get('tenant') || 'all').toLowerCase().trim();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Page title is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const cleanSlug = (body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^\//, '');
    const pageId = body.id || `page_${Date.now()}`;
    const now = new Date().toISOString();

    const newPageDoc = {
      id: pageId,
      title: body.title,
      slug: cleanSlug,
      status: body.status || 'published',
      type: 'page',
      blocks: body.blocks || [],
      seo: body.seo || {
        title: `${body.title} | Luxury Fashion`,
        description: `Explore ${body.title} boutique collections.`,
      },
      tenantSlug: tenantSlug,
      tenantId: tenantSlug,
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_pages').updateOne(
        { $or: [{ id: pageId }, { slug: cleanSlug }] },
        { $set: newPageDoc },
        { upsert: true }
      );
    }

    try {
      revalidatePath(`/${cleanSlug}`);
      revalidatePath(`/stores/${tenantSlug}/${cleanSlug}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: newPageDoc,
        message: 'Page created and published live',
      },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('Failed to create page:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create page' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

/**
 * PUT /api/v1/content/pages
 * Updates or upserts a website page
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const tenantSlug = (body.tenantSlug || searchParams.get('tenant') || 'all').toLowerCase().trim();
    const cleanSlug = (body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'page')).replace(/^\//, '');
    const pageId = body.id || `page_${Date.now()}`;
    const now = new Date().toISOString();

    const updateDoc = {
      id: pageId,
      title: body.title || cleanSlug,
      slug: cleanSlug,
      status: body.status || 'published',
      type: body.type || 'page',
      blocks: body.blocks || [],
      seo: body.seo || { title: body.title },
      tenantSlug: tenantSlug,
      tenantId: tenantSlug,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_pages').updateOne(
        { $or: [{ id: pageId }, { slug: cleanSlug }] },
        { $set: updateDoc },
        { upsert: true }
      );
    }

    try {
      revalidatePath(`/${cleanSlug}`);
      revalidatePath(`/stores/${tenantSlug}/${cleanSlug}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: updateDoc,
        message: 'Page updated successfully',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('Failed to update page:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update page' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

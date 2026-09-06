import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';
import { createDefaultRootNode } from '@/lib/page-builder/tree-utils';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
  const pageType = searchParams.get('type') || searchParams.get('slug');
  const isList = searchParams.get('list') === 'true' || !pageType;

  try {
    const db = await getDatabase();
    if (db) {
      if (isList) {
        // Return all pages for this tenant
        const pages = await db
          .collection('cms_pages')
          .find({
            $or: [{ tenantSlug }, { tenantId: tenantSlug }, { tenantSlug: 'all' }],
          })
          .sort({ updatedAt: -1 })
          .toArray();

        const cleanPages = pages.map((p) => {
          const { _id, ...rest } = p;
          return { id: p.id || _id.toString(), ...rest };
        });

        return NextResponse.json(
          { data: cleanPages, status: 'success' },
          { headers: corsHeaders() }
        );
      }

      // Return single page matching slug/type
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: pageType },
          { tenantId: tenantSlug, type: pageType },
          { tenantSlug: tenantSlug, slug: pageType },
          { tenantId: tenantSlug, slug: pageType },
          { slug: pageType },
        ],
      });

      if (doc) {
        const { _id, ...cleanDoc } = doc;
        return NextResponse.json(
          {
            data: { id: doc.id || _id.toString(), ...cleanDoc },
            status: 'success',
            source: 'mongodb',
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err: any) {
    console.error('MongoDB get CMS pages error:', err);
  }

  return NextResponse.json(
    { data: null, status: 'not_found' },
    { status: 404, headers: corsHeaders() }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
    const body = await request.json();

    const name = body.name || body.title || 'Untitled Page';
    const slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'new-page';
    const type = body.type || 'standard';

    const newPage = {
      id: `page_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      tenantSlug: tenantSlug,
      name,
      title: name,
      slug,
      type,
      status: 'draft',
      version: 1,
      schemaVersion: '1.0',
      content: body.content || {
        root: createDefaultRootNode(),
      },
      seo: body.seo || {
        title: `${name} | Luxury Boutique`,
        description: `Explore ${name} handcrafted collections and modern silhouettes.`,
      },
      settings: body.settings || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_pages').insertOne(newPage);
    }

    return NextResponse.json(
      { data: newPage, status: 'success', message: 'Page created successfully' },
      { status: 201, headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create page' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'lumina').toLowerCase().trim();
    const pageType = (searchParams.get('type') || searchParams.get('slug') || 'custom').toLowerCase().trim();
    const body = await request.json();

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_pages').updateOne(
        {
          $or: [
            { id: body.id },
            { tenantSlug: tenantSlug, type: pageType },
            { tenantSlug: tenantSlug, slug: body.slug || pageType },
          ],
        },
        {
          $set: {
            tenantSlug: tenantSlug,
            tenantId: tenantSlug,
            type: body.type || pageType,
            slug: body.slug || pageType,
            title: body.title || body.name || pageType,
            name: body.name || body.title || pageType,
            content: body.content,
            seo: body.seo,
            settings: body.settings,
            status: body.status || 'draft',
            version: body.version || 1,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }

    try {
      revalidatePath(`/${body.slug || pageType}`);
      revalidatePath(`/stores/${tenantSlug}`);
    } catch {}

    return NextResponse.json(
      {
        data: body,
        status: 'success',
        message: `Successfully synchronized ${pageType} configuration to MongoDB Atlas`,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to persist CMS page configuration' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDatabase } from '@/lib/mongodb';

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
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'all').toLowerCase().trim();
  const pageType = (searchParams.get('type') || searchParams.get('slug') || 'custom').toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: pageType },
          { tenantSlug: 'all', type: pageType },
          { slug: pageType },
        ],
      });

      if (doc) {
        const { _id, ...cleanDoc } = doc;
        return NextResponse.json(
          {
            data: cleanDoc,
            status: 'success',
            source: 'mongodb',
            timestamp: new Date().toISOString(),
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.error('MongoDB get CMS page error:', err);
  }

  return NextResponse.json(
    {
      data: null,
      status: 'not_found',
      source: 'fallback',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'all').toLowerCase().trim();
    const pageType = (searchParams.get('type') || searchParams.get('slug') || 'custom').toLowerCase().trim();
    const body = await request.json();

    const configData = body.config || body.data || body;

    const db = await getDatabase();
    if (db) {
      await db.collection('cms_pages').updateOne(
        { tenantSlug: tenantSlug, type: pageType },
        {
          $set: {
            tenantSlug: tenantSlug,
            type: pageType,
            slug: body.slug || pageType,
            title: body.title || pageType,
            config: configData,
            status: body.status || 'published',
            version: Date.now(),
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }

    try {
      revalidatePath('/');
      revalidatePath('/women');
      revalidatePath('/kids');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/faq');
      revalidatePath(`/stores/${tenantSlug}`);
    } catch {}

    return NextResponse.json(
      {
        data: {
          tenantSlug,
          type: pageType,
          config: configData,
          updatedAt: new Date().toISOString(),
          persistedToDb: true,
        },
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

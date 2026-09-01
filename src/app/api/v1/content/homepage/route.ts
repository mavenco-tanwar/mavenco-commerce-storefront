import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoredHomepageSections, saveStoredHomepageSections } from '@/lib/cms-store';
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
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends').toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('cms_pages').findOne({
        $or: [
          { tenantSlug: tenantSlug, type: 'homepage' },
          { tenantSlug: 'all', type: 'homepage' },
        ],
      });

      if (doc && doc.sections && Array.isArray(doc.sections) && doc.sections.length > 0) {
        return NextResponse.json(
          {
            data: {
              id: doc._id?.toString() || `hp_live_${tenantSlug}`,
              storeId: `store_${tenantSlug}`,
              tenant: tenantSlug,
              version: doc.version || 1,
              status: doc.status || 'published',
              sections: doc.sections,
              updatedAt: doc.updatedAt || new Date().toISOString(),
              source: 'mongodb',
            },
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.error('MongoDB homepage fetch error:', err);
  }

  // Fallback to local synced memory store
  const sections = getStoredHomepageSections(tenantSlug);
  return NextResponse.json(
    {
      data: {
        id: `hp_live_${tenantSlug}`,
        storeId: `store_${tenantSlug}`,
        tenant: tenantSlug,
        version: 1,
        status: 'published',
        sections: sections,
        updatedAt: new Date().toISOString(),
        source: 'local_store',
      },
    },
    { headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'jqtrends').toLowerCase().trim();
    const body = await request.json();
    const newSections = body.sections || body;

    if (Array.isArray(newSections) && newSections.length > 0) {
      saveStoredHomepageSections(newSections, tenantSlug);

      try {
        const db = await getDatabase();
        if (db) {
          await db.collection('cms_pages').updateOne(
            { tenantSlug: tenantSlug, type: 'homepage' },
            {
              $set: {
                tenantSlug: tenantSlug,
                type: 'homepage',
                version: Date.now(),
                status: body.status || 'published',
                sections: newSections,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: true }
          );
        }
      } catch (err) {
        console.error('MongoDB homepage persist error:', err);
      }

      try {
        revalidatePath('/');
        revalidatePath(`/stores/${tenantSlug}`);
      } catch {}
    }

    const updatedSections = getStoredHomepageSections(tenantSlug);

    return NextResponse.json(
      {
        data: {
          id: `hp_live_${tenantSlug}`,
          storeId: `store_${tenantSlug}`,
          tenant: tenantSlug,
          version: Date.now(),
          status: body.status || 'published',
          sections: updatedSections,
          updatedAt: new Date().toISOString(),
          persistedToDb: true,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update homepage sections' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTenantConfig, updateTenantConfig, archiveTenantSlug, checkTenantValidity } from '@/lib/tenant-config';
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

  // If requesting list of all active tenants for Showcase & Navbar
  if (searchParams.get('list') === 'all') {
    try {
      const db = await getDatabase();
      if (db) {
        const docs = await db
          .collection('tenants')
          .find({ status: { $ne: 'deleted' } })
          .sort({ createdAt: -1 })
          .toArray();

        if (docs.length > 0) {
          const cleanDocs = docs.map(({ _id, ...rest }) => rest);
          return NextResponse.json(
            {
              data: cleanDocs,
              count: cleanDocs.length,
              status: 'success',
              source: 'mongodb',
              timestamp: new Date().toISOString(),
            },
            { headers: corsHeaders() }
          );
        }
      }
    } catch (err) {
      console.error('MongoDB tenant list error:', err);
    }

    return NextResponse.json(
      {
        data: [],
        count: 0,
        status: 'success',
        source: 'empty',
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  }

  const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'demo';
  const clean = tenantSlug.toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('tenants').findOne({
        $or: [
          { slug: clean },
          { primaryDomain: clean },
          { 'domains.domain': clean },
        ],
        status: { $ne: 'deleted' },
      });

      if (doc) {
        // Strip _id before returning
        const { _id, ...tenantData } = doc;
        return NextResponse.json(
          {
            data: tenantData,
            tenant: clean,
            source: 'mongodb',
            status: 'success',
            timestamp: new Date().toISOString(),
          },
          { headers: corsHeaders() }
        );
      }
    }
  } catch (err) {
    console.error('MongoDB tenant fetch error:', err);
  }

  // When store is deleted or not found in MongoDB, strictly return 404
  return NextResponse.json(
    {
      data: null,
      tenant: clean,
      status: 'inactive',
      error: `Store "${clean}" is not found or inactive`,
    },
    { status: 404, headers: corsHeaders() }
  );
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug') || 'demo';
    const clean = tenantSlug.toLowerCase().trim();
    const body = await request.json();

    const updated = updateTenantConfig(clean, body);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('tenants').updateOne(
          { slug: clean },
          {
            $set: {
              ...updated,
              slug: clean,
              status: body.status || 'active',
              updatedAt: new Date().toISOString(),
            },
            $setOnInsert: {
              createdAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error('MongoDB tenant write error:', err);
    }

    try {
      revalidatePath(`/stores/${clean}`);
      revalidatePath('/');
    } catch {}

    return NextResponse.json(
      {
        data: updated,
        tenant: clean,
        status: 'success',
        message: `Tenant ${updated.name} updated and persisted successfully!`,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to register tenant' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || request.headers.get('x-tenant-slug');
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Missing tenant slug' }, { status: 400, headers: corsHeaders() });
    }

    const clean = tenantSlug.toLowerCase().trim();
    archiveTenantSlug(clean);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('tenants').updateOne(
          { slug: clean },
          {
            $set: {
              status: 'deleted',
              deletedAt: new Date().toISOString(),
            },
          }
        );
      }
    } catch (err) {
      console.error('MongoDB tenant delete error:', err);
    }

    try {
      revalidatePath(`/stores/${clean}`);
      revalidatePath('/');
    } catch {}

    return NextResponse.json(
      {
        tenant: clean,
        status: 'success',
        message: `Tenant ${clean} deleted/archived successfully from database!`,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete tenant' },
      { status: 400, headers: corsHeaders() }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getProductsForTenant } from '@/data/products';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const tenantSlug = (searchParams.get('tenant') || request.headers.get('x-tenant-slug') || '').toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const query: Record<string, any> = {
        $or: [{ slug: slug }, { id: slug }],
      };

      if (tenantSlug) {
        query.$and = [{ $or: [{ tenantSlug }, { storeSlug: tenantSlug }] }];
      }

      const product = await db.collection('products').findOne(query);
      if (product) {
        const { _id, ...clean } = product;
        return NextResponse.json({ data: clean, source: 'mongodb_atlas' }, { headers: corsHeaders() });
      }
    }
  } catch (err) {
    console.error('MongoDB product by slug error:', err);
  }

  // Fallback
  const all = getProductsForTenant(tenantSlug);
  const found = all.find((p) => p.slug === slug || p.id === slug) || null;

  return NextResponse.json({ data: found, source: 'fallback' }, { headers: corsHeaders() });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    const result = await db.collection('products').updateOne(
      { $or: [{ slug: slug }, { id: slug }] },
      {
        $set: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    const result = await db.collection('products').deleteOne({
      $or: [{ slug: slug }, { id: slug }],
    });

    return NextResponse.json({ success: true, deletedCount: result.deletedCount }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

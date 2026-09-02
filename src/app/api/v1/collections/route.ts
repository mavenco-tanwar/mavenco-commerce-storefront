import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('collections');
      const count = await collection.countDocuments({
        $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
      });

      if (count === 0) {
        // Auto-seed MongoDB with collections
        const initialCollections = [
          {
            id: 'col_monsoon',
            tenantId: tenantSlug,
            title: 'Monsoon Atelier Capsule',
            slug: 'monsoon-capsule',
            description: 'Bespoke breathable linens and waterproof silk blends.',
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
            productCount: 8,
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'col_festive',
            tenantId: tenantSlug,
            title: 'Royal Heritage Drop',
            slug: 'royal-heritage',
            description: 'Hand-embroidered zardozi and raw silk silhouettes.',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
            productCount: 14,
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        await collection.insertMany(initialCollections);
      }

      const docs = await collection
        .find({
          $or: [{ tenantId: tenantSlug }, { storeSlug: tenantSlug }],
        })
        .toArray();

      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: [] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch collections' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newCollection = {
      ...body,
      id: body.id || `col_${Date.now()}`,
      tenantId: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('collections').insertOne(newCollection);
    }

    return NextResponse.json(
      { success: true, data: newCollection, message: 'Collection created in MongoDB' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

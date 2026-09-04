import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { resolveRequestTenantSlug } from '@/lib/server/tenant-db';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-name, X-Store-ID, X-API-Key, X-Tenant-Slug, x-store-id, x-api-key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const db = await getDatabase();
    const tenantSlug = await resolveRequestTenantSlug(req, searchParams, db);
    const folder = searchParams.get('folder') || undefined;

    let mediaDocs: any[] = [];
    if (db) {
      const query: Record<string, any> = {
        $or: [
          { tenantSlug },
          { storeSlug: tenantSlug },
          { tenantId: tenantSlug },
          { tenantId: `store_${tenantSlug}` },
          { tenantId: 'all' },
        ],
      };
      if (folder && folder !== 'All') {
        query.folder = folder;
      }
      mediaDocs = await db.collection('media').find(query).sort({ createdAt: -1 }).toArray();
    }

    // Default luxury assets if db is empty
    if (mediaDocs.length === 0) {
      mediaDocs = [
        {
          id: 'med_1',
          filename: 'blush-floral-midi-dress-1.jpg',
          url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
          altText: 'Blush Floral Tiered Midi Dress Editorial',
          folder: 'Products',
          sizeBytes: 340000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'med_2',
          filename: 'rose-gold-chanderi-kurti-1.jpg',
          url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
          altText: 'Rose Gold Embroidered Chanderi Kurti Set',
          folder: 'Products',
          sizeBytes: 420000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'med_3',
          filename: 'hero-spring-festive.jpg',
          url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
          altText: 'Spring Festive Lookbook Hero Banner',
          folder: 'Homepage',
          sizeBytes: 850000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'med_4',
          filename: 'girls-pastel-blossom-frock.jpg',
          url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop',
          altText: 'Little Blossom Ruffle Tiered Frock for Girls',
          folder: 'Kids',
          sizeBytes: 290000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'med_5',
          filename: 'boys-heritage-silk-kurta.jpg',
          url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop',
          altText: 'Little Prince Rose-Gold Nehru Jacket & Kurta Set',
          folder: 'Kids',
          sizeBytes: 310000,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const clean = mediaDocs.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const tenantSlug = await resolveRequestTenantSlug(req, undefined, db);

    const now = new Date().toISOString();
    const newMedia = {
      ...body,
      id: body.id || `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: `store_${tenantSlug}`,
      tenantSlug,
      storeSlug: tenantSlug,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('media').insertOne(newMedia);
    }

    const { _id, ...clean } = newMedia as any;
    return NextResponse.json({ success: true, data: clean, message: 'Media asset uploaded' }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

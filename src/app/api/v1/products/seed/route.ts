import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import {
  AURA_LIVING_PRODUCTS,
  APEX_ATHLETICS_PRODUCTS,
  HAUTE_LUXURY_PRODUCTS,
} from '@/data/products';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantSlug = (body.tenantSlug || body.slug || 'jqtrends').toLowerCase().trim();
    const preset = body.preset || 'apparel';

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    let rawCatalog = HAUTE_LUXURY_PRODUCTS;
    if (preset === 'home' || tenantSlug.includes('aura')) {
      rawCatalog = AURA_LIVING_PRODUCTS;
    } else if (preset === 'activewear' || tenantSlug.includes('apex')) {
      rawCatalog = APEX_ATHLETICS_PRODUCTS;
    }

    const seededDocs = rawCatalog.map((p, idx) => ({
      ...p,
      id: `prod_${tenantSlug}_${idx + 1}_${Date.now()}`,
      slug: `${p.slug}-${tenantSlug}`,
      sku: `${tenantSlug.substring(0, 3).toUpperCase()}-${p.sku.split('-').slice(1).join('-')}`,
      tenantSlug,
      storeSlug: tenantSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Remove any existing products for this store first to avoid duplicate keys
    await db.collection('products').deleteMany({
      $or: [{ tenantSlug }, { storeSlug: tenantSlug }],
    });

    // Insert new seeded catalog into MongoDB Atlas
    const insertResult = await db.collection('products').insertMany(seededDocs);

    // Update tenant metrics in 'tenants' collection
    await db.collection('tenants').updateOne(
      { slug: tenantSlug },
      {
        $set: {
          'metrics.products': seededDocs.length,
          'metrics.storageUsedMb': 45,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Record activity log
    await db.collection('platform_activities').insertOne({
      event: `Seeded ${seededDocs.length} sample products into ${tenantSlug} partition`,
      actor: 'superadmin@platform.com',
      tenantId: `store_${tenantSlug}`,
      tenantName: tenantSlug,
      ipAddress: '127.0.0.1',
      severity: 'info',
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        count: insertResult.insertedCount,
        tenantSlug,
        preset,
        source: 'mongodb_atlas',
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('Seed products API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantSlug = (body.tenantSlug || body.slug || 'clothing').toLowerCase().trim();
    const preset = body.preset || 'apparel';

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500, headers: corsHeaders() });
    }

    let rawCatalog = HAUTE_LUXURY_PRODUCTS;
    if (preset === 'home' || tenantSlug.includes('aura') || preset === 'nordic') {
      rawCatalog = AURA_LIVING_PRODUCTS;
    } else if (preset === 'activewear' || tenantSlug.includes('apex') || preset === 'performance') {
      rawCatalog = APEX_ATHLETICS_PRODUCTS;
    }

    // 1. Seed Products
    const seededProducts = rawCatalog.map((p, idx) => ({
      ...p,
      id: `prod_${tenantSlug}_${idx + 1}_${Date.now()}`,
      slug: `${p.slug}-${tenantSlug}`,
      sku: `${tenantSlug.substring(0, 3).toUpperCase()}-${p.sku.split('-').slice(1).join('-')}`,
      tenantSlug,
      storeSlug: tenantSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    await db.collection('products').deleteMany({
      $or: [{ tenantSlug }, { storeSlug: tenantSlug }],
    });

    const insertResult = await db.collection('products').insertMany(seededProducts);

    // 2. Seed 4 Categories
    const sampleCategories = [
      { id: `cat_${tenantSlug}_1`, name: 'New Arrivals', slug: `new-arrivals-${tenantSlug}`, tenantSlug, count: 4 },
      { id: `cat_${tenantSlug}_2`, name: 'Signature Collection', slug: `signature-${tenantSlug}`, tenantSlug, count: 4 },
      { id: `cat_${tenantSlug}_3`, name: 'Atelier Essentials', slug: `essentials-${tenantSlug}`, tenantSlug, count: 2 },
      { id: `cat_${tenantSlug}_4`, name: 'Seasonal Lookbook', slug: `seasonal-${tenantSlug}`, tenantSlug, count: 2 },
    ];

    await db.collection('categories').deleteMany({ tenantSlug });
    await db.collection('categories').insertMany(sampleCategories);

    // 3. Update Platform Tenants Registry Metrics
    await db.collection('platform_tenants_registry').updateOne(
      { $or: [{ slug: tenantSlug }, { tenantId: tenantSlug }, { tenantId: `store_${tenantSlug}` }] },
      {
        $set: {
          'metrics.products': seededProducts.length,
          'metrics.storageUsedMb': 45,
          'metrics.monthlyRevenue': 240000,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // 4. Record Activity Log
    await db.collection('platform_activities').insertOne({
      event: `Seeded ${seededProducts.length} starter SKUs & 4 categories into ${tenantSlug} database`,
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
        categoriesCount: sampleCategories.length,
        tenantSlug,
        preset,
        source: 'mongodb_atlas',
        message: `Successfully seeded ${insertResult.insertedCount} products and 4 categories into MongoDB Atlas for ${tenantSlug}`,
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    console.error('Platform seed API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

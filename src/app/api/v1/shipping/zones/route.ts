import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_ZONES = [
  {
    id: 'zone_domestic_in',
    tenantId: 'lumina',
    name: 'Domestic India (Metro & Tier 1)',
    description: 'Next-day & 2-day express courier coverage across all major Indian metropolitan areas.',
    status: 'active',
    priority: 10,
    countries: ['IN'],
    regions: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
    postalCodeRules: ['400*', '110*', '560*', '600*', '380*'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'zone_international',
    tenantId: 'lumina',
    name: 'Worldwide Express Luxury (US, UK, UAE, EU)',
    description: 'International DHL & FedEx Express white-glove courier shipping.',
    status: 'active',
    priority: 5,
    countries: ['US', 'GB', 'AE', 'CA', 'AU', 'SG', 'FR', 'DE'],
    regions: [],
    postalCodeRules: ['*'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let zones = DEFAULT_ZONES;

    if (db) {
      const collection = db.collection('shipping_zones');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_ZONES.map((z) => ({ ...z, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ priority: -1 }).toArray();
      zones = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      zones = zones.filter((z) => z.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: zones,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
    const db = await getDatabase();

    const now = new Date().toISOString();
    const newZone = {
      ...body,
      id: body.id || `zone_${Date.now()}`,
      tenantId: tenantSlug,
      status: body.status || 'active',
      priority: Number(body.priority) || 5,
      countries: body.countries || ['IN'],
      regions: body.regions || [],
      postalCodeRules: body.postalCodeRules || ['*'],
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('shipping_zones').insertOne(newZone);
    }

    return NextResponse.json({
      success: true,
      data: newZone,
      message: 'Shipping zone created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

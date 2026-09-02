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

const DEFAULT_TAX_ZONES = [
  {
    id: 'tz_india_intra',
    tenantId: 'lumina',
    name: 'India - Intra-State (Maharashtra)',
    code: 'IN_MH',
    description: 'Same-state orders subject to CGST (9%) + SGST (9%).',
    status: 'active',
    priority: 10,
    countries: ['IN'],
    regions: ['Maharashtra'],
    postalCodeRules: ['400*'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tz_india_inter',
    tenantId: 'lumina',
    name: 'India - Inter-State (National)',
    code: 'IN_INTER',
    description: 'Cross-state orders subject to unified IGST (18%).',
    status: 'active',
    priority: 5,
    countries: ['IN'],
    regions: ['Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal'],
    postalCodeRules: ['*'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tz_us_eu',
    tenantId: 'lumina',
    name: 'International (US & European Union)',
    code: 'INTL_STANDARD',
    description: 'Zero-rated export GST or destination VAT where registered.',
    status: 'active',
    priority: 1,
    countries: ['US', 'GB', 'AE', 'FR', 'DE'],
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
    let zones = DEFAULT_TAX_ZONES;

    if (db) {
      const collection = db.collection('tax_zones');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_TAX_ZONES.map((z) => ({ ...z, tenantId: tenantSlug })));
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

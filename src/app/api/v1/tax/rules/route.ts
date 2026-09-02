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

const DEFAULT_TAX_RULES = [
  {
    id: 'tr_gst_intra_apparel',
    tenantId: 'lumina',
    taxZoneId: 'tz_india_intra',
    taxCategoryId: 'tc_luxury_apparel',
    jurisdiction: 'Maharashtra (Intra-State)',
    taxType: 'CGST_SGST',
    rate: 18,
    components: [
      { code: 'CGST', name: 'Central GST', rate: 9 },
      { code: 'SGST', name: 'State GST (Maharashtra)', rate: 9 },
    ],
    priority: 10,
    status: 'active',
    includedInPrice: true,
    appliesToShipping: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tr_gst_inter_apparel',
    tenantId: 'lumina',
    taxZoneId: 'tz_india_inter',
    taxCategoryId: 'tc_luxury_apparel',
    jurisdiction: 'National (Inter-State)',
    taxType: 'IGST',
    rate: 18,
    components: [
      { code: 'IGST', name: 'Integrated GST', rate: 18 },
    ],
    priority: 5,
    status: 'active',
    includedInPrice: true,
    appliesToShipping: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let rules = DEFAULT_TAX_RULES;

    if (db) {
      const collection = db.collection('tax_rules');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_TAX_RULES.map((r) => ({ ...r, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ priority: -1 }).toArray();
      rules = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      rules = rules.filter((r) => r.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: rules,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

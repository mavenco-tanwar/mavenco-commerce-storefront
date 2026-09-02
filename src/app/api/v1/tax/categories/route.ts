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

const DEFAULT_CATEGORIES = [
  {
    id: 'tc_luxury_apparel',
    tenantId: 'lumina',
    name: 'Luxury Apparel & Couture',
    code: 'LUXURY_COUTURE',
    description: 'Designer sarees, lehengas, and gowns above threshold.',
    status: 'active',
    defaultRate: 18,
    externalCode: 'HSN-5007',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tc_handloom_silk',
    tenantId: 'lumina',
    name: 'Handloom & Traditional Weaves',
    code: 'HANDLOOM_SILK',
    description: 'Artisanal handwoven fabrics with subsidized concessional rate.',
    status: 'active',
    defaultRate: 5,
    externalCode: 'HSN-5208',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tc_shipping',
    tenantId: 'lumina',
    name: 'Freight & Courier Services',
    code: 'FREIGHT_LOGISTICS',
    description: 'Standard transport and courier tax rate.',
    status: 'active',
    defaultRate: 18,
    externalCode: 'SAC-9968',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let categories = DEFAULT_CATEGORIES;

    if (db) {
      const collection = db.collection('tax_categories');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_CATEGORIES.map((c) => ({ ...c, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      categories = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      categories = categories.filter((c) => c.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: categories,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

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

const DEFAULT_METHODS = [
  {
    id: 'sm_express',
    tenantId: 'lumina',
    zoneId: 'zone_domestic_in',
    name: 'Bespoke Express Courier (BlueDart / Delhivery Air)',
    code: 'EXPRESS_AIR',
    description: 'Guaranteed 2-3 business day air delivery with luxury presentation packaging.',
    type: 'flat_rate',
    status: 'active',
    displayOrder: 1,
    estimatedMinDays: 2,
    estimatedMaxDays: 3,
    rateAmountMinor: 1500, // $15.00
    freeShippingThresholdMinor: 25000, // Free over $250.00
    carrierCode: 'bluedart',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sm_standard',
    tenantId: 'lumina',
    zoneId: 'zone_domestic_in',
    name: 'Standard Atelier Delivery',
    code: 'STANDARD_GROUND',
    description: 'Reliable 4-6 business day delivery with signature on delivery.',
    type: 'flat_rate',
    status: 'active',
    displayOrder: 2,
    estimatedMinDays: 4,
    estimatedMaxDays: 6,
    rateAmountMinor: 0, // Complimentary
    freeShippingThresholdMinor: 0,
    carrierCode: 'delhivery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sm_intl_dhl',
    tenantId: 'lumina',
    zoneId: 'zone_international',
    name: 'DHL Express Worldwide Luxury',
    code: 'DHL_EXPRESS_INTL',
    description: 'Worldwide priority express with end-to-end temperature and security monitoring.',
    type: 'flat_rate',
    status: 'active',
    displayOrder: 1,
    estimatedMinDays: 3,
    estimatedMaxDays: 5,
    rateAmountMinor: 4500, // $45.00
    freeShippingThresholdMinor: 50000, // Free over $500.00
    carrierCode: 'dhl',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let methods = DEFAULT_METHODS;

    if (db) {
      const collection = db.collection('shipping_methods');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_METHODS.map((m) => ({ ...m, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ displayOrder: 1 }).toArray();
      methods = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      methods = methods.filter((m) => m.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: methods,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

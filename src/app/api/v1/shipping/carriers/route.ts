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

const DEFAULT_CARRIERS = [
  {
    id: 'carr_bluedart',
    tenantId: 'lumina',
    name: 'BlueDart Express Air',
    code: 'bluedart',
    status: 'active',
    supportedCountries: ['IN'],
    trackingUrlTemplate: 'https://www.bluedart.com/tracking?track={trackingNumber}',
    avgDeliveryDays: 2.1,
    slaComplianceRate: 99.1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'carr_delhivery',
    tenantId: 'lumina',
    name: 'Delhivery Surface & Express',
    code: 'delhivery',
    status: 'active',
    supportedCountries: ['IN'],
    trackingUrlTemplate: 'https://www.delhivery.com/track/package/{trackingNumber}',
    avgDeliveryDays: 3.4,
    slaComplianceRate: 98.4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'carr_dhl',
    tenantId: 'lumina',
    name: 'DHL Express Worldwide',
    code: 'dhl',
    status: 'active',
    supportedCountries: ['US', 'GB', 'AE', 'CA', 'EU'],
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={trackingNumber}',
    avgDeliveryDays: 3.2,
    slaComplianceRate: 99.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'carr_fedex',
    tenantId: 'lumina',
    name: 'FedEx Priority',
    code: 'fedex',
    status: 'active',
    supportedCountries: ['US', 'CA', 'GB', 'IN'],
    trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={trackingNumber}',
    avgDeliveryDays: 2.8,
    slaComplianceRate: 99.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let carriers = DEFAULT_CARRIERS;

    if (db) {
      const collection = db.collection('shipping_carriers');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_CARRIERS.map((c) => ({ ...c, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      carriers = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      carriers = carriers.filter((c) => c.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: carriers,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

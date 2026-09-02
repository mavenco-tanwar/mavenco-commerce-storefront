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

const DEFAULT_SHIPMENTS = [
  {
    id: 'shp_1',
    tenantId: 'lumina',
    orderId: 'ord_100234',
    orderNumber: 'LUM-100234',
    customerName: 'Aanya Kapoor',
    warehouseId: 'wh_mumbai_main',
    carrierId: 'carr_bluedart',
    carrierName: 'BlueDart Express Air',
    trackingNumber: 'BD-8839201',
    trackingUrl: 'https://www.bluedart.com/tracking?track=BD-8839201',
    status: 'in_transit',
    estimatedDeliveryAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    shippedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    packageWeightKg: 1.4,
    events: [
      {
        id: 'ev_1',
        status: 'label_created',
        eventCode: 'DATA_RECEIVED',
        description: 'Shipping label created at Mumbai Master Atelier',
        location: 'Mumbai Hub, Maharashtra',
        eventAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: 'ev_2',
        status: 'picked_up',
        eventCode: 'PICKED_UP',
        description: 'Package picked up by BlueDart courier specialist',
        location: 'Mumbai Sorting Facility',
        eventAt: new Date(Date.now() - 86400000 * 1 + 7200000).toISOString(),
      },
      {
        id: 'ev_3',
        status: 'in_transit',
        eventCode: 'AIR_TRANSIT',
        description: 'Departed Mumbai Central Air Hub via Flight BD-991',
        location: 'Mumbai Airport (BOM)',
        eventAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'shp_2',
    tenantId: 'lumina',
    orderId: 'ord_100189',
    orderNumber: 'LUM-100189',
    customerName: 'Priya Sharma',
    warehouseId: 'wh_delhi_hub',
    carrierId: 'carr_delhivery',
    carrierName: 'Delhivery Surface & Express',
    trackingNumber: 'DLV-4920199',
    trackingUrl: 'https://www.delhivery.com/track/package/DLV-4920199',
    status: 'delivered',
    estimatedDeliveryAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    shippedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    packageWeightKg: 2.1,
    events: [
      {
        id: 'ev_4',
        status: 'delivered',
        eventCode: 'DELIVERED',
        description: 'Package delivered to recipient and signature captured',
        location: 'Bengaluru Residence',
        eventAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let shipments = DEFAULT_SHIPMENTS;

    if (db) {
      const collection = db.collection('shipments');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_SHIPMENTS.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: -1 }).toArray();
      shipments = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      shipments = shipments.filter((s) => s.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: shipments,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

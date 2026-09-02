import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_WAREHOUSES = [
  {
    id: 'blr_studio',
    code: 'BLR-01',
    name: 'Bengaluru Flagship Studio & Atelier',
    description: 'Primary luxury showroom and immediate dispatch fulfillment center.',
    status: 'active',
    address: 'Villa 14, Palm Meadows, Indiranagar, 100 Feet Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560038',
    contactName: 'Rohit Sharma',
    contactEmail: 'blr.warehouse@atelier.luxury',
    contactPhone: '+91 98450 12345',
    priority: 1,
    capabilities: ['storage', 'fulfillment', 'pickup', 'returns'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mumbai_hub',
    code: 'BOM-02',
    name: 'Mumbai Central Logistics Hub',
    description: 'High-volume regional distribution and bulk inventory warehousing.',
    status: 'active',
    address: 'Plot 42, MIDC Industrial Area, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400093',
    contactName: 'Priya Mehta',
    contactEmail: 'mumbai.hub@atelier.luxury',
    contactPhone: '+91 98200 67890',
    priority: 2,
    capabilities: ['storage', 'fulfillment'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'delhi_depot',
    code: 'DEL-03',
    name: 'Delhi Northern Express Depot',
    description: 'Rapid air express transit and northern regional fulfillment depot.',
    status: 'active',
    address: 'Sector 18, Udyog Vihar Phase IV',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    postalCode: '122015',
    contactName: 'Vikram Singh',
    contactEmail: 'delhi.depot@atelier.luxury',
    contactPhone: '+91 98110 54321',
    priority: 3,
    capabilities: ['storage', 'fulfillment', 'returns'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';

    const db = await getDatabase();
    if (db) {
      const docs = await db.collection('warehouses').find({ tenantId: tenant }).toArray();
      if (docs && docs.length > 0) {
        return NextResponse.json({ success: true, data: docs });
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_WAREHOUSES,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve warehouses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenant = 'lumina', warehouse } = body;

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newWarehouse = {
      ...warehouse,
      id: warehouse.id || `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenant,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('warehouses').insertOne(newWarehouse);
    }

    return NextResponse.json({
      success: true,
      data: newWarehouse,
      message: 'Warehouse created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create warehouse' },
      { status: 500 }
    );
  }
}

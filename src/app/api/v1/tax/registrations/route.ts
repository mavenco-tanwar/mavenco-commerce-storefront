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

const DEFAULT_REGISTRATIONS = [
  {
    id: 'reg_gst_mh',
    tenantId: 'lumina',
    country: 'IN',
    region: 'Maharashtra',
    registrationType: 'GSTIN',
    registrationNumber: '27AAACL8892P1Z4',
    businessName: 'Lumina Haute Couture Private Limited',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reg_vat_uk',
    tenantId: 'lumina',
    country: 'GB',
    region: 'England',
    registrationType: 'VAT',
    registrationNumber: 'GB-992019482',
    businessName: 'Lumina Luxury UK Limited',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let registrations = DEFAULT_REGISTRATIONS;

    if (db) {
      const collection = db.collection('tax_registrations');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_REGISTRATIONS.map((r) => ({ ...r, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      registrations = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      registrations = registrations.filter((r) => r.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: registrations,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

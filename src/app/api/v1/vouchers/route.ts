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

const DEFAULT_VOUCHERS = [
  {
    id: 'vouch_1',
    tenantId: 'lumina',
    name: 'Atelier Welcome Voucher',
    description: 'Special $50 welcome credit for high-fashion first-time couture orders.',
    code: 'WELCOME50',
    type: 'promotional',
    valueType: 'fixed_amount',
    valueMinor: 5000, // $50.00
    currency: 'USD',
    minimumOrderValueMinor: 25000, // $250.00 min spend
    usageLimit: 1000,
    usedCount: 284,
    status: 'active',
    expiresAt: new Date(Date.now() + 86400000 * 90).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vouch_2',
    tenantId: 'lumina',
    name: 'VIP Private Trunk Show 15% Off',
    description: '15% privilege discount across all bespoke bridal and banquet collections.',
    code: 'VIPRUNWAY15',
    type: 'promotional',
    valueType: 'percentage',
    valueMinor: 0,
    percentage: 15,
    currency: 'USD',
    minimumOrderValueMinor: 50000, // $500.00 min spend
    maximumDiscountMinor: 30000, // $300.00 max cap
    usageLimit: 500,
    usedCount: 142,
    status: 'active',
    expiresAt: new Date(Date.now() + 86400000 * 60).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let vouchers = DEFAULT_VOUCHERS;

    if (db) {
      const collection = db.collection('digital_vouchers');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_VOUCHERS.map((v) => ({ ...v, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: -1 }).toArray();
      vouchers = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      vouchers = vouchers.filter((v) => v.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: vouchers,
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
    const newVoucher = {
      id: `vouch_${Date.now()}`,
      tenantId: tenantSlug,
      name: body.name || 'Custom Boutique Voucher',
      description: body.description || 'Exclusive shopping credit voucher',
      code: (body.code || `VOUCH-${Math.random().toString(36).substring(2, 6)}`).toUpperCase(),
      type: body.type || 'promotional',
      valueType: body.valueType || 'fixed_amount',
      valueMinor: Math.round(Number(body.valueMinor || body.value * 100)) || 2500,
      percentage: body.percentage ? Number(body.percentage) : undefined,
      currency: body.currency || 'USD',
      minimumOrderValueMinor: Math.round(Number(body.minimumOrderValueMinor || 0)),
      maximumDiscountMinor: body.maximumDiscountMinor ? Math.round(Number(body.maximumDiscountMinor)) : undefined,
      usageLimit: Number(body.usageLimit) || 500,
      usedCount: 0,
      status: 'active',
      expiresAt: new Date(Date.now() + 86400000 * (body.expiryDays || 60)).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('digital_vouchers').insertOne(newVoucher);
    }

    return NextResponse.json({
      success: true,
      data: newVoucher,
      message: 'Voucher created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

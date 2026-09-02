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

const DEFAULT_REWARDS = [
  {
    id: 'rew_25_off',
    tenantId: 'lumina',
    name: '$25 Boutique Voucher',
    description: 'Redeem 500 Couture Coins for an instant $25 order discount.',
    pointsCost: 500,
    discountType: 'fixed_amount',
    discountValue: 25,
    couponCodePrefix: 'REW25',
    status: 'active',
  },
  {
    id: 'rew_50_off',
    tenantId: 'lumina',
    name: '$50 Luxury Voucher',
    description: 'Redeem 1,000 Couture Coins for a $50 shopping credit voucher.',
    pointsCost: 1000,
    discountType: 'fixed_amount',
    discountValue: 50,
    couponCodePrefix: 'REW50',
    status: 'active',
  },
  {
    id: 'rew_free_shipping',
    tenantId: 'lumina',
    name: 'Complimentary Express Courier',
    description: 'Redeem 300 Couture Coins for zero-fee overnight delivery.',
    pointsCost: 300,
    discountType: 'free_shipping',
    discountValue: 100,
    couponCodePrefix: 'FREESHIP',
    status: 'active',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('loyalty_rewards');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_REWARDS.map((r) => ({ ...r, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_REWARDS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rewardId, pointsCost, couponCodePrefix = 'REW' } = body;
    const generatedCode = `${couponCodePrefix}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: `Reward redeemed successfully! Deducted ${pointsCost} points.`,
      data: {
        code: generatedCode,
        rewardId,
        pointsDeducted: pointsCost,
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

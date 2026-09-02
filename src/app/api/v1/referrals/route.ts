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

const DEFAULT_REFERRALS = [
  {
    id: 'ref_1',
    tenantId: 'lumina',
    referrerCustomerId: 'cust_1',
    referredEmail: 'priya.sharma@example.com',
    referralCode: 'AANYA-VIP50',
    status: 'rewarded',
    rewardPoints: 600,
    rewardWalletCreditMinor: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ref_2',
    tenantId: 'lumina',
    referrerCustomerId: 'cust_1',
    referredEmail: 'rohit.mehta@example.com',
    referralCode: 'AANYA-VIP50',
    status: 'registered',
    rewardPoints: 0,
    rewardWalletCreditMinor: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const customerId = searchParams.get('customerId') || 'cust_1';

    const db = await getDatabase();
    let referrals = DEFAULT_REFERRALS;

    if (db) {
      const collection = db.collection('customer_referrals');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_REFERRALS.map((r) => ({ ...r, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug, referrerCustomerId: customerId }).sort({ createdAt: -1 }).toArray();
      referrals = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      referrals = referrals.filter((r) => r.tenantId === tenantSlug && r.referrerCustomerId === customerId);
    }

    return NextResponse.json({
      success: true,
      data: referrals,
      referralCode: 'AANYA-VIP50',
      shareUrl: `https://lumina.atelier/invite/AANYA-VIP50`,
      rewardSummary: {
        totalInvited: referrals.length,
        rewardedCount: referrals.filter((r) => r.status === 'rewarded').length,
        totalPointsEarned: referrals.reduce((sum, r) => sum + r.rewardPoints, 0),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

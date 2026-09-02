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

const DEFAULT_PROGRAM = {
  id: 'loyalty_main',
  tenantId: 'lumina',
  name: 'Lumina Privé Haute Loyalty Club',
  pointsLabel: 'Couture Coins',
  pointsPerCurrency: 1, // 1 point per $1 spent
  redemptionRate: 20, // 20 points = $1 discount
  minimumRedeemablePoints: 200,
  tiers: [
    {
      id: 'tier_bronze',
      name: 'Bronze Member',
      minSpend: 0,
      pointsMultiplier: 1.0,
      benefits: ['1x Points on Purchases', 'Standard Birthday Gift', 'Seasonal Lookbook'],
      badgeColor: 'bg-amber-800/20 text-amber-500 border-amber-800/40',
    },
    {
      id: 'tier_silver',
      name: 'Silver Atelier',
      minSpend: 2000,
      pointsMultiplier: 1.25,
      benefits: ['1.25x Points Multiplier', 'Early Access to Runway Drops', 'Complimentary Packaging'],
      badgeColor: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
    },
    {
      id: 'tier_gold',
      name: 'Gold Couture VIP',
      minSpend: 5000,
      pointsMultiplier: 1.5,
      benefits: ['1.5x Points Multiplier', 'Dedicated Styling Concierge', 'Free Express Shipping', 'Festive Gift Hamper'],
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    },
    {
      id: 'tier_platinum',
      name: 'Platinum Haute Royale',
      minSpend: 10000,
      pointsMultiplier: 2.0,
      benefits: ['2.0x Points Multiplier', 'Bespoke Custom Tailoring Access', 'Private Salon Invitations', 'Zero-Fee Alterations'],
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('loyalty_programs');
      let prog = await collection.findOne({ tenantId: tenantSlug });
      if (!prog) {
        await collection.insertOne({ ...DEFAULT_PROGRAM, tenantId: tenantSlug });
        prog = { ...DEFAULT_PROGRAM, tenantId: tenantSlug };
      }
      const { _id, ...clean } = prog as any;
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_PROGRAM }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

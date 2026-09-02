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

const DEFAULT_WALLET_LEDGER = [
  {
    id: 'wlt_1',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'REFUND',
    amountMinor: 15000, // $150.00 in cents
    currency: 'USD',
    balanceBeforeMinor: 0,
    balanceAfterMinor: 15000,
    source: 'refund.store_credit',
    sourceId: 'RET-1002',
    description: 'Instant Store Credit Refund for Return #RET-1002',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'wlt_2',
    tenantId: 'lumina',
    customerId: 'cust_1',
    type: 'PROMOTION',
    amountMinor: 5000, // $50.00 in cents
    currency: 'USD',
    balanceBeforeMinor: 15000,
    balanceAfterMinor: 20000,
    source: 'vip.anniversary',
    description: 'Gold VIP Annual Couture Credit Bonus',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const customerId = searchParams.get('customerId') || 'cust_1';

    const db = await getDatabase();
    let ledger = DEFAULT_WALLET_LEDGER;

    if (db) {
      const collection = db.collection('wallet_ledger_entries');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_WALLET_LEDGER.map((l) => ({ ...l, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug, customerId }).sort({ createdAt: -1 }).toArray();
      ledger = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      ledger = ledger.filter((l) => l.tenantId === tenantSlug && l.customerId === customerId);
    }

    const currentBalanceMinor = ledger.length > 0 ? ledger[0].balanceAfterMinor : 20000;

    return NextResponse.json({
      success: true,
      data: ledger,
      currentBalanceMinor,
      currency: 'USD',
      formattedBalance: `$${(currentBalanceMinor / 100).toFixed(2)}`,
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

    const amountMinor = Math.round(Number(body.amountMinor || body.amount * 100)) || 5000;
    const now = new Date().toISOString();
    const newEntry = {
      id: `wlt_${Date.now()}`,
      tenantId: tenantSlug,
      customerId: body.customerId || 'cust_1',
      type: body.type || 'CREDIT',
      amountMinor,
      currency: body.currency || 'USD',
      balanceBeforeMinor: body.balanceBeforeMinor || 20000,
      balanceAfterMinor: (body.balanceBeforeMinor || 20000) + amountMinor,
      source: body.source || 'admin.adjustment',
      description: body.description || 'Customer Goodwill Wallet Credit',
      createdAt: now,
    };

    if (db) {
      await db.collection('wallet_ledger_entries').insertOne(newEntry);
    }

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: 'Wallet transaction committed successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

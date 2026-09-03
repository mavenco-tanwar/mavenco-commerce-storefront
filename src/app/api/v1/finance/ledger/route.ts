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

const DEFAULT_LEDGER_ENTRIES = [
  {
    id: 'fled_001',
    tenantId: 'lumina',
    entryType: 'sale',
    sourceType: 'order',
    sourceId: 'ord_100234',
    direction: 'credit',
    amountMinor: 50000,
    currency: 'USD',
    accountCode: '4000',
    category: 'Sales Revenue',
    description: 'Order #LUM-100234 product sales recognition',
    occurredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'fled_002',
    tenantId: 'lumina',
    entryType: 'tax',
    sourceType: 'order',
    sourceId: 'ord_100234',
    direction: 'credit',
    amountMinor: 9000,
    currency: 'USD',
    accountCode: '2000',
    category: 'Tax Payable (GST 18%)',
    description: 'CGST (9%) + SGST (9%) on Order #LUM-100234',
    occurredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'fled_003',
    tenantId: 'lumina',
    entryType: 'payment_fee',
    sourceType: 'payment',
    sourceId: 'pay_100234',
    direction: 'debit',
    amountMinor: 1000,
    currency: 'USD',
    accountCode: '5000',
    category: 'Payment Processing Fees',
    description: 'Razorpay processing fee on Order #LUM-100234',
    occurredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'fled_004',
    tenantId: 'lumina',
    entryType: 'refund',
    sourceType: 'refund',
    sourceId: 'ref_7749202',
    direction: 'debit',
    amountMinor: 15000,
    currency: 'USD',
    accountCode: '4100',
    category: 'Sales Returns & Refunds',
    description: 'Return credit adjustment for Order #LUM-100189',
    occurredAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let entries = DEFAULT_LEDGER_ENTRIES;

    if (db) {
      const collection = db.collection('financial_ledger_entries');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_LEDGER_ENTRIES.map((e) => ({ ...e, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ occurredAt: -1 }).toArray();
      entries = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      entries = entries.filter((e) => e.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: entries,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

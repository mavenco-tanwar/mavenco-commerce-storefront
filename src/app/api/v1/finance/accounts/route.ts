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

const DEFAULT_ACCOUNTS = [
  {
    id: 'facc_1100',
    tenantId: 'lumina',
    code: '1100',
    name: 'Gateway Clearing & In-Transit Funds',
    category: 'asset',
    balanceMinor: 2450000, // $24,500.00
    currency: 'USD',
    status: 'active',
    description: 'Payments authorized and captured awaiting gateway bank payout.',
  },
  {
    id: 'facc_1200',
    tenantId: 'lumina',
    code: '1200',
    name: 'Settlement Bank Account',
    category: 'asset',
    balanceMinor: 12442000, // $124,420.00
    currency: 'USD',
    status: 'active',
    description: 'Main commercial settlement bank account.',
  },
  {
    id: 'facc_2000',
    tenantId: 'lumina',
    code: '2000',
    name: 'Tax Payable (GST / VAT)',
    category: 'liability',
    balanceMinor: 2173500, // $21,735.00
    currency: 'USD',
    status: 'active',
    description: 'Output GST (CGST/SGST/IGST) collected from customers.',
  },
  {
    id: 'facc_4000',
    tenantId: 'lumina',
    code: '4000',
    name: 'Gross Sales Revenue',
    category: 'revenue',
    balanceMinor: 14892000, // $148,920.00
    currency: 'USD',
    status: 'active',
    description: 'Authoritative recognized product sales revenue.',
  },
  {
    id: 'facc_5000',
    tenantId: 'lumina',
    code: '5000',
    name: 'Gateway Processing Fees Expense',
    category: 'expense',
    balanceMinor: 297800, // $2,978.00
    currency: 'USD',
    status: 'active',
    description: 'Merchant discount rates (MDR) and gateway charges.',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let accounts = DEFAULT_ACCOUNTS;

    if (db) {
      const collection = db.collection('financial_accounts');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_ACCOUNTS.map((a) => ({ ...a, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ code: 1 }).toArray();
      accounts = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      accounts = accounts.filter((a) => a.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: accounts,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

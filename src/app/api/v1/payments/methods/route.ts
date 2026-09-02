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

const DEFAULT_METHODS = [
  {
    id: 'pm_upi',
    tenantId: 'lumina',
    type: 'upi',
    provider: 'razorpay',
    displayName: 'Instant UPI (Google Pay, PhonePe, Paytm, QR)',
    status: 'active',
    supportedCurrencies: ['INR', 'USD'],
    sortOrder: 1,
    isPopular: true,
  },
  {
    id: 'pm_cards',
    tenantId: 'lumina',
    type: 'card',
    provider: 'stripe',
    displayName: 'Credit & Debit Cards (Visa, MasterCard, Amex)',
    status: 'active',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AED'],
    sortOrder: 2,
    isPopular: true,
  },
  {
    id: 'pm_netbanking',
    tenantId: 'lumina',
    type: 'netbanking',
    provider: 'razorpay',
    displayName: 'NetBanking (50+ Indian Banks)',
    status: 'active',
    supportedCurrencies: ['INR'],
    sortOrder: 3,
  },
  {
    id: 'pm_cod',
    tenantId: 'lumina',
    type: 'cod',
    provider: 'cod',
    displayName: 'Cash on Delivery (Available for Metro pin codes)',
    status: 'active',
    supportedCurrencies: ['INR'],
    sortOrder: 4,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let methods = DEFAULT_METHODS;

    if (db) {
      const collection = db.collection('payment_methods');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_METHODS.map((m) => ({ ...m, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ sortOrder: 1 }).toArray();
      methods = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      methods = methods.filter((m) => m.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: methods,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

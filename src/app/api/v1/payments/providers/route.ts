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

const DEFAULT_PROVIDERS = [
  {
    id: 'prov_razorpay',
    tenantId: 'lumina',
    name: 'Razorpay Payment Suite',
    provider: 'razorpay',
    environment: 'production',
    status: 'active',
    supportedCurrencies: ['INR', 'USD'],
    supportedMethods: ['upi', 'card', 'netbanking', 'wallet'],
    priority: 1,
    latencyMs: 142,
    successRate: 99.4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prov_stripe',
    tenantId: 'lumina',
    name: 'Stripe Global Express',
    provider: 'stripe',
    environment: 'production',
    status: 'active',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD'],
    supportedMethods: ['card', 'apple_pay', 'google_pay'],
    priority: 2,
    latencyMs: 98,
    successRate: 99.8,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prov_cod',
    tenantId: 'lumina',
    name: 'Cash on Delivery Engine',
    provider: 'cod',
    environment: 'production',
    status: 'active',
    supportedCurrencies: ['INR'],
    supportedMethods: ['cod'],
    priority: 3,
    latencyMs: 12,
    successRate: 96.2,
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let providers = DEFAULT_PROVIDERS;

    if (db) {
      const collection = db.collection('payment_provider_accounts');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_PROVIDERS.map((p) => ({ ...p, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ priority: 1 }).toArray();
      providers = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      providers = providers.filter((p) => p.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: providers,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

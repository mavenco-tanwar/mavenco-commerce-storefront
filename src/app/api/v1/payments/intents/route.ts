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

const DEFAULT_INTENTS = [
  {
    id: 'pi_8839201',
    tenantId: 'lumina',
    orderId: 'ord_100234',
    amountMinor: 50000,
    currency: 'USD',
    status: 'succeeded',
    paymentMethodTypes: ['card', 'upi', 'netbanking'],
    provider: 'razorpay',
    providerIntentId: 'order_rzp_8839201',
    clientSecret: 'rzp_sec_mock_8839201',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let intents = DEFAULT_INTENTS;

    if (db) {
      const collection = db.collection('payment_intents');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_INTENTS.map((i) => ({ ...i, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: -1 }).toArray();
      intents = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      intents = intents.filter((i) => i.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: intents,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
    const { orderId, amountMinor, currency = 'USD', provider = 'razorpay' } = body;

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newIntent = {
      id: `pi_${Date.now()}`,
      tenantId: tenantSlug,
      orderId,
      amountMinor: Number(amountMinor) || 10000,
      currency,
      status: 'requires_payment_method',
      paymentMethodTypes: ['card', 'upi', 'netbanking'],
      provider,
      providerIntentId: `order_${provider}_${Date.now()}`,
      clientSecret: `sec_${provider}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('payment_intents').insertOne(newIntent);
    }

    return NextResponse.json({
      success: true,
      data: newIntent,
      message: 'Payment intent created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

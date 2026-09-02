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

const DEFAULT_WEBHOOKS = [
  {
    id: 'wh_evt_992019',
    tenantId: 'lumina',
    provider: 'razorpay',
    eventId: 'evt_rzp_order_paid_8839201',
    eventType: 'payment.captured',
    signatureValid: true,
    status: 'processed',
    receivedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 2 + 300).toISOString(),
  },
  {
    id: 'wh_evt_992018',
    tenantId: 'lumina',
    provider: 'stripe',
    eventId: 'evt_str_pi_succeeded_77192',
    eventType: 'payment_intent.succeeded',
    signatureValid: true,
    status: 'processed',
    receivedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    processedAt: new Date(Date.now() - 86400000 * 3 + 240).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let webhooks = DEFAULT_WEBHOOKS;

    if (db) {
      const collection = db.collection('payment_webhooks');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_WEBHOOKS.map((w) => ({ ...w, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ receivedAt: -1 }).toArray();
      webhooks = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      webhooks = webhooks.filter((w) => w.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: webhooks,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

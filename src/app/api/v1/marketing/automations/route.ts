import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_AUTOMATIONS = [
  {
    id: 'auto_abandoned_cart_1h',
    tenantId: 'lumina',
    name: '🛒 Abandoned Cart Recovery (1 Hour Reminder)',
    triggerType: 'abandoned_cart',
    status: 'active',
    delayMinutes: 60,
    channel: 'email',
    templateSubject: 'Your bespoke items are waiting in your bag',
    templateBody: 'Hi {{customer.firstName}}, we noticed you left items in your shopping bag. Complete your order now before they sell out.',
    stats: {
      triggers: 480,
      sent: 465,
      recoveredOrders: 82,
      recoveredRevenue: 49200,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'auto_welcome_series',
    tenantId: 'lumina',
    name: '✨ New Member Welcome + 10% Voucher',
    triggerType: 'welcome_series',
    status: 'active',
    delayMinutes: 0,
    channel: 'email',
    templateSubject: 'Welcome to Lumina Haute Couture — Enjoy 10% Off',
    templateBody: 'Welcome {{customer.firstName}}! Use voucher code WELCOME10 on your first couture purchase.',
    discountCode: 'WELCOME10',
    stats: {
      triggers: 610,
      sent: 610,
      recoveredOrders: 142,
      recoveredRevenue: 85200,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'auto_win_back_60d',
    tenantId: 'lumina',
    name: '💌 60-Day Inactivity Win-Back Journey',
    triggerType: 'win_back_60d',
    status: 'active',
    delayMinutes: 86400,
    channel: 'whatsapp',
    templateSubject: 'We miss you at Lumina',
    templateBody: 'Hi {{customer.firstName}}, discover our newest festive runway drops with complimentary express concierge.',
    stats: {
      triggers: 240,
      sent: 232,
      recoveredOrders: 29,
      recoveredRevenue: 26100,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('lifecycle_automations');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_AUTOMATIONS.map((a) => ({ ...a, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_AUTOMATIONS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const db = await getDatabase();
    if (db && id) {
      await db.collection('lifecycle_automations').updateOne(
        { id },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
    }
    return NextResponse.json({ success: true, message: 'Automation status updated' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

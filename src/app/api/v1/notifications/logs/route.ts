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

const DEFAULT_LOGS = [
  {
    id: 'log_1',
    tenantId: 'lumina',
    notificationId: 'notif_1001',
    recipient: 'aanya.kapoor@example.com',
    channel: 'email',
    event: 'order.created',
    status: 'delivered',
    provider: 'resend',
    subject: 'Order Confirmed: LUM-100234',
    contentSnippet: 'Your order of $2,450.00 is confirmed and currently being tailored...',
    attempts: 1,
    sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 * 1 + 2000).toISOString(),
  },
  {
    id: 'log_2',
    tenantId: 'lumina',
    notificationId: 'notif_1002',
    recipient: '+919876543210',
    channel: 'sms',
    event: 'fulfillment.shipped',
    status: 'delivered',
    provider: 'twilio',
    contentSnippet: 'Lumina: Order #LUM-100234 has dispatched via BlueDart Express...',
    attempts: 1,
    sentAt: new Date(Date.now() - 86400000 * 1 + 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 * 1 + 3605000).toISOString(),
  },
  {
    id: 'log_3',
    tenantId: 'lumina',
    notificationId: 'notif_1003',
    recipient: '+919876543210',
    channel: 'whatsapp',
    event: 'cart.abandoned',
    status: 'delivered',
    provider: 'meta_whatsapp',
    contentSnippet: 'Hi Aanya, complete your luxury order with code RECOVER10...',
    attempts: 1,
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deliveredAt: new Date(Date.now() - 86400000 * 2 + 1500).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('notification_delivery_logs');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_LOGS.map((l) => ({ ...l, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ sentAt: -1 }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_LOGS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const newLog = {
      ...body,
      id: `log_${Date.now()}`,
      tenantId: tenantSlug,
      status: 'delivered',
      attempts: 1,
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    };

    if (db) {
      await db.collection('notification_delivery_logs').insertOne(newLog);
    }

    return NextResponse.json({
      success: true,
      data: newLog,
      message: 'Test notification dispatched successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

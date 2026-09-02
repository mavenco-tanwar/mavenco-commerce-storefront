import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_IN_APP_NOTIFICATIONS = [
  {
    id: 'notif_1',
    tenantId: 'lumina',
    customerId: 'cust_1',
    title: 'Order LUM-100234 Shipped via BlueDart Express',
    body: 'Your Pure Mulberry Silk Banarasi Saree has been dispatched from our Mumbai Atelier with tracking code BD-8839201.',
    category: 'SHIPPING',
    actionUrl: '/account?tab=orders',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'notif_2',
    tenantId: 'lumina',
    customerId: 'cust_1',
    title: '👑 You Achieved Gold Couture VIP Tier!',
    body: 'Congratulations! You now earn 1.5x Couture Coins on all purchases and enjoy complimentary express courier shipping.',
    category: 'ACCOUNT',
    actionUrl: '/account?tab=loyalty',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'notif_3',
    tenantId: 'lumina',
    customerId: 'cust_1',
    title: 'Instant $150.00 Store Credit Issued',
    body: 'Your store credit refund for return RET-1002 is now active in your wallet and ready to be used at checkout.',
    category: 'REFUND',
    actionUrl: '/account?tab=giftcards',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const customerId = searchParams.get('customerId') || 'cust_1';

    const db = await getDatabase();
    let notifications = DEFAULT_IN_APP_NOTIFICATIONS;

    if (db) {
      const collection = db.collection('in_app_notifications');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_IN_APP_NOTIFICATIONS.map((n) => ({ ...n, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug, customerId }).sort({ createdAt: -1 }).toArray();
      notifications = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      notifications = notifications.filter((n) => n.tenantId === tenantSlug && n.customerId === customerId);
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, readAll, customerId = 'cust_1' } = body;
    const db = await getDatabase();

    if (db) {
      if (readAll) {
        await db.collection('in_app_notifications').updateMany({ customerId }, { $set: { isRead: true } });
      } else if (id) {
        await db.collection('in_app_notifications').updateOne({ id }, { $set: { isRead: true } });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications updated successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

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

const DEFAULT_CAMPAIGNS = [
  {
    id: 'camp_festive_drop',
    tenantId: 'lumina',
    name: 'Festive Couture Collection VIP Launch',
    channel: 'email',
    status: 'completed',
    audienceSegmentId: 'seg_vip',
    audienceName: '👑 VIP Champions ($5,000+ Spend)',
    subject: 'Exclusive Early Access: Royal Silk & Handcrafted Zardozi',
    content: 'Hi {{customer.firstName}}, your VIP access to the Festive Silk Drop is now live with coupon {{coupon.code}}.',
    discountCode: 'FESTIVE20',
    analytics: {
      sent: 342,
      delivered: 340,
      opened: 228,
      clicked: 142,
      orders: 38,
      revenue: 57000,
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'camp_sms_flash',
    tenantId: 'lumina',
    name: 'Weekend Flash 15% Off SMS Broadcast',
    channel: 'sms',
    status: 'completed',
    audienceSegmentId: 'seg_recent_30d',
    audienceName: '🛍️ Active Buyers (Last 30 Days)',
    content: 'Flash Sale Alert! Use code SILK15 for 15% off fine garments today only: lumina.com/sale',
    discountCode: 'SILK15',
    analytics: {
      sent: 890,
      delivered: 875,
      opened: 790,
      clicked: 310,
      orders: 54,
      revenue: 32400,
    },
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('marketing_campaigns');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_CAMPAIGNS.map((c) => ({ ...c, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_CAMPAIGNS }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newCampaign = {
      ...body,
      id: body.id || `camp_${Date.now()}`,
      tenantId: tenantSlug,
      status: 'completed',
      analytics: {
        sent: Math.floor(Math.random() * 400) + 150,
        delivered: Math.floor(Math.random() * 380) + 140,
        opened: Math.floor(Math.random() * 200) + 80,
        clicked: Math.floor(Math.random() * 90) + 30,
        orders: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 25000) + 5000,
      },
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('marketing_campaigns').insertOne(newCampaign);
    }

    return NextResponse.json({ success: true, data: newCampaign, message: 'Campaign dispatched successfully!' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

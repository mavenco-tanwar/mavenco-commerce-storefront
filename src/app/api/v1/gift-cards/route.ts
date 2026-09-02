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

const DEFAULT_GIFT_CARDS = [
  {
    id: 'gc_1',
    tenantId: 'lumina',
    code: 'GIFT-9X28-74KL',
    initialBalance: 500,
    currentBalance: 500,
    currency: 'USD',
    status: 'active',
    recipientEmail: 'aanya.kapoor@example.com',
    senderName: 'Lumina Concierge',
    message: 'Complimentary Haute Couture Gift Card',
    expiresAt: new Date(Date.now() + 86400000 * 365).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gc_2',
    tenantId: 'lumina',
    code: 'GIFT-44M2-99PZ',
    initialBalance: 250,
    currentBalance: 120,
    currency: 'USD',
    status: 'partially_redeemed',
    recipientEmail: 'rohan.mehra@example.com',
    senderName: 'Atelier Privé',
    message: 'Happy Birthday & Happy Shopping',
    expiresAt: new Date(Date.now() + 86400000 * 180).toISOString(),
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
      const collection = db.collection('gift_cards');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_GIFT_CARDS.map((g) => ({ ...g, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_GIFT_CARDS }, { headers: corsHeaders() });
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
    const newGiftCard = {
      ...body,
      id: body.id || `gc_${Date.now()}`,
      tenantId: tenantSlug,
      code: body.code || `GIFT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      currentBalance: body.initialBalance || 100,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('gift_cards').insertOne(newGiftCard);
    }

    return NextResponse.json({ success: true, data: newGiftCard, message: 'Digital gift card issued successfully!' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

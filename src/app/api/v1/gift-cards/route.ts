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

const DEFAULT_GIFT_CARDS = [
  {
    id: 'gc_1',
    tenantId: 'lumina',
    giftCardNumber: 'GC-9821-4402-9182',
    codeLast4: '9182',
    type: 'digital',
    status: 'active',
    initialAmountMinor: 50000, // $500.00
    currentBalanceMinor: 50000,
    currency: 'USD',
    recipientEmail: 'aanya.kapoor@example.com',
    recipientName: 'Aanya Kapoor',
    senderName: 'Lumina VIP Concierge',
    message: 'Complimentary Haute Couture shopping voucher for your milestone anniversary.',
    expiresAt: new Date(Date.now() + 86400000 * 365).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gc_2',
    tenantId: 'lumina',
    giftCardNumber: 'GC-1029-8831-5520',
    codeLast4: '5520',
    type: 'digital',
    status: 'partially_redeemed',
    initialAmountMinor: 25000, // $250.00
    currentBalanceMinor: 10000, // $100.00 remaining
    currency: 'USD',
    recipientEmail: 'aanya.kapoor@example.com',
    recipientName: 'Aanya Kapoor',
    senderName: 'Rohit Kapoor',
    message: 'Happy Birthday darling! Pick any bespoke silk saree you adore.',
    expiresAt: new Date(Date.now() + 86400000 * 180).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const recipientEmail = searchParams.get('email');

    const db = await getDatabase();
    let giftCards = DEFAULT_GIFT_CARDS;

    if (db) {
      const collection = db.collection('gift_cards');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_GIFT_CARDS.map((g) => ({ ...g, tenantId: tenantSlug })));
      }
      const query: any = { tenantId: tenantSlug };
      if (recipientEmail) query.recipientEmail = recipientEmail;
      const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
      giftCards = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      giftCards = giftCards.filter((g) => g.tenantId === tenantSlug);
      if (recipientEmail) {
        giftCards = giftCards.filter((g) => g.recipientEmail === recipientEmail);
      }
    }

    return NextResponse.json({
      success: true,
      data: giftCards,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();
    const db = await getDatabase();

    const amountMinor = Math.round(Number(body.amountMinor || body.amount * 100)) || 25000;
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const fullCardNumber = `GC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;

    const newGiftCard = {
      id: `gc_${Date.now()}`,
      tenantId: tenantSlug,
      giftCardNumber: fullCardNumber,
      codeLast4: randomSuffix,
      type: body.type || 'digital',
      status: 'active',
      initialAmountMinor: amountMinor,
      currentBalanceMinor: amountMinor,
      currency: body.currency || 'USD',
      recipientEmail: body.recipientEmail,
      recipientName: body.recipientName,
      senderName: body.senderName || 'Merchant Concierge',
      message: body.message || 'A bespoke gift for you.',
      expiresAt: new Date(Date.now() + 86400000 * (body.expiryDays || 365)).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('gift_cards').insertOne(newGiftCard);
      // Create immutable ledger entry
      await db.collection('gift_card_ledgers').insertOne({
        id: `gcl_${Date.now()}`,
        tenantId: tenantSlug,
        giftCardId: newGiftCard.id,
        type: 'ISSUE',
        amountMinor,
        currency: newGiftCard.currency,
        balanceBeforeMinor: 0,
        balanceAfterMinor: amountMinor,
        description: `Gift card issued for ${newGiftCard.recipientEmail || 'Customer'}`,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      data: newGiftCard,
      message: 'Gift card issued successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

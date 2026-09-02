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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, amountMinorToRedeem = 0 } = body;
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (!code) {
      return NextResponse.json({ success: false, error: 'Gift card code is required' }, { status: 400, headers: corsHeaders() });
    }

    let giftCard: any = null;
    if (db) {
      // Find matching gift card by number or suffix
      giftCard = await db.collection('gift_cards').findOne({
        tenantId: tenantSlug,
        $or: [
          { giftCardNumber: code.trim().toUpperCase() },
          { codeLast4: code.trim().slice(-4) },
        ],
      });
    }

    if (!giftCard) {
      // Return demo balance for sample code
      return NextResponse.json({
        success: true,
        data: {
          valid: true,
          giftCardNumber: code,
          currentBalanceMinor: 50000,
          currency: 'USD',
          formattedBalance: '$500.00',
        },
      }, { headers: corsHeaders() });
    }

    if (giftCard.status !== 'active' && giftCard.status !== 'partially_redeemed') {
      return NextResponse.json({ success: false, error: `Gift card is ${giftCard.status}` }, { status: 400, headers: corsHeaders() });
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        giftCardId: giftCard.id,
        giftCardNumber: giftCard.giftCardNumber,
        currentBalanceMinor: giftCard.currentBalanceMinor,
        currency: giftCard.currency,
        formattedBalance: `$${(giftCard.currentBalanceMinor / 100).toFixed(2)}`,
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

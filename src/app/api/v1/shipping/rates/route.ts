import { NextRequest, NextResponse } from 'next/server';

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
    const { country = 'IN', subtotalMinor = 50000 } = body;

    const isInternational = country !== 'IN';
    const isFreeEligible = subtotalMinor >= 25000;

    const quotes = isInternational
      ? [
          {
            id: 'quote_dhl_intl',
            methodId: 'sm_intl_dhl',
            name: 'DHL Express Worldwide Luxury',
            amountMinor: subtotalMinor >= 50000 ? 0 : 4500,
            currency: 'USD',
            estimatedMinDays: 3,
            estimatedMaxDays: 5,
            carrier: 'DHL Express',
          },
        ]
      : [
          {
            id: 'quote_express',
            methodId: 'sm_express',
            name: 'Bespoke Express Courier (BlueDart Air)',
            amountMinor: isFreeEligible ? 0 : 1500,
            currency: 'USD',
            estimatedMinDays: 2,
            estimatedMaxDays: 3,
            carrier: 'BlueDart Express',
          },
          {
            id: 'quote_standard',
            methodId: 'sm_standard',
            name: 'Standard Atelier Delivery',
            amountMinor: 0,
            currency: 'USD',
            estimatedMinDays: 4,
            estimatedMaxDays: 6,
            carrier: 'Delhivery',
          },
        ];

    return NextResponse.json({
      success: true,
      data: quotes,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

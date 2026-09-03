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

const DEFAULT_PAYMENT_METHODS = [
  {
    id: 'pm_card_visa_4242',
    tenantId: 'lumina',
    brand: 'Visa Business Card',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2029,
    isDefault: true,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  },
  {
    id: 'pm_card_mc_8812',
    tenantId: 'lumina',
    brand: 'Mastercard Commercial',
    last4: '8812',
    expiryMonth: 8,
    expiryYear: 2030,
    isDefault: false,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: DEFAULT_PAYMENT_METHODS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

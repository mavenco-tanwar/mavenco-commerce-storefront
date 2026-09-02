import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/tenant-config';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const t = resolveTenant();

  return NextResponse.json(
    {
      success: true,
      data: {
        storeName: t.name,
        currency: 'USD',
        currencySymbol: '$',
        theme: t.theme,
      },
    },
    { headers: corsHeaders() }
  );
}

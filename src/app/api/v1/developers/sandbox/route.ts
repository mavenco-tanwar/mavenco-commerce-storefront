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

let SANDBOX_STATE = {
  sandboxModeEnabled: true,
  seedDataStatus: 'ready',
  mockProductsCount: 45,
  mockOrdersCount: 120,
  mockCustomersCount: 80,
  simulatedWebhookLatencyMs: 80,
  simulatedErrorRatePercent: 0,
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SANDBOX_STATE,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'reset_seed_data') {
      SANDBOX_STATE.mockProductsCount = 45;
      SANDBOX_STATE.mockOrdersCount = 120;
      SANDBOX_STATE.mockCustomersCount = 80;
    }

    return NextResponse.json({
      success: true,
      data: SANDBOX_STATE,
      message: 'Sandbox mock data reset to initial baseline!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

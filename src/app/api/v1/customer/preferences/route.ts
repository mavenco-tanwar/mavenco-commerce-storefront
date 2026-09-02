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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      emailMarketing: true,
      smsMarketing: true,
      whatsappMarketing: false,
      lastUpdated: new Date().toISOString(),
    },
  }, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      data: {
        ...body,
        lastUpdated: new Date().toISOString(),
      },
      message: 'Marketing preferences saved successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

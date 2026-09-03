import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const rules = PimService.getMerchandisingRules(tenantSlug);
    return NextResponse.json({ success: true, data: rules }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newRule = {
      id: body.id || `merch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      name: body.name || 'Merchandising Boost Rule',
      query: body.query,
      category: body.category,
      action: body.action || 'boost',
      targetProductId: body.targetProductId,
      targetProductName: body.targetProductName,
      pinPosition: body.pinPosition,
      boostMultiplier: body.boostMultiplier || 1.5,
      market: body.market,
      channel: body.channel,
      schedule: body.schedule,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
    };

    const saved = PimService.upsertMerchandisingRule(tenantSlug, newRule as any);
    return NextResponse.json({ success: true, data: saved, message: 'Merchandising rule saved' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const { searchParams } = new URL(req.url);
    const ruleId = searchParams.get('id');

    const rules = PimService.getMerchandisingRules(tenantSlug);
    const idx = rules.findIndex((r) => r.id === ruleId);
    if (idx >= 0) {
      rules.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Rule removed' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

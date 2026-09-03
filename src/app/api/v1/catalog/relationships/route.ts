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

const relationsStore: Map<string, any[]> = new Map();

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    PimService.initTenantStore(tenantSlug);
    let rels = relationsStore.get(tenantSlug);
    if (!rels) {
      rels = [
        {
          id: 'rel_1',
          sourceProductId: 'prod-01',
          targetProductId: 'prod-02',
          type: 'cross_sell',
          sourceType: 'manual',
          score: 0.95,
          sortOrder: 1,
        },
        {
          id: 'rel_2',
          sourceProductId: 'prod-01',
          targetProductId: 'prod-03',
          type: 'upsell',
          sourceType: 'AI_suggested',
          score: 0.88,
          sortOrder: 2,
        },
      ];
      relationsStore.set(tenantSlug, rels);
    }

    if (productId) {
      rels = rels.filter((r) => r.sourceProductId === productId || r.targetProductId === productId);
    }

    return NextResponse.json({ success: true, data: rels }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newRel = {
      id: body.id || `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sourceProductId: body.sourceProductId,
      targetProductId: body.targetProductId,
      type: body.type || 'related',
      sourceType: body.sourceType || 'manual',
      score: body.score || 1.0,
      sortOrder: body.sortOrder || 1,
    };

    const list = relationsStore.get(tenantSlug) || [];
    list.push(newRel);
    relationsStore.set(tenantSlug, list);

    return NextResponse.json({ success: true, data: newRel, message: 'Product relationship configured' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

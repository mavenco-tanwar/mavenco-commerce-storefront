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

let REPORTS = [
  {
    id: 'rec_inv_01',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_netsuite_01',
    category: 'inventory',
    totalChecked: 1420,
    matchedCount: 1418,
    discrepancyCount: 2,
    missingInternalCount: 0,
    missingExternalCount: 0,
    status: 'action_required',
    lastRunAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'rec_fin_01',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_quickbooks_01',
    category: 'financial_ledger',
    totalChecked: 520,
    matchedCount: 520,
    discrepancyCount: 0,
    missingInternalCount: 0,
    missingExternalCount: 0,
    status: 'balanced',
    lastRunAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'rec_ord_01',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_shipstation_01',
    category: 'orders',
    totalChecked: 890,
    matchedCount: 890,
    discrepancyCount: 0,
    missingInternalCount: 0,
    missingExternalCount: 0,
    status: 'balanced',
    lastRunAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: REPORTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, integrationId } = body;

    const rep = {
      id: `rec_${Date.now()}`,
      tenantId: 'tenant_lumina',
      integrationId: integrationId || 'inst_netsuite_01',
      category: category || 'inventory',
      totalChecked: 1450,
      matchedCount: 1450,
      discrepancyCount: 0,
      missingInternalCount: 0,
      missingExternalCount: 0,
      status: 'balanced',
      lastRunAt: new Date().toISOString(),
    };

    REPORTS.unshift(rep);

    return NextResponse.json({
      success: true,
      data: rep,
      message: `Reconciliation audit completed for '${category}'! Zero balance deviations detected.`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

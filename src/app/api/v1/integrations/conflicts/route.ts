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

let CONFLICTS = [
  {
    id: 'cnf_01',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_netsuite_01',
    entityType: 'inventory',
    internalId: 'SKU-DR-SILK-01',
    externalId: 'NS-ITEM-4912',
    conflictField: 'available_stock',
    internalValue: '18 units',
    externalValue: '24 units',
    strategy: 'manual',
    status: 'pending',
    detectedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'cnf_02',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_quickbooks_01',
    entityType: 'customers',
    internalId: 'usr_88194',
    externalId: 'QBO-CUST-99',
    conflictField: 'billing_address_zip',
    internalValue: '10021',
    externalValue: '10022',
    strategy: 'internal_wins',
    status: 'resolved',
    detectedAt: new Date(Date.now() - 86400000).toISOString(),
    resolvedAt: new Date(Date.now() - 82800000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: CONFLICTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, resolutionAction } = body;
    const cnf = CONFLICTS.find((c) => c.id === id);
    if (cnf) {
      cnf.status = 'resolved';
      cnf.resolvedAt = new Date().toISOString();
      if (resolutionAction) {
        cnf.strategy = resolutionAction;
      }
    }

    return NextResponse.json({
      success: true,
      data: cnf,
      message: `Conflict resolved successfully applying '${resolutionAction || 'internal_wins'}'!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

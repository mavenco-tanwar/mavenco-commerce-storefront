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

let SYNC_JOBS = [
  {
    id: 'job_sync_981',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_netsuite_01',
    integrationName: 'Oracle NetSuite Global ERP',
    direction: 'bidirectional',
    entityType: 'inventory',
    mode: 'incremental',
    status: 'completed',
    processedCount: 450,
    successCount: 450,
    failedCount: 0,
    cursor: 'ckpt_v2_994821',
    startedAt: new Date(Date.now() - 300000).toISOString(),
    completedAt: new Date(Date.now() - 290000).toISOString(),
    durationMs: 9800,
  },
  {
    id: 'job_sync_980',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_shipstation_01',
    integrationName: 'ShipStation 3PL Logistics Hub',
    direction: 'outbound',
    entityType: 'orders',
    mode: 'event_driven',
    status: 'completed',
    processedCount: 28,
    successCount: 28,
    failedCount: 0,
    cursor: 'event_wh_44102',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date(Date.now() - 598000).toISOString(),
    durationMs: 2100,
  },
  {
    id: 'job_sync_979',
    tenantId: 'tenant_lumina',
    integrationId: 'inst_quickbooks_01',
    integrationName: 'QuickBooks Online Sales Ledger',
    direction: 'outbound',
    entityType: 'financials',
    mode: 'full',
    status: 'completed',
    processedCount: 142,
    successCount: 142,
    failedCount: 0,
    cursor: 'gl_period_2026_08',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3582000).toISOString(),
    durationMs: 18000,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SYNC_JOBS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { integrationId, entityType, mode, direction } = body;

    const newJob = {
      id: `job_sync_${Date.now()}`,
      tenantId: 'tenant_lumina',
      integrationId: integrationId || 'inst_netsuite_01',
      integrationName: 'Oracle NetSuite Global ERP',
      direction: direction || 'bidirectional',
      entityType: entityType || 'inventory',
      mode: mode || 'incremental',
      status: 'completed',
      processedCount: Math.floor(Math.random() * 100) + 20,
      successCount: Math.floor(Math.random() * 100) + 20,
      failedCount: 0,
      cursor: `ckpt_manual_${Date.now()}`,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Math.floor(Math.random() * 3000) + 1200,
    };

    SYNC_JOBS.unshift(newJob);

    return NextResponse.json({
      success: true,
      data: newJob,
      message: `Sync execution triggered for '${entityType}' in ${mode} mode!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

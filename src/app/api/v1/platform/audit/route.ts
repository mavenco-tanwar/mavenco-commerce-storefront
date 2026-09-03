import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const AUDIT_RECORDS = [
  {
    id: 'aud_99120',
    actorId: 'usr_superadmin_01',
    actorName: 'Alexander Wright (Platform Owner)',
    actorType: 'platform_admin',
    tenantId: 'lumina',
    action: 'impersonation.started',
    targetType: 'tenant_user',
    targetId: 'usr_lumina_admin',
    reason: 'Investigating checkout gateway callback timeout for order #ORD-9912',
    ipAddress: '198.51.100.24',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'aud_99119',
    actorId: 'usr_superadmin_01',
    actorName: 'Alexander Wright (Platform Owner)',
    actorType: 'platform_admin',
    tenantId: 'aurora',
    action: 'tenant.provisioned',
    targetType: 'tenant',
    targetId: 'aurora',
    reason: 'New enterprise organization onboarding',
    ipAddress: '198.51.100.24',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'aud_99118',
    actorId: 'sys_cron_worker',
    actorName: 'Platform Financial Cron Engine',
    actorType: 'system_job',
    tenantId: 'lumina',
    action: 'financial_ledger.reconciled',
    targetType: 'financial_ledger',
    targetId: 'ledger_batch_2026_0901',
    reason: 'Automated daily settlement balancing',
    ipAddress: '10.0.4.12',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'aud_99117',
    actorId: 'usr_ops_02',
    actorName: 'Sarah Jenkins (Security Admin)',
    actorType: 'platform_admin',
    tenantId: 'vanguard',
    action: 'tenant.suspended',
    targetType: 'tenant',
    targetId: 'vanguard',
    reason: 'Subscription invoice past due grace period expired',
    ipAddress: '198.51.100.52',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: AUDIT_RECORDS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

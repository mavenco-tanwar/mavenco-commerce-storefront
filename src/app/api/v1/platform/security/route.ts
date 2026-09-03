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

const SECURITY_EVENTS = [
  {
    id: 'sec_001',
    eventType: 'impersonation_started',
    severity: 'warning',
    actorEmail: 'alexander@platform.com',
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'Support session started for tenant Lumina (Target: admin@luminaluxury.com)',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'sec_002',
    eventType: 'login_success',
    severity: 'info',
    actorEmail: 'alexander@platform.com',
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'MFA Passkey validation succeeded. Superadmin session token issued.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'sec_003',
    eventType: 'secret_rotated',
    severity: 'info',
    actorEmail: 'system_auto_rotation',
    ipAddress: '10.0.0.1',
    details: 'AWS ACM Certificate Key pair rotated according to 90-day compliance cycle.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SECURITY_EVENTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

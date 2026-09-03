import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let ACTIVE_SESSIONS: any[] = [
  {
    id: 'imp_sess_9021',
    platformUserId: 'usr_superadmin_01',
    platformUserName: 'Alexander Wright (Platform Owner)',
    tenantId: 'lumina',
    tenantName: 'Lumina Luxury Group',
    targetUserId: 'usr_lumina_admin',
    targetUserEmail: 'admin@luminaluxury.com',
    reason: 'Investigating checkout gateway callback timeout for order #ORD-9912',
    status: 'active',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 min expiration
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: ACTIVE_SESSIONS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, tenantId, tenantName, targetUserEmail, reason } = body;

    if (action === 'end') {
      ACTIVE_SESSIONS = ACTIVE_SESSIONS.filter((s) => s.id !== body.sessionId);
      return NextResponse.json({
        success: true,
        message: 'Impersonation session terminated successfully.',
      }, { headers: corsHeaders() });
    }

    const newSession = {
      id: `imp_sess_${Date.now()}`,
      platformUserId: 'usr_superadmin_01',
      platformUserName: 'Alexander Wright (Platform Owner)',
      tenantId: tenantId || 'lumina',
      tenantName: tenantName || 'Lumina Luxury Group',
      targetUserId: `usr_${tenantId}_admin`,
      targetUserEmail: targetUserEmail || `admin@${tenantId}.com`,
      reason: reason || 'Support diagnostic session',
      status: 'active',
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 min window
    };

    ACTIVE_SESSIONS.unshift(newSession);

    return NextResponse.json({
      success: true,
      data: newSession,
      message: `Support impersonation started for ${newSession.tenantName} (${newSession.targetUserEmail}). Active banner engaged.`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

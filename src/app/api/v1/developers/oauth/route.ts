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

let OAUTH_APPS = [
  {
    id: 'app_oauth_01',
    name: 'ShipStation Fulfillment Orchestrator',
    clientId: 'cli_shipstation_8849',
    clientSecretPreview: 'sec_live_99f2...8b1c',
    redirectUris: ['https://shipstation.com/oauth/callback', 'https://staging.shipstation.com/oauth/callback'],
    allowedScopes: ['orders:read', 'orders:write', 'shipping:read', 'inventory:read'],
    activeInstallations: 42,
    status: 'published',
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
  },
  {
    id: 'app_oauth_02',
    name: 'QuickBooks Online Financial Sync',
    clientId: 'cli_quickbooks_1290',
    clientSecretPreview: 'sec_live_33a1...44ff',
    redirectUris: ['https://app.quickbooks.intuit.com/oauth/v2/mavenco'],
    allowedScopes: ['orders:read', 'payments:read', 'invoices:read', 'taxes:read'],
    activeInstallations: 28,
    status: 'published',
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: OAUTH_APPS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = `cli_${Math.random().toString(36).substring(2, 8)}_${Math.random().toString(36).substring(2, 8)}`;
    const rawSecret = `sec_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;

    const newApp = {
      id: `app_${Date.now()}`,
      name: body.name || 'Custom OAuth App',
      clientId,
      clientSecretPreview: `${rawSecret.substring(0, 12)}...${rawSecret.substring(rawSecret.length - 4)}`,
      redirectUris: body.redirectUris || ['https://myapp.com/oauth/callback'],
      allowedScopes: body.allowedScopes || ['products:read', 'orders:read'],
      activeInstallations: 1,
      status: 'development',
      createdAt: new Date().toISOString(),
    };

    OAUTH_APPS.unshift(newApp);

    return NextResponse.json({
      success: true,
      data: {
        appRecord: newApp,
        rawClientSecretToShowOnce: rawSecret,
      },
      message: 'OAuth 2.0 Application registered successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

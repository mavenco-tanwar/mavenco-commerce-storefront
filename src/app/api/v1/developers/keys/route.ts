import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let API_KEYS = [
  {
    id: 'key_prod_01',
    name: 'ERP Backend Synchronization SyncKey',
    keyPrefix: 'sk_live_9a2f',
    keyHashPreview: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    scopes: ['products:read', 'products:write', 'inventory:read', 'inventory:write', 'orders:read'],
    environment: 'production',
    status: 'active',
    lastUsedAt: new Date(Date.now() - 300000).toISOString(),
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    expiresAt: null,
  },
  {
    id: 'key_prod_02',
    name: 'Klaviyo Email Automation Webhook Token',
    keyPrefix: 'sk_live_4b8c',
    keyHashPreview: 'sha256_88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
    scopes: ['customers:read', 'orders:read', 'analytics:read'],
    environment: 'production',
    status: 'active',
    lastUsedAt: new Date(Date.now() - 1200000).toISOString(),
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
    expiresAt: null,
  },
  {
    id: 'key_test_01',
    name: 'Local Dev & QA Testing Secret',
    keyPrefix: 'sk_test_7f1e',
    keyHashPreview: 'sha256_ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    scopes: ['products:read', 'customers:read', 'orders:read'],
    environment: 'sandbox',
    status: 'active',
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    expiresAt: null,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: API_KEYS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawSecret = `sk_${body.environment === 'sandbox' ? 'test' : 'live'}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const prefix = rawSecret.substring(0, 12);

    const newKey = {
      id: `key_${Date.now()}`,
      name: body.name || 'Custom Integration Key',
      keyPrefix: prefix,
      keyHashPreview: `sha256_${Math.random().toString(16).substring(2, 66)}`,
      scopes: body.scopes || ['products:read', 'orders:read'],
      environment: body.environment || 'production',
      status: 'active',
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      expiresAt: null,
    };

    API_KEYS.unshift(newKey);

    return NextResponse.json({
      success: true,
      data: {
        keyRecord: newKey,
        rawSecretToShowOnce: rawSecret,
      },
      message: 'Cryptographic API Key generated! Store the raw token safely; it will never be displayed again.',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    const key = API_KEYS.find((k) => k.id === id);
    if (key) {
      if (action === 'revoke') key.status = 'revoked';
      if (action === 'activate') key.status = 'active';
    }

    return NextResponse.json({
      success: true,
      data: key,
      message: `API Key '${key?.name}' has been ${key?.status}!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET() {
  try {
    const stats = {
      totalApiRequests24h: 2842000,
      activeApiKeysCount: 3,
      installedAppsCount: 4,
      webhookDeliverySuccessRate: 99.8,
      p95LatencyMs: 48,
      rateLimitUsagePercent: 32.5,
      errorRatePercent: 0.04,
    };

    const logs = [
      {
        id: 'log_01',
        requestId: 'req_88a91c92f',
        method: 'GET',
        endpoint: '/api/v1/products?limit=50',
        apiVersion: 'v1',
        httpStatus: 200,
        latencyMs: 24,
        actorType: 'api_key',
        actorIdentifier: 'sk_live_9a2f...',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: 'log_02',
        requestId: 'req_33b811ef2',
        method: 'POST',
        endpoint: '/api/v1/orders',
        apiVersion: 'v1',
        httpStatus: 201,
        latencyMs: 58,
        actorType: 'oauth_app',
        actorIdentifier: 'ShipStation Sync',
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        id: 'log_03',
        requestId: 'req_77c1209aa',
        method: 'GET',
        endpoint: '/api/v1/customers?email=c.dupont%40paris.fr',
        apiVersion: 'v1',
        httpStatus: 200,
        latencyMs: 18,
        actorType: 'api_key',
        actorIdentifier: 'sk_live_4b8c...',
        timestamp: new Date(Date.now() - 360000).toISOString(),
      },
      {
        id: 'log_04',
        requestId: 'req_11a0094bb',
        method: 'PATCH',
        endpoint: '/api/v1/inventory/stock',
        apiVersion: 'v1',
        httpStatus: 200,
        latencyMs: 34,
        actorType: 'api_key',
        actorIdentifier: 'sk_live_9a2f...',
        timestamp: new Date(Date.now() - 720000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: { stats, logs },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

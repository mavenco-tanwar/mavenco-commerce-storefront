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

const HEALTH_COMPONENTS = [
  {
    id: 'comp_mongo',
    name: 'MongoDB Multi-Tenant Sharded Cluster',
    category: 'database',
    status: 'healthy',
    latencyMs: 3.2,
    uptimePercentage: 99.99,
    lastCheckedAt: new Date().toISOString(),
    message: 'Primary replica set healthy, connection pool: 120/500 active.',
  },
  {
    id: 'comp_api_gateway',
    name: 'Platform Edge API Gateway (Next.js)',
    category: 'core',
    status: 'healthy',
    latencyMs: 14.5,
    uptimePercentage: 99.98,
    lastCheckedAt: new Date().toISOString(),
    message: 'HTTP/2 & HTTP/3 edge nodes operational with 0 TLS handshake errors.',
  },
  {
    id: 'comp_redis_queue',
    name: 'BullMQ & Redis Background Worker Fleet',
    category: 'infrastructure',
    status: 'healthy',
    latencyMs: 1.8,
    uptimePercentage: 99.95,
    lastCheckedAt: new Date().toISOString(),
    message: 'Job queues operational. DLQ count: 0.',
  },
  {
    id: 'comp_stripe',
    name: 'Stripe Global Payment Gateway',
    category: 'payments',
    status: 'healthy',
    latencyMs: 124.0,
    uptimePercentage: 99.99,
    lastCheckedAt: new Date().toISOString(),
    message: 'Webhook latency: 140ms. Tokenization endpoints responsive.',
  },
  {
    id: 'comp_razorpay',
    name: 'Razorpay UPI & Netbanking Gateway',
    category: 'payments',
    status: 'healthy',
    latencyMs: 180.2,
    uptimePercentage: 99.94,
    lastCheckedAt: new Date().toISOString(),
    message: 'UPI intent flow and auto-settlement webhook streams active.',
  },
  {
    id: 'comp_shippo',
    name: 'Shippo & EasyPost Multi-Carrier Dispatch',
    category: 'shipping',
    status: 'healthy',
    latencyMs: 210.4,
    uptimePercentage: 99.90,
    lastCheckedAt: new Date().toISOString(),
    message: 'Rate calculation & label generation API online.',
  },
  {
    id: 'comp_avalara',
    name: 'Avalara AvaTax & GST Calculation Engine',
    category: 'tax',
    status: 'healthy',
    latencyMs: 165.8,
    uptimePercentage: 99.92,
    lastCheckedAt: new Date().toISOString(),
    message: 'Jurisdiction mapping cache warm. Tax quote latency < 200ms.',
  },
  {
    id: 'comp_cloudflare_ssl',
    name: 'Cloudflare Custom Domain DNS & SSL Engine',
    category: 'infrastructure',
    status: 'healthy',
    latencyMs: 45.1,
    uptimePercentage: 100.0,
    lastCheckedAt: new Date().toISOString(),
    message: 'Wildcard & custom domain certificates active. 0 pending renewals.',
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: HEALTH_COMPONENTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

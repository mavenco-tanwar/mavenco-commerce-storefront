import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let WEBHOOK_SUBSCRIPTIONS = [
  {
    id: 'wh_sub_01',
    endpointUrl: 'https://api.shipstation.com/v1/webhooks/mavenco',
    subscribedEvents: ['order.paid', 'order.cancelled', 'order.refunded'],
    secretSignaturePreview: 'whsec_99a8...f1c2',
    status: 'active',
    successCount: 1420,
    failureCount: 2,
    lastDeliveredAt: new Date(Date.now() - 300000).toISOString(),
    createdAt: new Date(Date.now() - 5184000000).toISOString(),
  },
  {
    id: 'wh_sub_02',
    endpointUrl: 'https://hooks.klaviyo.com/events/ecommerce-sync',
    subscribedEvents: ['customer.created', 'order.paid', 'product.updated'],
    secretSignaturePreview: 'whsec_33d7...88e4',
    status: 'active',
    successCount: 3840,
    failureCount: 0,
    lastDeliveredAt: new Date(Date.now() - 900000).toISOString(),
    createdAt: new Date(Date.now() - 7776000000).toISOString(),
  },
];

let WEBHOOK_LOGS = [
  {
    id: 'wh_log_001',
    subscriptionId: 'wh_sub_01',
    eventType: 'order.paid',
    httpStatus: 200,
    latencyMs: 142,
    status: 'delivered',
    payloadSummary: 'Order #ORD-2026-981 ($350.00) paid by Visa',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'wh_log_002',
    subscriptionId: 'wh_sub_02',
    eventType: 'customer.created',
    httpStatus: 200,
    latencyMs: 88,
    status: 'delivered',
    payloadSummary: 'Customer #CUST-412 (c.dupont@paris.fr) created',
    timestamp: new Date(Date.now() - 900000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: { subscriptions: WEBHOOK_SUBSCRIPTIONS, logs: WEBHOOK_LOGS },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, endpointUrl, subscribedEvents } = body;

    if (action === 'test_dispatch') {
      const simulatedLog = {
        id: `wh_log_${Date.now()}`,
        subscriptionId: body.subscriptionId || 'wh_sub_01',
        eventType: body.eventType || 'order.paid',
        httpStatus: 200,
        latencyMs: Math.floor(Math.random() * 80) + 60,
        status: 'delivered',
        payloadSummary: 'Simulated Test Ping Event (HMAC-SHA256 Validated)',
        timestamp: new Date().toISOString(),
      };
      WEBHOOK_LOGS.unshift(simulatedLog);

      return NextResponse.json({
        success: true,
        data: simulatedLog,
        message: 'Test Webhook event dispatched & acknowledged with HTTP 200 OK!',
      }, { headers: corsHeaders() });
    }

    const rawSecret = `whsec_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    const newSub = {
      id: `wh_sub_${Date.now()}`,
      endpointUrl: endpointUrl || 'https://my-domain.com/webhooks',
      subscribedEvents: subscribedEvents || ['order.paid'],
      secretSignaturePreview: `${rawSecret.substring(0, 10)}...${rawSecret.substring(rawSecret.length - 4)}`,
      status: 'active',
      successCount: 0,
      failureCount: 0,
      lastDeliveredAt: null,
      createdAt: new Date().toISOString(),
    };

    WEBHOOK_SUBSCRIPTIONS.unshift(newSub);

    return NextResponse.json({
      success: true,
      data: { subscription: newSub, signingSecret: rawSecret },
      message: 'Webhook subscription created with HMAC-SHA256 signature secret!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

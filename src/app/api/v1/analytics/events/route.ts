import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = req.headers.get('x-tenant-slug') || body.tenantId || 'lumina';
    const db = await getDatabase();

    const eventRecord = {
      id: body.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      eventName: body.eventName || 'PageViewed',
      eventVersion: body.eventVersion || 1,
      tenantId: tenantSlug,
      storeId: body.storeId || 'default',
      channelId: body.channelId || 'web',
      sessionId: body.sessionId || `sess_${Date.now()}`,
      customerId: body.customerId,
      productId: body.productId,
      orderId: body.orderId,
      valueMinor: body.valueMinor || 0,
      currency: body.currency || 'USD',
      metadata: body.metadata || {},
      timestamp: new Date().toISOString(),
    };

    if (db) {
      await db.collection('analytics_events').insertOne(eventRecord);
    }

    return NextResponse.json({
      success: true,
      data: { eventId: eventRecord.id, receivedAt: eventRecord.timestamp },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

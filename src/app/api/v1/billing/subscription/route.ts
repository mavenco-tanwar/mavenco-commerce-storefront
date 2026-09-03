import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

const DEFAULT_SUBSCRIPTION = {
  id: 'sub_active_growth_001',
  tenantId: 'lumina',
  billingAccountId: 'bac_lumina_001',
  planId: 'plan_growth',
  planName: 'Growth Commerce Tier',
  status: 'active',
  billingInterval: 'monthly',
  currentPeriodStart: new Date(Date.now() - 86400000 * 15).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 86400000 * 15).toISOString(),
  cancelAtPeriodEnd: false,
  currency: 'USD',
  amountMinor: 29900, // $299.00 / mo
  createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let subscription = DEFAULT_SUBSCRIPTION;

    if (db) {
      const collection = db.collection('subscriptions');
      const doc = await collection.findOne({ tenantId: tenantSlug });
      if (!doc) {
        await collection.insertOne({ ...DEFAULT_SUBSCRIPTION, tenantId: tenantSlug });
      } else {
        const { _id, ...rest } = doc;
        subscription = rest as any;
      }
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const updateData = {
      planId: body.planId || 'plan_scale',
      planName: body.planName || 'Scale Enterprise Tier',
      billingInterval: body.billingInterval || 'monthly',
      amountMinor: body.amountMinor || 79900,
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      await db.collection('subscriptions').updateOne(
        { tenantId: tenantSlug },
        { $set: updateData },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Plan upgraded successfully to ${updateData.planName}!`,
      data: updateData,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

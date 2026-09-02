import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl_order_confirmed',
    tenantId: 'lumina',
    name: 'Order Confirmation & Bespoke Receipt',
    event: 'order.created',
    category: 'ORDER',
    channels: ['email', 'whatsapp', 'in_app'],
    subject: 'Order Confirmed: {{order.number}} - Lumina Haute Couture',
    emailHtml: '<h2>Thank you, {{customer.firstName}}</h2><p>Your order #{{order.number}} of ${{order.total}} is now being tailored with utmost care.</p>',
    smsBody: 'Lumina: Your order #{{order.number}} of ${{order.total}} is confirmed and being crafted. Track at: {{tracking.url}}',
    whatsappTemplateName: 'lumina_order_confirmed_v2',
    pushTitle: 'Order Confirmed! 💎',
    pushBody: 'Your order #{{order.number}} has been received by our master atelier.',
    inAppTitle: 'Order #{{order.number}} Confirmed',
    inAppBody: 'Your order of ${{order.total}} is confirmed and processing.',
    variables: ['customer.firstName', 'order.number', 'order.total', 'tracking.url'],
    status: 'published',
    version: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl_shipment_dispatched',
    tenantId: 'lumina',
    name: 'Shipment Dispatched & Courier Tracking',
    event: 'fulfillment.shipped',
    category: 'SHIPPING',
    channels: ['email', 'sms', 'whatsapp', 'push', 'in_app'],
    subject: 'Your Bespoke Garment Has Dispatched: {{order.number}}',
    smsBody: 'Lumina: Order #{{order.number}} has dispatched with tracking code {{tracking.code}}. Expected delivery: 2-3 business days.',
    whatsappTemplateName: 'lumina_order_shipped_v1',
    pushTitle: 'Your Package is on the Way! 🚚',
    pushBody: 'Track your shipment with courier tracking code {{tracking.code}}.',
    inAppTitle: 'Order #{{order.number}} Shipped',
    inAppBody: 'Dispatched via {{carrier.name}} with tracking {{tracking.code}}.',
    variables: ['customer.firstName', 'order.number', 'tracking.code', 'carrier.name'],
    status: 'published',
    version: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tmpl_abandoned_cart',
    tenantId: 'lumina',
    name: 'Abandoned Cart 1h Recovery + Voucher',
    event: 'cart.abandoned',
    category: 'CART',
    channels: ['email', 'whatsapp'],
    subject: 'Your luxury selections are waiting for you, {{customer.firstName}}',
    emailHtml: '<p>You left items in your shopping bag. Complete your purchase now and enjoy 10% off with code RECOVER10.</p>',
    smsBody: 'Lumina: Return to your shopping bag to finish your bespoke order. Use code RECOVER10: {{cart.url}}',
    whatsappTemplateName: 'lumina_cart_recovery_v1',
    variables: ['customer.firstName', 'cart.url', 'coupon.code'],
    status: 'published',
    version: 1,
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('notification_templates');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_TEMPLATES.map((t) => ({ ...t, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      const clean = docs.map(({ _id, ...rest }) => rest);
      return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_TEMPLATES }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newTemplate = {
      ...body,
      id: body.id || `tmpl_${Date.now()}`,
      tenantId: tenantSlug,
      version: 1,
      status: 'published',
      updatedAt: now,
    };

    if (db) {
      await db.collection('notification_templates').insertOne(newTemplate);
    }

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

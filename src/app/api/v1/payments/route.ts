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

const DEFAULT_PAYMENTS = [
  {
    id: 'pay_100234',
    tenantId: 'lumina',
    orderId: 'ord_100234',
    orderNumber: 'LUM-100234',
    customerId: 'cust_aanya',
    customerName: 'Aanya Kapoor',
    currency: 'USD',
    amountMinor: 50000, // $500.00
    status: 'captured',
    paymentMethodType: 'card',
    provider: 'razorpay',
    providerPaymentId: 'pay_rzp_8839201',
    description: 'Bespoke Handwoven Kanjivaram Silk Saree',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pay_100189',
    tenantId: 'lumina',
    orderId: 'ord_100189',
    orderNumber: 'LUM-100189',
    customerId: 'cust_priya',
    customerName: 'Priya Sharma',
    currency: 'USD',
    amountMinor: 15000, // $150.00
    status: 'refunded',
    paymentMethodType: 'upi',
    provider: 'razorpay',
    providerPaymentId: 'pay_rzp_7749202',
    description: 'Pure Georgette Embroidered Kurta Set',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const orderId = searchParams.get('orderId');

    const db = await getDatabase();
    let payments = DEFAULT_PAYMENTS;

    if (db) {
      const collection = db.collection('payments');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_PAYMENTS.map((p) => ({ ...p, tenantId: tenantSlug })));
      }
      const query: any = { tenantId: tenantSlug };
      if (orderId) query.orderId = orderId;
      const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();
      payments = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      payments = payments.filter((p) => p.tenantId === tenantSlug);
      if (orderId) payments = payments.filter((p) => p.orderId === orderId);
    }

    return NextResponse.json({
      success: true,
      data: payments,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

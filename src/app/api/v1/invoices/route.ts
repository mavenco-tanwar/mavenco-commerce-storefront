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

const DEFAULT_INVOICES = [
  {
    id: 'inv_100234',
    tenantId: 'lumina',
    orderId: 'ord_100234',
    orderNumber: 'LUM-100234',
    documentNumber: 'INV-2026-000234',
    status: 'paid',
    issueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    currency: 'USD',
    sellerSnapshot: {
      businessName: 'Lumina Haute Couture',
      legalName: 'Lumina Haute Couture Private Limited',
      gstinOrVat: '27AAACL8892P1Z4',
      address: '702 Altamount Luxury Tower, Mumbai, Maharashtra 400026',
      email: 'concierge@lumina-couture.com',
      phone: '+91 22 4910 8800',
    },
    customerSnapshot: {
      customerName: 'Aanya Kapoor',
      email: 'aanya.kapoor@example.com',
      phone: '+91 98200 11223',
      taxIdOrGstin: '27AABCK9901M1Z2',
      billingAddress: 'Bespoke Villa 4, Nariman Point, Mumbai 400021',
      shippingAddress: 'Bespoke Villa 4, Nariman Point, Mumbai 400021',
    },
    lineItems: [
      {
        productId: 'prod_silk_saree_1',
        title: 'Bespoke Handwoven Kanjivaram Silk Saree',
        sku: 'LUM-KANJ-001',
        hsnCode: 'HSN-5007',
        quantity: 1,
        unitPriceMinor: 50000, // $500.00
        taxableAmountMinor: 41000,
        taxAmountMinor: 9000, // 18%
        totalMinor: 50000,
      },
    ],
    subtotalMinor: 50000,
    discountMinor: 0,
    shippingMinor: 0,
    taxMinor: 9000,
    totalMinor: 50000,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Razorpay/Stripe)',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const orderId = searchParams.get('orderId');

    const db = await getDatabase();
    let invoices = DEFAULT_INVOICES;

    if (db) {
      const collection = db.collection('invoices');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_INVOICES.map((i) => ({ ...i, tenantId: tenantSlug })));
      }
      const query: any = { tenantId: tenantSlug };
      if (orderId) query.orderId = orderId;
      const docs = await collection.find(query).sort({ issueDate: -1 }).toArray();
      invoices = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      invoices = invoices.filter((i) => i.tenantId === tenantSlug);
      if (orderId) invoices = invoices.filter((i) => i.orderId === orderId);
    }

    return NextResponse.json({
      success: true,
      data: invoices,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

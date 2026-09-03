import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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

const DEFAULT_INVOICES = [
  {
    id: 'binv_2026_0901',
    tenantId: 'lumina',
    billingAccountId: 'bac_lumina_001',
    subscriptionId: 'sub_active_growth_001',
    invoiceNumber: 'SAAS-INV-2026-0091',
    status: 'paid',
    currency: 'USD',
    subtotalMinor: 29900,
    discountMinor: 0,
    taxMinor: 0,
    totalMinor: 29900,
    amountPaidMinor: 29900,
    periodStart: '2026-09-01T00:00:00.000Z',
    periodEnd: '2026-09-30T23:59:59.999Z',
    dueAt: '2026-09-01T00:00:00.000Z',
    paidAt: '2026-09-01T00:05:12.000Z',
    downloadUrl: '/api/v1/billing/invoices/SAAS-INV-2026-0091.pdf',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'binv_2026_0801',
    tenantId: 'lumina',
    billingAccountId: 'bac_lumina_001',
    subscriptionId: 'sub_active_growth_001',
    invoiceNumber: 'SAAS-INV-2026-0082',
    status: 'paid',
    currency: 'USD',
    subtotalMinor: 29900,
    discountMinor: 0,
    taxMinor: 0,
    totalMinor: 29900,
    amountPaidMinor: 29900,
    periodStart: '2026-08-01T00:00:00.000Z',
    periodEnd: '2026-08-31T23:59:59.999Z',
    dueAt: '2026-08-01T00:00:00.000Z',
    paidAt: '2026-08-01T00:04:45.000Z',
    downloadUrl: '/api/v1/billing/invoices/SAAS-INV-2026-0082.pdf',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let invoices = DEFAULT_INVOICES;

    if (db) {
      const collection = db.collection('billing_invoices');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_INVOICES.map((i) => ({ ...i, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: -1 }).toArray();
      invoices = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      invoices = invoices.filter((i) => i.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: invoices,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

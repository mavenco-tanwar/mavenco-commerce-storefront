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

const DEFAULT_CREDIT_NOTES = [
  {
    id: 'cn_88210',
    tenantId: 'lumina',
    invoiceId: 'inv_100189',
    invoiceNumber: 'INV-2026-000189',
    orderId: 'ord_100189',
    documentNumber: 'CN-2026-000088',
    status: 'issued',
    issueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    reason: 'partial_return',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    refundAmountMinor: 15000, // $150.00
    taxRefundMinor: 2700, // $27.00
    currency: 'USD',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let creditNotes = DEFAULT_CREDIT_NOTES;

    if (db) {
      const collection = db.collection('credit_notes');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_CREDIT_NOTES.map((c) => ({ ...c, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ issueDate: -1 }).toArray();
      creditNotes = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      creditNotes = creditNotes.filter((c) => c.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: creditNotes,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

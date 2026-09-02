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

const DEFAULT_TEMPLATES = [
  {
    id: 'dt_luxury_invoice_v1',
    tenantId: 'lumina',
    documentType: 'invoice',
    name: 'Bespoke Haute Couture Tax Invoice',
    version: 1,
    status: 'published',
    headerNote: 'Official Tax Invoice under Section 31 of the CGST Act, 2017.',
    footerTerms: 'All luxury items are handcrafted bespoke. Exchanges accepted within 14 days with tamper-proof security tags intact.',
    showGstBreakdown: true,
    showHsnCode: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dt_credit_note_v1',
    tenantId: 'lumina',
    documentType: 'credit_note',
    name: 'Standard Return Credit Note',
    version: 1,
    status: 'published',
    headerNote: 'Official Credit Note for Return & Tax Reversal.',
    footerTerms: 'Refund credited to original payment tender or client store credit wallet.',
    showGstBreakdown: true,
    showHsnCode: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let templates = DEFAULT_TEMPLATES;

    if (db) {
      const collection = db.collection('document_templates');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_TEMPLATES.map((t) => ({ ...t, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).toArray();
      templates = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      templates = templates.filter((t) => t.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: templates,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

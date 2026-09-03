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

let CONTENT_DRAFTS = [
  {
    id: 'draft_001',
    productTitle: 'Midnight Silk Evening Gown',
    productSku: 'LUM-DR-001',
    field: 'description',
    originalValue: 'Black silk dress with long sleeves.',
    generatedValue: 'Crafted from 100% pure Mulberry silk, this Midnight Silk Evening Gown exudes understated luxury. Designed with a tailored drape and concealed back zip, it offers a sculpted silhouette perfect for gala evenings.',
    model: 'Claude 3.5 Sonnet',
    status: 'draft',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'draft_002',
    productTitle: 'Royal Heritage Chronograph 41mm',
    productSku: 'ELY-WT-002',
    field: 'seo_title',
    originalValue: 'Watch 41mm Chronograph',
    generatedValue: 'Royal Heritage Chronograph 41mm | Swiss Automatic Luxury Timepiece | Lumina',
    model: 'Claude 3.5 Sonnet',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: CONTENT_DRAFTS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDraft = {
      id: `draft_${Date.now()}`,
      productTitle: body.productTitle || 'Custom Product',
      productSku: body.productSku || 'SKU-001',
      field: body.field || 'description',
      originalValue: body.originalValue || '',
      generatedValue: body.generatedValue || `Elevated luxury statement crafted with premium materials and signature craftsmanship. Engineered for enduring comfort and contemporary elegance.`,
      model: 'Claude 3.5 Sonnet',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    CONTENT_DRAFTS.unshift(newDraft);

    return NextResponse.json({
      success: true,
      data: newDraft,
      message: 'AI Copy generated and queued for approval!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    const draft = CONTENT_DRAFTS.find((d) => d.id === id);
    if (draft) {
      if (status) draft.status = status;
    }
    return NextResponse.json({
      success: true,
      data: draft,
      message: `Draft status updated to '${status}'!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

import { NextRequest, NextResponse } from 'next/server';

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

let ASSISTANT_CONFIG = {
  id: 'ast_001',
  assistantName: 'Lumina Luxury Concierge',
  tone: 'luxury_concierge',
  welcomeMessage: 'Welcome to Lumina. How may I assist you with our curated collections or personal styling today?',
  knowledgeSources: ['Published Catalog', 'Return Policies', 'Shipping Rates', 'Size Guides'],
  maxTokensPerReply: 500,
  supportHandoffEnabled: true,
  status: 'active',
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: ASSISTANT_CONFIG,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || 'Hello';

    // Simulated RAG retrieval response grounded in product facts
    let responseText = `I would be delighted to assist you. Our catalog features handcrafted luxury apparel, certified Swiss timepieces, and botanical skincare.`;
    if (query.toLowerCase().includes('silk') || query.toLowerCase().includes('gown')) {
      responseText = `Our Midnight Silk Evening Gown is in stock ($350.00) crafted from 100% pure Mulberry silk. We offer complimentary express shipping and 30-day returns.`;
    } else if (query.toLowerCase().includes('shipping') || query.toLowerCase().includes('return')) {
      responseText = `We provide complimentary express delivery on orders over $150. Returns are accepted within 30 days of receipt in original packaging.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: responseText,
        citations: ['Lumina Shipping Policy v2.1', 'Catalog: LUM-DR-001'],
        tokensUsed: 84,
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

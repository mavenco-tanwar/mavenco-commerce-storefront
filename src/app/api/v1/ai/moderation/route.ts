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

let MODERATION_ITEMS = [
  {
    id: 'mod_001',
    entityType: 'review',
    authorName: 'Camilla D.',
    contentSnippet: 'Exquisite silk drape and incredible finish. Arrived in 2 days beautifully packaged!',
    flaggedCategories: [],
    safetyScore: 0.99,
    decision: 'auto_approved',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'mod_002',
    entityType: 'ugc_comment',
    authorName: 'Anonymous_99',
    contentSnippet: 'Check this link for 90% discount on watches: http://spam-links.xyz/deal',
    flaggedCategories: ['Spam / Unsolicited Links', 'Phishing Attempt'],
    safetyScore: 0.12,
    decision: 'rejected',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'mod_003',
    entityType: 'product_qna',
    authorName: 'David L.',
    contentSnippet: 'Is the watch water resistant up to 100m for diving or only rain?',
    flaggedCategories: [],
    safetyScore: 0.96,
    decision: 'pending_human_review',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: MODERATION_ITEMS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, decision } = body;
    const item = MODERATION_ITEMS.find((m) => m.id === id);
    if (item) {
      if (decision) item.decision = decision;
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: `Moderation decision updated to '${decision}'!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

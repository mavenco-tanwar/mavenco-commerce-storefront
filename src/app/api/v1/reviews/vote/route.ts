import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewId, type = 'helpful' } = body;

    const db = await getDatabase();
    if (db) {
      const field = type === 'report' ? 'reportCount' : 'helpfulCount';
      await db.collection('product_reviews').updateOne(
        { id: reviewId },
        { $inc: { [field]: 1 } }
      );
    }

    return NextResponse.json({
      success: true,
      message: type === 'report' ? 'Review reported for moderation review' : 'Helpful vote recorded!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

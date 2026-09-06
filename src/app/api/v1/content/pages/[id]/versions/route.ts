import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Store-ID, X-API-Key',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503, headers: corsHeaders() });
    }

    const versions = await db
      .collection('cms_page_versions')
      .find({
        $or: [{ pageId: id }, { slug: id }],
      })
      .sort({ version: -1 })
      .limit(30)
      .toArray();

    const clean = versions.map((v) => {
      const { _id, ...rest } = v;
      return rest;
    });

    return NextResponse.json(
      { data: clean, status: 'success' },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

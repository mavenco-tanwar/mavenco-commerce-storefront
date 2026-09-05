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

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const rawSlug = resolvedParams?.slug;
    const slug = decodeURIComponent(rawSlug || '').trim();
    const db = await getDatabase();
    if (db) {
      const col = await db.collection('collections').findOne({
        $or: [{ slug }, { id: slug }],
      });
      if (col) {
        const { _id, ...clean } = col;
        return NextResponse.json({ success: true, data: clean }, { headers: corsHeaders() });
      }
    }
    return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404, headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

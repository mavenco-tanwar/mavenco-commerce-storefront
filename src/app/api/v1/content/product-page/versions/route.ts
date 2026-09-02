import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const templateId = searchParams.get('template') || 'default_fashion';

    const db = await getDatabase();
    if (db) {
      const versions = await db
        .collection('product_page_versions')
        .find({ tenantSlug: tenant, templateId: templateId })
        .sort({ publishedAt: -1 })
        .limit(20)
        .toArray();

      return NextResponse.json({
        success: true,
        data: versions,
      });
    }

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error: any) {
    console.error('Failed to fetch PDP versions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

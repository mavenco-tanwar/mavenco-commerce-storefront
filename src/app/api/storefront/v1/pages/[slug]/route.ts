import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const context = TenantDatabaseResolver.resolveContext(req);
    const db = await TenantDatabaseResolver.getTenantDatabase(context.tenantId);

    if (db) {
      const pageDoc = await db.collection('cms_pages').findOne({
        slug,
        status: 'published',
      });

      if (pageDoc) {
        const { _id, ...cleanPage } = pageDoc;
        return NextResponse.json({
          success: true,
          data: cleanPage,
          source: 'mongodb',
        });
      }
    }

    // Zero fallback rule: If not in database, return 404 not found
    return NextResponse.json(
      {
        success: false,
        error: `Page '${slug}' was not found in published database records for tenant '${context.tenantId}'.`,
      },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

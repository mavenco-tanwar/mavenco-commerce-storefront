import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = slug.replace(/^\//, '').toLowerCase().trim();
    const slugMatches = [
      cleanSlug,
      `/${cleanSlug}`,
      slug,
    ];

    const context = TenantDatabaseResolver.resolveContext(req);

    // 1. Try tenant-scoped database
    const tenantDb = await TenantDatabaseResolver.getTenantDatabase(context.tenantId);
    if (tenantDb) {
      const pageDoc = await tenantDb.collection('cms_pages').findOne({
        $or: [{ slug: { $in: slugMatches } }, { id: cleanSlug }],
        status: 'published',
      });

      if (pageDoc) {
        const { _id, ...cleanPage } = pageDoc;
        return NextResponse.json({
          success: true,
          data: { id: cleanPage.id || _id.toString(), ...cleanPage },
          source: 'tenant_db',
        });
      }
    }

    // 2. Primary platform database lookup
    const primaryDb = await getDatabase();
    if (primaryDb) {
      const pageDoc = await primaryDb.collection('cms_pages').findOne({
        $and: [
          { $or: [{ slug: { $in: slugMatches } }, { id: cleanSlug }] },
          { status: 'published' },
        ],
      });

      if (pageDoc) {
        const { _id, ...cleanPage } = pageDoc;
        return NextResponse.json({
          success: true,
          data: { id: cleanPage.id || _id.toString(), ...cleanPage },
          source: 'primary_db',
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

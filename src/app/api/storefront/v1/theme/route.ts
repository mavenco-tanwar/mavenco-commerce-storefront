import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { StoreBootstrapService } from '@/server/db/store-bootstrap.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const bootstrap = await StoreBootstrapService.getBootstrapPayload(context);

    return NextResponse.json({
      success: true,
      data: bootstrap.theme,
      tenantId: context.tenantId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

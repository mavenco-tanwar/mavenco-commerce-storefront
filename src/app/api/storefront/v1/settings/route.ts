import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { StoreBootstrapService } from '@/server/db/store-bootstrap.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const bootstrap = await StoreBootstrapService.getBootstrapPayload(context);

    // Strictly returns public-safe store configuration (no credentials/secrets)
    return NextResponse.json({
      success: true,
      data: bootstrap.store,
      market: bootstrap.market,
      meta: bootstrap.meta,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

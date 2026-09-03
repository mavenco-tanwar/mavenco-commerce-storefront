import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { StoreBootstrapService } from '@/server/db/store-bootstrap.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-id, x-market-code, x-currency, x-locale',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const context = TenantDatabaseResolver.resolveContext(req);
    const bootstrapData = await StoreBootstrapService.getBootstrapPayload(context);

    return NextResponse.json(
      {
        success: true,
        data: bootstrapData,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

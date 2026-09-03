import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { BulkOperationsService } from '@/server/pim/bulk-operations.service';

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

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const { productIds, operation, payload } = body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ success: false, error: 'productIds array is required' }, { status: 400, headers: corsHeaders() });
    }

    const { products } = await PimService.getProducts(tenantSlug, { limit: 1000 });

    const job = await BulkOperationsService.executeBulkOperation({
      tenantId: tenantSlug,
      productIds,
      operation: operation || 'publish',
      payload,
      productsCatalog: products,
    });

    return NextResponse.json(
      {
        success: true,
        data: job,
        message: `Bulk operation [${operation}] completed. ${job.successCount} succeeded, ${job.failedCount} failed.`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

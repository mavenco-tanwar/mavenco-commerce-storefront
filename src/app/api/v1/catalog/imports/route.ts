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

    const { rawContent, format, mappings, isDryRun, upsertStrategy } = body;

    if (!rawContent) {
      return NextResponse.json({ success: false, error: 'rawContent is required' }, { status: 400, headers: corsHeaders() });
    }

    const { products } = await PimService.getProducts(tenantSlug, { limit: 1000 });

    const job = await BulkOperationsService.processImport({
      tenantId: tenantSlug,
      format: format || 'csv',
      rawContent,
      mappings: mappings || [
        { sourceField: 'SKU', productField: 'sku', transformation: 'uppercase' },
        { sourceField: 'Title', productField: 'title', transformation: 'trim' },
        { sourceField: 'Description', productField: 'description' },
        { sourceField: 'Category', productField: 'category', transformation: 'lowercase' },
        { sourceField: 'Material', productField: 'material' },
        { sourceField: 'Image', productField: 'image' },
      ],
      isDryRun: Boolean(isDryRun),
      upsertStrategy: upsertStrategy || 'upsert',
      catalog: products,
    });

    return NextResponse.json(
      {
        success: true,
        data: job,
        message: isDryRun ? 'Dry run simulation finished' : 'Import job executed successfully',
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

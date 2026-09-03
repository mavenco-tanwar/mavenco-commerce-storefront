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

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const { products } = await PimService.getProducts(tenantSlug, { limit: 1000 });

    if (format === 'csv') {
      const headers = ['id', 'sku', 'title', 'status', 'category', 'brand', 'material', 'price', 'completeness', 'quality'];
      const rows = products.map((p) => [
        p.id,
        p.sku,
        `"${(p.title || '').replace(/"/g, '""')}"`,
        p.status,
        p.categories?.[0] || '',
        p.brandName || '',
        p.material || '',
        (p as any).price || 1499,
        p.completeness?.totalPercent || 0,
        p.quality?.score || 0,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${tenantSlug}-catalog-export.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, count: products.length, data: products }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const { products } = await PimService.getProducts(tenantSlug, { limit: 1000 });
    const job = BulkOperationsService.generateExport(tenantSlug, products, body.filters);

    return NextResponse.json({ success: true, data: job, message: 'Export initiated successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

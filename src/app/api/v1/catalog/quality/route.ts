import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { ProductQualityService } from '@/server/pim/product-quality.service';

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
    const { products } = await PimService.getProducts(tenantSlug, { limit: 100 });

    const total = products.length;
    let criticalErrorsCount = 0;
    let warningsCount = 0;
    let averageScore = 0;

    const items = products.map((p) => {
      const q = p.quality || ProductQualityService.evaluate(p);
      if (q.errors.length > 0) criticalErrorsCount++;
      if (q.warnings.length > 0) warningsCount++;
      averageScore += q.score;
      return {
        id: p.id,
        title: p.title,
        sku: p.sku,
        score: q.score,
        errors: q.errors,
        warnings: q.warnings,
      };
    });

    averageScore = total > 0 ? Math.round(averageScore / total) : 100;

    return NextResponse.json(
      {
        success: true,
        data: {
          summary: {
            totalProductsChecked: total,
            averageScore,
            criticalErrorsCount,
            warningsCount,
            healthyProductsCount: total - criticalErrorsCount,
          },
          products: items,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

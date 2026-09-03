import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';
import { ProductCompletenessService } from '@/server/pim/product-completeness.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    let avgTotal = 0;
    let avgContent = 0;
    let avgMedia = 0;
    let avgAttrs = 0;
    let avgSeo = 0;
    let avgLoc = 0;

    const items = products.map((p) => {
      const c = p.completeness || ProductCompletenessService.calculate(p);
      avgTotal += c.totalPercent;
      avgContent += c.breakdown.content;
      avgMedia += c.breakdown.media;
      avgAttrs += c.breakdown.attributes;
      avgSeo += c.breakdown.seo;
      avgLoc += c.breakdown.localization;

      return {
        id: p.id,
        title: p.title,
        sku: p.sku,
        category: p.categories?.[0] || 'General',
        completenessScore: c.totalPercent,
        breakdown: c.breakdown,
        missingItems: c.missingItems,
      };
    });

    const summary = {
      totalProductsChecked: total,
      overallCompletenessPercent: total > 0 ? Math.round(avgTotal / total) : 100,
      contentAverage: total > 0 ? Math.round(avgContent / total) : 100,
      mediaAverage: total > 0 ? Math.round(avgMedia / total) : 100,
      attributesAverage: total > 0 ? Math.round(avgAttrs / total) : 100,
      seoAverage: total > 0 ? Math.round(avgSeo / total) : 100,
      localizationAverage: total > 0 ? Math.round(avgLoc / total) : 100,
      productsBelowThreshold: items.filter((i) => i.completenessScore < 80).length,
    };

    return NextResponse.json({ success: true, data: { summary, products: items } }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

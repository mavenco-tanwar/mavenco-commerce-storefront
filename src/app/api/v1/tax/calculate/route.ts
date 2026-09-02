import { NextRequest, NextResponse } from 'next/server';

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
    const body = await req.json();
    const {
      country = 'IN',
      region = 'Maharashtra',
      originRegion = 'Maharashtra',
      subtotalMinor = 100000,
      discountMinor = 10000,
      shippingMinor = 1500,
      isInclusive = true,
      taxCategoryRate = 18,
    } = body;

    const taxableAmountMinor = Math.max(0, subtotalMinor - discountMinor);

    let components: any[] = [];
    let totalTaxMinor = 0;

    if (country === 'IN') {
      const isIntraState = region.toLowerCase() === originRegion.toLowerCase();
      if (isIntraState) {
        const halfRate = taxCategoryRate / 2;
        const cgstTax = isInclusive
          ? Math.round(taxableAmountMinor - taxableAmountMinor / (1 + taxCategoryRate / 100)) / 2
          : Math.round((taxableAmountMinor * halfRate) / 100);
        const sgstTax = cgstTax;
        totalTaxMinor = Math.round(cgstTax + sgstTax);

        components = [
          {
            code: 'CGST',
            name: 'Central GST',
            rate: halfRate,
            taxableAmountMinor,
            taxAmountMinor: Math.round(cgstTax),
          },
          {
            code: 'SGST',
            name: `State GST (${region})`,
            rate: halfRate,
            taxableAmountMinor,
            taxAmountMinor: Math.round(sgstTax),
          },
        ];
      } else {
        totalTaxMinor = isInclusive
          ? Math.round(taxableAmountMinor - taxableAmountMinor / (1 + taxCategoryRate / 100))
          : Math.round((taxableAmountMinor * taxCategoryRate) / 100);

        components = [
          {
            code: 'IGST',
            name: 'Integrated GST (Inter-State)',
            rate: taxCategoryRate,
            taxableAmountMinor,
            taxAmountMinor: totalTaxMinor,
          },
        ];
      }
    } else {
      // International / US / VAT
      totalTaxMinor = Math.round((taxableAmountMinor * 10) / 100);
      components = [
        {
          code: 'VAT',
          name: 'Destination Import VAT / Sales Tax',
          rate: 10,
          taxableAmountMinor,
          taxAmountMinor: totalTaxMinor,
        },
      ];
    }

    const grandTotalMinor = isInclusive
      ? taxableAmountMinor + shippingMinor
      : taxableAmountMinor + shippingMinor + totalTaxMinor;

    return NextResponse.json({
      success: true,
      data: {
        currency: 'USD',
        subtotalMinor,
        discountMinor,
        shippingMinor,
        taxableAmountMinor,
        totalTaxMinor,
        grandTotalMinor,
        components,
        isInclusive,
        jurisdiction: country === 'IN' ? `${region} (India GST)` : `${country} (Export)`,
        calculatedAt: new Date().toISOString(),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

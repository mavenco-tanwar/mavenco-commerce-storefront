import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';

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

// In-memory bundles store
const bundlesStore: Map<string, any[]> = new Map();

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    PimService.initTenantStore(tenantSlug);
    let bundles = bundlesStore.get(tenantSlug);
    if (!bundles) {
      bundles = [
        {
          id: 'bundle_bridal_suite',
          tenantId: tenantSlug,
          productId: 'prod-01',
          bundleType: 'discounted',
          discountPercentage: 15,
          components: [
            { id: 'bc_1', bundleId: 'bundle_bridal_suite', productId: 'prod-01', productName: 'Blush Floral Midi Dress', quantity: 1, required: true },
            { id: 'bc_2', bundleId: 'bundle_bridal_suite', productId: 'prod-02', productName: 'Silk Organza Dupatta Scarf', quantity: 1, required: true },
          ],
          status: 'active',
        },
      ];
      bundlesStore.set(tenantSlug, bundles);
    }
    return NextResponse.json({ success: true, data: bundles }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const body = await req.json();

    const newBundle = {
      id: body.id || `bundle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      productId: body.productId,
      bundleType: body.bundleType || 'fixed',
      discountPercentage: body.discountPercentage || 0,
      components: body.components || [],
      status: body.status || 'active',
    };

    const list = bundlesStore.get(tenantSlug) || [];
    list.push(newBundle);
    bundlesStore.set(tenantSlug, list);

    return NextResponse.json({ success: true, data: newBundle, message: 'Bundle configured successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

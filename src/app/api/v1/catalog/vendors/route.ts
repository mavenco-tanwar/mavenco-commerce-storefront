import { NextRequest, NextResponse } from 'next/server';
import { PimService } from '@/server/pim/pim.service';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, x-user-role',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const userRole = (req.headers.get('x-user-role') || 'editor').toLowerCase();
    // Only finance, supplier_manager, or admin roles can view raw supplier costs & payment terms
    const canViewCosts = userRole === 'admin' || userRole === 'finance' || userRole === 'supplier_manager';

    const vendors = PimService.getVendors(tenantSlug, canViewCosts);
    return NextResponse.json({ success: true, data: vendors, canViewCosts }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantSlug = (req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();
    const userRole = (req.headers.get('x-user-role') || 'editor').toLowerCase();

    if (userRole !== 'admin' && userRole !== 'supplier_manager') {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions to modify vendors' }, { status: 403, headers: corsHeaders() });
    }

    const body = await req.json();
    const newVendor = {
      id: body.id || `ven_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: tenantSlug,
      name: body.name || 'New Supplier Vendor',
      code: (body.code || 'VEN').toUpperCase(),
      contactEmail: body.contactEmail || 'supplier@example.com',
      contactPhone: body.contactPhone,
      address: body.address,
      currency: body.currency || 'USD',
      paymentTerms: body.paymentTerms || 'Net 30',
      status: body.status || 'active',
    };

    const vendors = PimService.getVendors(tenantSlug, true);
    vendors.push(newVendor as any);

    return NextResponse.json({ success: true, data: newVendor, message: 'Vendor created successfully' }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

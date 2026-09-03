import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const storeId = `store_${Date.now()}`;
    const slug = body.slug || `store-${Date.now()}`;

    const newStore = {
      id: storeId,
      tenantId: tenantSlug,
      name: body.name || 'Bespoke Luxury Store',
      slug,
      code: (body.slug || 'STR').toUpperCase(),
      status: 'active',
      defaultLocale: body.language ? `${body.language}-${body.country || 'US'}` : 'en-US',
      defaultCurrency: body.currency || 'USD',
      timezone: body.timezone || 'America/New_York',
      country: body.country || 'US',
      language: body.language || 'en',
      themeId: `theme_${body.templatePreset || 'fashion_luxury'}_v1`,
      primaryDomainName: `${body.platformSubdomain || slug}.platform.com`,
      settings: {
        currency: body.currency || 'USD',
        locale: body.language ? `${body.language}-${body.country || 'US'}` : 'en-US',
        timezone: body.timezone || 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'standard',
        measurementSystem: 'imperial',
        customerAccountMode: 'optional',
        guestCheckout: true,
        maintenanceMode: false,
        inventoryVisibility: 'low_stock_only',
        priceVisibility: 'public',
        taxDisplayMode: 'inclusive',
        shippingDisplayMode: 'calculated_at_checkout',
      },
      createdAt: now,
      updatedAt: now,
    };

    const newDomain = {
      id: `dom_${Date.now()}`,
      tenantId: tenantSlug,
      storeId,
      hostname: `${body.platformSubdomain || slug}.platform.com`,
      normalizedHostname: `${body.platformSubdomain || slug}.platform.com`,
      type: 'platform_subdomain',
      status: 'active',
      isPrimary: true,
      verificationStatus: 'verified',
      sslStatus: 'active',
      dnsStatus: 'verified',
      createdAt: now,
      updatedAt: now,
    };

    const newChannel = {
      id: `chan_${Date.now()}`,
      tenantId: tenantSlug,
      storeId,
      name: 'Primary Web Storefront',
      code: 'WEB-MAIN',
      type: 'web',
      status: 'active',
      configuration: {
        currency: body.currency || 'USD',
        locale: 'en-US',
        catalogVisibility: 'all',
        customerAuth: 'shared',
      },
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('stores').insertOne(newStore);
      await db.collection('store_domains').insertOne(newDomain);
      await db.collection('sales_channels').insertOne(newChannel);
    }

    return NextResponse.json({
      success: true,
      data: {
        store: newStore,
        domain: newDomain,
        channel: newChannel,
      },
      message: `Store '${newStore.name}' provisioned successfully with ${body.templatePreset} preset!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

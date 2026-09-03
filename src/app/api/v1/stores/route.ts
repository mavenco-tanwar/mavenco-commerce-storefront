import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

const DEFAULT_STORES = [
  {
    id: 'store_flagship_001',
    tenantId: 'lumina',
    name: 'Lumina Luxury Flagship',
    slug: 'lumina-flagship',
    code: 'LUM-FLAGSHIP',
    description: 'Primary high-fashion luxury pret and couture web boutique.',
    status: 'active',
    defaultLocale: 'en-US',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    country: 'US',
    language: 'en',
    themeId: 'theme_couture_noir_v2',
    primaryDomainId: 'dom_001',
    primaryDomainName: 'shop.luminaluxury.com',
    settings: {
      currency: 'USD',
      locale: 'en-US',
      timezone: 'America/New_York',
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
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'store_outlet_002',
    tenantId: 'lumina',
    name: 'Lumina Archival Outlet',
    slug: 'lumina-outlet',
    code: 'LUM-OUTLET',
    description: 'Past-season archival couture collections with exclusive member pricing.',
    status: 'active',
    defaultLocale: 'en-US',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    country: 'US',
    language: 'en',
    themeId: 'theme_minimalist_outlet',
    primaryDomainId: 'dom_002',
    primaryDomainName: 'outlet.luminaluxury.com',
    settings: {
      currency: 'USD',
      locale: 'en-US',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'standard',
      measurementSystem: 'imperial',
      customerAccountMode: 'required',
      guestCheckout: false,
      maintenanceMode: false,
      inventoryVisibility: 'exact',
      priceVisibility: 'members_only',
      taxDisplayMode: 'inclusive',
      shippingDisplayMode: 'calculated_at_checkout',
    },
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = (searchParams.get('tenant') || req.headers.get('x-tenant-slug') || 'lumina').toLowerCase();

    const db = await getDatabase();
    let stores = DEFAULT_STORES;

    if (db) {
      const collection = db.collection('stores');
      const count = await collection.countDocuments({ tenantId: tenantSlug });
      if (count === 0) {
        await collection.insertMany(DEFAULT_STORES.map((s) => ({ ...s, tenantId: tenantSlug })));
      }
      const docs = await collection.find({ tenantId: tenantSlug }).sort({ createdAt: -1 }).toArray();
      stores = docs.map(({ _id, ...rest }) => rest as any);
    } else {
      stores = stores.filter((s) => s.tenantId === tenantSlug);
    }

    return NextResponse.json({
      success: true,
      data: stores,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantSlug = (req.headers.get('x-tenant-slug') || body.tenantId || 'lumina').toLowerCase();

    const db = await getDatabase();
    const now = new Date().toISOString();
    const newStore = {
      id: `store_${Date.now()}`,
      tenantId: tenantSlug,
      name: body.name || 'New Storefront',
      slug: body.slug || `store-${Date.now()}`,
      code: body.code || `STR-${Date.now()}`,
      description: body.description || '',
      status: 'active',
      defaultLocale: body.defaultLocale || 'en-US',
      defaultCurrency: body.defaultCurrency || 'USD',
      timezone: body.timezone || 'America/New_York',
      country: body.country || 'US',
      language: body.language || 'en',
      themeId: body.themeId || 'theme_couture_noir_v2',
      primaryDomainName: body.primaryDomainName || `${body.slug || 'store'}.platform.com`,
      settings: body.settings || {
        currency: 'USD',
        locale: 'en-US',
        timezone: 'America/New_York',
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

    if (db) {
      await db.collection('stores').insertOne(newStore);
    }

    return NextResponse.json({
      success: true,
      data: newStore,
      message: 'Store created successfully!',
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

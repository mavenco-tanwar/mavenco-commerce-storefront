import { NextRequest, NextResponse } from 'next/server';
import { CHANNELS_REGISTRY } from '@/server/experience/experience-api.service';
import { StorefrontChannel } from '@/types/headless-experience.types';

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

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: CHANNELS_REGISTRY,
      meta: {
        total: CHANNELS_REGISTRY.length,
        timestamp: new Date().toISOString(),
      },
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newChannel: StorefrontChannel = {
      id: `chan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: body.tenantId || 'tenant_lumina',
      storeId: body.storeId || 'store_flagship_01',
      name: body.name || 'New Omnichannel Endpoint',
      code: (body.code || `CHANNEL_${Date.now()}`).toUpperCase().replace(/\s+/g, '_'),
      type: body.type || 'headless',
      status: body.status || 'draft',
      apiKeyPrefix: `sf_live_${Math.random().toString(36).substring(2, 8)}`,
      configuration: body.configuration || {
        locale: 'en-US',
        currency: 'USD',
        allowedCurrencies: ['USD'],
        allowedLocales: ['en-US'],
        catalogVisibility: 'all',
        pricingMultiplier: 1.0,
        allowGuestCheckout: true,
        requiresCustomerApproval: false,
        inventoryAllocationPolicy: 'shared',
        paymentMethodIds: ['pm_stripe_card'],
        shippingMethodIds: ['ship_standard_ground'],
        seo: {
          titleTemplate: '%s | Store',
          defaultMetaDescription: 'Commerce experience',
          robotsRule: 'index, follow',
          canonicalBaseUrl: 'https://lumina-luxury.com',
        },
        features: {
          wishlist: true,
          reviews: true,
          loyalty: true,
          giftCards: true,
          wallet: true,
          recommendations: true,
          analytics: true,
        },
      },
      activeVersion: 1,
      metrics24h: {
        requestCount: 0,
        avgLatencyMs: 0,
        conversionRate: 0,
        ordersCount: 0,
        revenue: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    CHANNELS_REGISTRY.unshift(newChannel);
    return NextResponse.json({ success: true, data: newChannel }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, configuration, action } = body;

    const channelIndex = CHANNELS_REGISTRY.findIndex((c) => c.id === id);
    if (channelIndex === -1) {
      return NextResponse.json({ success: false, error: 'Channel not found' }, { status: 404, headers: corsHeaders() });
    }

    if (action === 'publish_version') {
      CHANNELS_REGISTRY[channelIndex].activeVersion += 1;
    }

    if (status) {
      CHANNELS_REGISTRY[channelIndex].status = status;
    }

    if (configuration) {
      CHANNELS_REGISTRY[channelIndex].configuration = {
        ...CHANNELS_REGISTRY[channelIndex].configuration,
        ...configuration,
      };
    }

    CHANNELS_REGISTRY[channelIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: CHANNELS_REGISTRY[channelIndex] }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

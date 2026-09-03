import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let FEATURE_FLAGS = [
  {
    id: 'ff_001',
    key: 'checkout_v2_instant_buy',
    name: '1-Click Accelerated Express Checkout',
    description: 'Enables Passkey, Apple Pay and Google Pay accelerated biometric slide-to-buy.',
    type: 'boolean',
    status: 'enabled',
    defaultValue: true,
    rolloutPercentage: 100,
    targetPlans: ['growth', 'scale'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ff_002',
    key: 'visual_builder_custom_scripts',
    name: 'Visual Theme Builder Custom CSS & Script Injector',
    description: 'Allows enterprise merchants to inject bespoke liquid tags, custom CSS and tracking scripts.',
    type: 'targeting',
    status: 'enabled',
    defaultValue: false,
    rolloutPercentage: 100,
    targetPlans: ['scale'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ff_003',
    key: 'multi_store_b2b_wholesale_portal',
    name: 'B2B Wholesale & Custom Tiered Pricing Engine',
    description: 'Enables dedicated B2B sales channels with volume-tiered net-30 invoice purchasing.',
    type: 'percentage',
    status: 'enabled',
    defaultValue: false,
    rolloutPercentage: 50,
    targetPlans: ['scale'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ff_004',
    key: 'ai_copilot_catalog_enrichment',
    name: 'AI Smart Copywriter & Automated Catalog Metadata',
    description: 'Automated SEO meta tag and luxury product description generator.',
    type: 'boolean',
    status: 'disabled',
    defaultValue: false,
    rolloutPercentage: 0,
    targetPlans: ['growth', 'scale'],
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: FEATURE_FLAGS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { flagId, status } = body;

    FEATURE_FLAGS = FEATURE_FLAGS.map((f) => {
      if (f.id === flagId) {
        return { ...f, status, updatedAt: new Date().toISOString() };
      }
      return f;
    });

    return NextResponse.json({
      success: true,
      message: `Feature flag status updated to ${status}!`,
      data: FEATURE_FLAGS.find((f) => f.id === flagId),
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

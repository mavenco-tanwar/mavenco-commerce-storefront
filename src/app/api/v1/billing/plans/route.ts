import { NextRequest, NextResponse } from 'next/server';

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

const DEFAULT_PLANS = [
  {
    id: 'plan_starter',
    name: 'Starter Tier',
    slug: 'starter',
    description: 'Perfect for boutique brands launching their first omnichannel luxury storefront.',
    status: 'active',
    visibility: 'public',
    billingModel: 'flat',
    monthlyPriceMinor: 9900, // $99.00
    yearlyPriceMinor: 99000, // $990.00 (2 months free)
    currency: 'USD',
    trialDays: 14,
    features: [
      { key: 'visual_builder', name: 'Drag-and-Drop Visual Theme Builder', enabled: true },
      { key: 'custom_domains', name: 'Custom Root & Subdomains', enabled: true },
      { key: 'analytics', name: 'Core Commerce Analytics', enabled: true },
      { key: 'api_access', name: 'Standard Storefront REST APIs', enabled: true },
      { key: 'multi_store', name: 'Multi-Store Fleet Management', enabled: false },
      { key: 'headless_graphql', name: 'Headless GraphQL B2B Endpoints', enabled: false },
    ],
    limits: {
      maxStores: 1,
      maxCustomDomains: 1,
      maxProducts: 2000,
      maxMonthlyOrders: 1000,
      maxStorageGb: 10,
      maxApiRequestsPerMonth: 50000,
    },
    highlight: false,
  },
  {
    id: 'plan_growth',
    name: 'Growth Commerce Tier',
    slug: 'growth',
    description: 'Designed for scaling multi-store omnichannel fashion and lifestyle brands.',
    status: 'active',
    visibility: 'public',
    billingModel: 'flat',
    monthlyPriceMinor: 29900, // $299.00
    yearlyPriceMinor: 299000, // $2,990.00
    currency: 'USD',
    trialDays: 14,
    features: [
      { key: 'visual_builder', name: 'Drag-and-Drop Visual Theme Builder', enabled: true },
      { key: 'custom_domains', name: 'Custom Root & Subdomains', enabled: true },
      { key: 'analytics', name: 'Advanced Cohort & Retention Analytics', enabled: true },
      { key: 'api_access', name: 'Standard & Webhook APIs', enabled: true },
      { key: 'multi_store', name: 'Multi-Store Fleet Management', enabled: true },
      { key: 'headless_graphql', name: 'Headless GraphQL B2B Endpoints', enabled: false },
    ],
    limits: {
      maxStores: 5,
      maxCustomDomains: 5,
      maxProducts: 10000,
      maxMonthlyOrders: 5000,
      maxStorageGb: 50,
      maxApiRequestsPerMonth: 250000,
    },
    highlight: true,
  },
  {
    id: 'plan_scale',
    name: 'Scale Enterprise Tier',
    slug: 'scale',
    description: 'For global retail conglomerates requiring unlimited throughput and bespoke SLA.',
    status: 'active',
    visibility: 'public',
    billingModel: 'flat',
    monthlyPriceMinor: 79900, // $799.00
    yearlyPriceMinor: 799000, // $7,990.00
    currency: 'USD',
    trialDays: 30,
    features: [
      { key: 'visual_builder', name: 'Full Visual Builder + Custom Code & Scripts', enabled: true },
      { key: 'custom_domains', name: 'Unlimited Custom Domains & Wildcard SSL', enabled: true },
      { key: 'analytics', name: 'Real-time Stream & Financial GL Reconciliation', enabled: true },
      { key: 'api_access', name: 'High-Concurrency Dedicated API Gateways', enabled: true },
      { key: 'multi_store', name: 'Unlimited Multi-Store Fleet & POS Nodes', enabled: true },
      { key: 'headless_graphql', name: 'Headless GraphQL B2B Endpoints', enabled: true },
    ],
    limits: {
      maxStores: 25,
      maxCustomDomains: 25,
      maxProducts: 100000,
      maxMonthlyOrders: 50000,
      maxStorageGb: 500,
      maxApiRequestsPerMonth: 2500000,
    },
    highlight: false,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: DEFAULT_PLANS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

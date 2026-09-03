import { NextRequest, NextResponse } from 'next/server';

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

let MARKETPLACE_APPS = [
  {
    id: 'app_mkt_01',
    slug: 'shipstation',
    name: 'ShipStation Shipping & Logistics',
    category: 'shipping',
    description: 'Automate multi-carrier label creation, discounted postage rates, and branded tracking portals.',
    developerName: 'ShipStation Inc.',
    iconBg: 'from-blue-600 to-indigo-600',
    pricingType: 'freemium',
    monthlyPriceMinor: 2900, // $29.00
    rating: 4.9,
    reviewCount: 384,
    requiredScopes: ['orders:read', 'orders:write', 'shipping:read', 'inventory:read'],
    isInstalled: true,
    installedAt: new Date(Date.now() - 7776000000).toISOString(),
  },
  {
    id: 'app_mkt_02',
    slug: 'klaviyo',
    name: 'Klaviyo Marketing Automation & SMS',
    category: 'marketing',
    description: 'AI-driven email flows, abandoned cart recovery sequences, and predictive customer lifetime value.',
    developerName: 'Klaviyo Global',
    iconBg: 'from-emerald-600 to-teal-600',
    pricingType: 'subscription',
    monthlyPriceMinor: 4500, // $45.00
    rating: 4.8,
    reviewCount: 512,
    requiredScopes: ['customers:read', 'orders:read', 'analytics:read'],
    isInstalled: true,
    installedAt: new Date(Date.now() - 5184000000).toISOString(),
  },
  {
    id: 'app_mkt_03',
    slug: 'quickbooks',
    name: 'QuickBooks Online Accounting',
    category: 'accounting',
    description: 'Bi-directional general ledger, sales tax, payment fee reconciliation, and invoice auto-posting.',
    developerName: 'Intuit QuickBooks',
    iconBg: 'from-emerald-500 to-green-700',
    pricingType: 'subscription',
    monthlyPriceMinor: 3500,
    rating: 4.7,
    reviewCount: 220,
    requiredScopes: ['orders:read', 'payments:read', 'invoices:read', 'taxes:read'],
    isInstalled: true,
    installedAt: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'app_mkt_04',
    slug: 'zendesk',
    name: 'Zendesk VIP Customer Support',
    category: 'crm',
    description: 'Omnichannel customer support ticketing, live chat widget, and storefront order lookup sidebar.',
    developerName: 'Zendesk',
    iconBg: 'from-amber-600 to-orange-600',
    pricingType: 'subscription',
    monthlyPriceMinor: 4900,
    rating: 4.6,
    reviewCount: 140,
    requiredScopes: ['customers:read', 'orders:read'],
    isInstalled: false,
  },
  {
    id: 'app_mkt_05',
    slug: 'ai-concierge-copilot',
    name: 'Lumina VIP AI Styling Copilot',
    category: 'ai_tools',
    description: 'Autonomous luxury styling agent and personal recommendation assistant for high-tier shoppers.',
    developerName: 'Mavenco AI Labs',
    iconBg: 'from-rose-600 to-purple-600',
    pricingType: 'free',
    monthlyPriceMinor: 0,
    rating: 5.0,
    reviewCount: 96,
    requiredScopes: ['products:read', 'customers:read', 'orders:read', 'analytics:read'],
    isInstalled: true,
    installedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: MARKETPLACE_APPS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    const app = MARKETPLACE_APPS.find((a) => a.id === id);
    if (app) {
      if (action === 'install') {
        app.isInstalled = true;
        app.installedAt = new Date().toISOString();
      } else if (action === 'uninstall') {
        app.isInstalled = false;
        app.installedAt = undefined;
      }
    }

    return NextResponse.json({
      success: true,
      data: app,
      message: `App '${app?.name}' ${app?.isInstalled ? 'installed' : 'uninstalled'} successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

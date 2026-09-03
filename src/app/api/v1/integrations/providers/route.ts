import { NextResponse } from 'next/server';

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

let PROVIDERS = [
  {
    id: 'prov_netsuite',
    name: 'Oracle NetSuite ERP',
    slug: 'netsuite-erp',
    category: 'erp',
    description: 'Enterprise resource planning for global financial ledgers, inventory matrices, purchase orders, and wholesale fulfillment.',
    iconBg: 'from-blue-600 to-cyan-700',
    authType: 'oauth2',
    capabilities: ['products', 'orders', 'inventory', 'customers', 'payments', 'refunds', 'webhooks', 'incremental_sync'],
    status: 'active',
    configurationSchema: [
      { key: 'accountId', label: 'NetSuite Account ID', type: 'string', required: true, description: 'e.g. 1234567-SB1' },
      { key: 'subsidiaryId', label: 'Primary Subsidiary ID', type: 'number', required: true, description: 'Subsidiary mapping' },
      { key: 'warehouseLocationId', label: 'Default Warehouse ID', type: 'string', required: true, description: 'Inventory location' },
    ],
  },
  {
    id: 'prov_salesforce',
    name: 'Salesforce Commerce & CRM',
    slug: 'salesforce-crm',
    category: 'crm',
    description: 'Customer 360 sync, VIP tier segmentation, clienteling notes, omnichannel support case history, and lead scoring.',
    iconBg: 'from-sky-500 to-blue-700',
    authType: 'oauth2',
    capabilities: ['customers', 'orders', 'webhooks', 'incremental_sync'],
    status: 'active',
    configurationSchema: [
      { key: 'instanceUrl', label: 'Salesforce Instance URL', type: 'string', required: true, description: 'e.g. https://na139.salesforce.com' },
      { key: 'syncVipOnly', label: 'Sync VIP Shoppers Only', type: 'boolean', required: false, description: 'Limit sync to loyalty tiers' },
    ],
  },
  {
    id: 'prov_quickbooks',
    name: 'QuickBooks Online Accounting',
    slug: 'quickbooks-accounting',
    category: 'accounting',
    description: 'Automated sales receipts, tax categorization, payment processing fee line-items, and bank deposit reconciliation.',
    iconBg: 'from-emerald-600 to-green-700',
    authType: 'oauth2',
    capabilities: ['orders', 'payments', 'refunds', 'customers', 'webhooks'],
    status: 'active',
    configurationSchema: [
      { key: 'realmId', label: 'QuickBooks Company Realm ID', type: 'string', required: true, description: 'QBO Company ID' },
      { key: 'defaultSalesAccount', label: 'Income Account Code', type: 'string', required: true, description: 'e.g. 4000 Sales Revenue' },
    ],
  },
  {
    id: 'prov_square_pos',
    name: 'Square POS Retail Terminal',
    slug: 'square-pos',
    category: 'pos',
    description: 'Physical flagship boutique POS terminal sync, real-time in-store stock deduction, and barcode scanner lookup.',
    iconBg: 'from-slate-700 to-zinc-900',
    authType: 'oauth2',
    capabilities: ['products', 'inventory', 'orders', 'webhooks'],
    status: 'active',
    configurationSchema: [
      { key: 'locationId', label: 'Square Store Location ID', type: 'string', required: true, description: 'POS register location' },
    ],
  },
  {
    id: 'prov_shipstation',
    name: 'ShipStation Logistics & 3PL',
    slug: 'shipstation-3pl',
    category: 'shipping',
    description: 'Multi-carrier automated postage labels, dimension weights, pick-pack routing, and live tracking webhooks.',
    iconBg: 'from-indigo-600 to-blue-600',
    authType: 'api_key',
    capabilities: ['orders', 'shipments', 'webhooks', 'incremental_sync'],
    status: 'active',
    configurationSchema: [
      { key: 'apiSecret', label: 'ShipStation API Secret', type: 'secret', required: true, description: 'API Secret' },
    ],
  },
  {
    id: 'prov_amazon_mkt',
    name: 'Amazon Marketplace Connector',
    slug: 'amazon-marketplace',
    category: 'marketplace',
    description: 'Publish luxury collections to Amazon Premium Beauty/Fashion, sync FBA/FBM inventory balances, and import orders.',
    iconBg: 'from-amber-600 to-orange-700',
    authType: 'oauth2',
    capabilities: ['products', 'orders', 'inventory', 'shipments', 'webhooks'],
    status: 'active',
    configurationSchema: [
      { key: 'sellerId', label: 'Amazon Seller ID / Merchant Token', type: 'string', required: true, description: 'SP-API Merchant Token' },
      { key: 'marketplaceRegion', label: 'Region', type: 'select', required: true, options: ['North America (US/CA)', 'Europe (UK/DE/FR)', 'Japan'], description: 'SP-API Marketplace Region' },
    ],
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: PROVIDERS,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

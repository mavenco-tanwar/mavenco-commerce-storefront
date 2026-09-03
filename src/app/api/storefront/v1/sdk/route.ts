import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Mavenco Omnichannel Storefront & Experience API',
      version: '1.0.0',
      description: 'Channel-independent headless commerce engine powering Web, Mobile, POS, Marketplace & PWA endpoints.',
      contact: {
        name: 'Mavenco Commerce Platform API Support',
        email: 'api-support@mavenco-commerce.com',
      },
    },
    servers: [
      { url: 'https://api.lumina-luxury.com/api/storefront/v1', description: 'Production Experience Edge Gateway' },
      { url: 'http://localhost:3000/api/storefront/v1', description: 'Local Development Server' },
    ],
    paths: {
      '/context': {
        get: {
          summary: 'Resolve store context & public configuration',
          responses: { '200': { description: 'Public configuration snapshot' } },
        },
      },
      '/catalog/products': {
        get: {
          summary: 'Get channel-filtered catalog products',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'collection', in: 'query', schema: { type: 'string' } },
            { name: 'q', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Paginated storefront products' } },
        },
      },
      '/catalog/products/{slug}': {
        get: {
          summary: 'Get product by slug with channel pricing and availability',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Normalized storefront product detail' } },
        },
      },
      '/navigation': {
        get: {
          summary: 'Get channel navigation header and footer menus',
          responses: { '200': { description: 'Hierarchical navigation items' } },
        },
      },
      '/cart': {
        get: { summary: 'Retrieve active cart', responses: { '200': { description: 'Storefront cart object' } } },
        post: { summary: 'Add item to cart', responses: { '200': { description: 'Updated cart object' } } },
        patch: { summary: 'Update cart item or apply coupon code', responses: { '200': { description: 'Recalculated cart' } } },
      },
      '/checkout': {
        post: { summary: 'Execute headless checkout state machine transition', responses: { '200': { description: 'Checkout session or placed order' } } },
      },
      '/channels': {
        get: { summary: 'List omnichannel endpoints', responses: { '200': { description: 'Array of active channels' } } },
        post: { summary: 'Create new omnichannel endpoint', responses: { '200': { description: 'Created channel' } } },
      },
    },
  };

  return NextResponse.json({
    success: true,
    sdk: {
      packageName: '@mavenco/storefront-sdk',
      version: '1.2.0',
      installation: 'npm install @mavenco/storefront-sdk',
      quickstart: `import { createStorefrontClient } from '@mavenco/storefront-sdk';

const client = createStorefrontClient({
  endpoint: 'https://api.lumina-luxury.com/api/storefront/v1',
  channelCode: 'MOBILE_APP',
  locale: 'en-US',
  currency: 'USD'
});

const products = await client.catalog.getProducts({ limit: 10 });
const cart = await client.cart.addItem({ productId: 'prod_lum_001', quantity: 1 });`,
    },
    openApiSpec,
  }, { headers: corsHeaders() });
}

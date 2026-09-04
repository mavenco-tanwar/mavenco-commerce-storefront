import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const tenantParam = url.searchParams.get('tenant');

  // ── Global CORS handling for all API routes ──
  const isApiRoute = url.pathname.startsWith('/api/');
  if (isApiRoute) {
    const requestedHeaders =
      request.headers.get('access-control-request-headers') ||
      'Content-Type, Authorization, x-tenant-slug, X-Tenant-Slug, x-tenant, x-store-slug, x-store-id, X-Store-ID, X-API-Key, x-api-key, x-user-name, x-channel-code, x-market-code, x-currency, x-locale, x-session-id';

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': requestedHeaders,
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight OPTIONS requests immediately
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // Still set tenant header for API routes
    let apiTenantSlug =
      tenantParam?.toLowerCase() ||
      request.headers.get('x-tenant-slug')?.toLowerCase() ||
      request.headers.get('x-tenant')?.toLowerCase() ||
      request.headers.get('x-store-slug')?.toLowerCase() ||
      request.cookies.get('jq_saas_active_tenant_slug')?.value?.toLowerCase() ||
      request.cookies.get('jq_active_tenant')?.value?.toLowerCase() ||
      '';

    if (!apiTenantSlug) {
      if (hostname.includes('auraliving')) apiTenantSlug = 'auraliving';
      else if (hostname.includes('apexathletics')) apiTenantSlug = 'apexathletics';
      else if (hostname.includes('jqtrends')) apiTenantSlug = 'jqtrends'; // audit:ignore - Hostname routing
    }

    const requestHeaders = new Headers(request.headers);
    if (apiTenantSlug) {
      requestHeaders.set('x-tenant-slug', apiTenantSlug);
    }

    // For non-preflight API requests, continue and forward headers plus attach CORS
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    if (apiTenantSlug) {
      response.headers.set('x-tenant-slug', apiTenantSlug);
    }
    return response;
  }

  // ── Tenant resolution for non-API routes ──
  let tenantSlug = '';

  // 1. Path-based tenant resolution: /stores/[slug] or /tenant/[slug]
  const pathMatch = url.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)(.*)/);
  if (pathMatch) {
    tenantSlug = pathMatch[2].toLowerCase();
    const restPath = pathMatch[3] || '/';
    url.pathname = restPath === '' ? '/' : restPath;
    url.searchParams.set('tenant', tenantSlug);
    
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-slug', tenantSlug);
    response.cookies.set('jq_active_tenant', tenantSlug, { path: '/' });
    return response;
  }

  // 2. Query param resolution: ?tenant=slug
  if (tenantParam) {
    tenantSlug = tenantParam.toLowerCase();
  }
  // 3. Domain / Subdomain resolution
  else if (hostname.includes('auraliving') || hostname.startsWith('auraliving.')) {
    tenantSlug = 'auraliving';
  } else if (hostname.includes('apexathletics') || hostname.startsWith('apexathletics.')) {
    tenantSlug = 'apexathletics';
  } else if (hostname.includes('jqtrends') || hostname.startsWith('jqtrends.')) { // audit:ignore - Hostname routing
    tenantSlug = 'jqtrends'; // audit:ignore - Hostname routing
  } else {
    // Default platform domain (e.g. mavenco-storefront.vercel.app)
    tenantSlug = '';
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);
  if (tenantSlug) {
    response.cookies.set('jq_active_tenant', tenantSlug, { path: '/' });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

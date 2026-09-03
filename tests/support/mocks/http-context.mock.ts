/**
 * Module 37: HTTP Context & NextRequest Mock Helper
 * Generates test-controlled NextRequest instances with tenant headers,
 * auth tokens, market parameters, and JSON payloads.
 */

import { NextRequest } from 'next/server';

export interface CreateMockRequestOptions {
  url?: string;
  method?: string;
  tenantId?: string;
  storeId?: string;
  channelId?: string;
  marketId?: string;
  currency?: string;
  locale?: string;
  userId?: string;
  headers?: Record<string, string>;
  body?: any;
}

export function createMockNextRequest(options: CreateMockRequestOptions = {}): NextRequest {
  const {
    url = 'https://lumina.mavenco.store/api/storefront/v1/bootstrap',
    method = 'GET',
    tenantId = 'lumina',
    storeId = 'store_primary',
    channelId = 'web_storefront',
    marketId = 'US_GLOBAL',
    currency = 'USD',
    locale = 'en-US',
    userId = 'usr_test_01',
    headers: customHeaders = {},
    body,
  } = options;

  const headerMap: Record<string, string> = {
    'content-type': 'application/json',
    'x-tenant-id': tenantId,
    'x-store-id': storeId,
    'x-channel-id': channelId,
    'x-market-id': marketId,
    'x-currency': currency,
    'x-locale': locale,
    'x-user-id': userId,
    ...customHeaders,
  };

  const reqInit: RequestInit = {
    method,
    headers: headerMap,
  };

  if (body && method !== 'GET' && method !== 'HEAD') {
    reqInit.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return new NextRequest(url, reqInit);
}

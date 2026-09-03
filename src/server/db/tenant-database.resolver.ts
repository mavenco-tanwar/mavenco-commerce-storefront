/**
 * Module 35: Tenant Database Resolver & Tenant Context Engine
 * Strictly enforces: ONE TENANT = ONE SEPARATE MONGODB DATABASE.
 * Resolves verified TenantContext from requests and connects to tenant-scoped database.
 */

import { NextRequest } from 'next/server';
import { Db, MongoClient } from 'mongodb';
import { getMongoClient } from '@/lib/mongodb';

export interface TenantContext {
  tenantId: string;
  storeId: string;
  environmentId: string;
  channelId: string;
  marketId: string;
  locale: string;
  currency: string;
  timezone: string;
  isCustomDomain: boolean;
}

export class TenantDatabaseResolver {
  private static tenantDbCache: Map<string, Db> = new Map();

  /**
   * Resolves verified TenantContext from NextRequest headers, cookies, query params, or host.
   */
  public static resolveContext(req: NextRequest): TenantContext {
    const host = req.headers.get('host') || 'localhost';
    const cleanHost = host.split(':')[0].toLowerCase();

    // 1. Primary resolution from explicit verified headers (e.g. from middleware / gateway)
    const headerTenant = req.headers.get('x-tenant-id') || req.headers.get('x-tenant-slug');
    const headerStore = req.headers.get('x-store-id');
    const headerChannel = req.headers.get('x-channel-id') || req.headers.get('x-channel-code') || 'web';
    const headerMarket = req.headers.get('x-market-id') || req.headers.get('x-market-code') || 'GLOBAL';
    const headerLocale = req.headers.get('x-locale') || 'en-US';
    const headerCurrency = req.headers.get('x-currency') || 'USD';

    // 2. Query parameter fallback for preview / testing
    const searchParams = req.nextUrl.searchParams;
    const queryTenant = searchParams.get('tenant') || searchParams.get('tenantSlug');

    let tenantId = 'lumina'; // default base tenant
    let isCustomDomain = false;

    if (headerTenant) {
      tenantId = headerTenant.toLowerCase().trim();
    } else if (queryTenant) {
      tenantId = queryTenant.toLowerCase().trim();
    } else if (cleanHost.includes('.mavenco.store') || cleanHost.includes('.localhost')) {
      tenantId = cleanHost.split('.')[0];
    } else if (cleanHost !== 'localhost' && cleanHost !== '127.0.0.1') {
      // Map custom domain if applicable
      tenantId = cleanHost.replace(/[^a-z0-9]/g, '_');
      isCustomDomain = true;
    }

    // Sanitize tenantId for MongoDB database naming safety
    const safeTenantId = tenantId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();

    return {
      tenantId: safeTenantId || 'lumina',
      storeId: headerStore || `store_${safeTenantId}`,
      environmentId: process.env.NODE_ENV || 'production',
      channelId: headerChannel,
      marketId: headerMarket,
      locale: headerLocale,
      currency: headerCurrency,
      timezone: 'UTC',
      isCustomDomain,
    };
  }

  /**
   * Resolves the dedicated MongoDB database for a given tenant:
   * ONE TENANT = ONE SEPARATE MONGODB DATABASE (`tenant_${tenantId}`)
   */
  public static async getTenantDatabase(tenantId: string): Promise<Db | null> {
    const safeTenantId = tenantId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const dbName = `tenant_${safeTenantId}`;

    if (this.tenantDbCache.has(dbName)) {
      return this.tenantDbCache.get(dbName)!;
    }

    try {
      const client = await getMongoClient();
      if (!client) {
        return null;
      }

      const db = client.db(dbName);
      this.tenantDbCache.set(dbName, db);
      return db;
    } catch (err) {
      console.warn(`[TenantDatabaseResolver] MongoDB connection failed for ${dbName}:`, err);
      return null;
    }
  }

  /**
   * Generates a tenant-scoped cache key ensuring zero cross-tenant cache contamination.
   */
  public static getTenantCacheKey(
    context: TenantContext,
    resourceType: string,
    resourceId?: string
  ): string {
    return [
      `tenant:${context.tenantId}`,
      `store:${context.storeId}`,
      `env:${context.environmentId}`,
      `channel:${context.channelId}`,
      `market:${context.marketId}`,
      `locale:${context.locale}`,
      `currency:${context.currency}`,
      `res:${resourceType}`,
      resourceId ? `id:${resourceId}` : '',
    ]
      .filter(Boolean)
      .join(':');
  }
}

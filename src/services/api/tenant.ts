import { apiClient } from './client';

export interface TenantResolution {
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeCode: string;
  defaultCurrency: string;
  defaultLocale: string;
  supportedLocales: string[];
  theme: any;
  domain: string;
  status: string;
}

export class TenantService {
  private static cachedResolution: TenantResolution | null = null;

  /**
   * Resolves the current store tenant dynamically based on domain / hostname or configured fallback.
   */
  public static async resolveTenant(hostOverride?: string): Promise<TenantResolution> {
    if (this.cachedResolution && !hostOverride) {
      return this.cachedResolution;
    }

    try {
      let host = hostOverride;
      let queryTenant = '';

      if (!host && typeof window !== 'undefined') {
        host = window.location.hostname;
        const params = new URLSearchParams(window.location.search);
        queryTenant = params.get('tenant') || params.get('storeId') || '';
      }

      const defaultTenant = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'store_jq_trends';
      const cleanHost = (host || 'localhost').split(':')[0].toLowerCase();

      let endpoint = `/api/v1/storefront/resolve?domain=${encodeURIComponent(cleanHost)}`;
      if (queryTenant) {
        endpoint += `&tenant=${encodeURIComponent(queryTenant)}`;
      } else if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
        endpoint += `&tenant=${encodeURIComponent(defaultTenant)}`;
      }

      const res = await apiClient.get<TenantResolution>(endpoint);

      if (res.data) {
        this.cachedResolution = res.data;
        apiClient.setTenantId(res.data.storeId);
        return res.data;
      }
    } catch (err) {
      console.warn('[TenantService] Failed to resolve tenant from CMS, using default store context:', err);
    }

    // Fallback store resolution
    const fallback: TenantResolution = {
      storeId: 'store_jq_trends',
      storeName: 'JQ Trends',
      storeSlug: 'jq-trends',
      storeCode: 'JQ-TRENDS',
      defaultCurrency: 'INR',
      defaultLocale: 'en_IN',
      supportedLocales: ['en_IN', 'en_US'],
      theme: {},
      domain: 'jqtrends.localhost',
      status: 'active',
    };

    this.cachedResolution = fallback;
    apiClient.setTenantId(fallback.storeId);
    return fallback;
  }
}

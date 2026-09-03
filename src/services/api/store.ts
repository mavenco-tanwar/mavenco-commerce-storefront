import { apiClient } from './client';
import { TenantService } from './tenant';
import { StoreConfig } from '@/types/store';

export class StoreApiService {
  private static cachedConfig: StoreConfig | null = null;

  public static async getStoreConfig(): Promise<{ data: StoreConfig }> {
    if (this.cachedConfig) {
      return { data: this.cachedConfig };
    }

    try {
      // 1. Try unified storefront bootstrap API
      const bootstrapRes = await apiClient.get<any>('/api/storefront/v1/bootstrap');
      if (bootstrapRes.data?.store) {
        const bStore = bootstrapRes.data.store;
        const bTheme = bootstrapRes.data.theme;
        const bMarket = bootstrapRes.data.market;

        const config: StoreConfig = {
          storeId: bStore.id,
          storeName: bStore.name,
          tagline: bStore.tagline || 'Contemporary Living',
          subTitle: bStore.description || '',
          logo: {
            src: bStore.logo?.url || '',
            alt: bStore.logo?.alt || bStore.name,
            width: 180,
            height: 50,
          },
          favicon: bStore.favicon || '/favicon.ico',
          currency: {
            code: bMarket?.currency || 'USD',
            symbol: bMarket?.currency === 'INR' ? '₹' : '$',
            locale: bMarket?.locale || 'en-US',
          },
          policies: {
            freeShippingThreshold: 999,
            returnWindowDays: 14,
            supportEmail: bStore.contact?.email || '',
            supportPhone: bStore.contact?.phone || '',
            whatsappNumber: bStore.contact?.phone || '',
            businessAddress: bStore.contact?.address || '',
          },
          announcements: bStore.announcements || [],
          socialLinks: bStore.socialLinks || [],
          theme: {
            primaryColor: bTheme?.primaryColor || '#111827',
            accentColor: bTheme?.accentColor || '#B77A68',
            creamColor: '#FAF6F2',
            blushColor: '#E8B8B5',
            roseGoldColor: '#B77A68',
            fontSerif: bTheme?.fontHeading || 'Playfair Display, serif',
            fontSans: bTheme?.fontBody || 'Plus Jakarta Sans, sans-serif',
          },
          brandPromises: [],
        };

        this.cachedConfig = config;
        return { data: config };
      }
    } catch (err) {
      console.warn('[StoreApiService] Bootstrap API fetch warning:', err);
    }

    // Dynamic resolution based on active tenant identity without static brand fallbacks
    const tenant = await TenantService.resolveTenant();
    const dynamicName = tenant.storeName || 'Online Store';

    const fallbackNeutralConfig: StoreConfig = {
      storeId: tenant.storeId,
      storeName: dynamicName,
      tagline: 'Artisanal Commerce',
      subTitle: '',
      logo: {
        src: '',
        alt: dynamicName,
        width: 180,
        height: 50,
      },
      favicon: '/favicon.ico',
      currency: {
        code: tenant.defaultCurrency || 'USD',
        symbol: tenant.defaultCurrency === 'INR' ? '₹' : '$',
        locale: tenant.defaultLocale || 'en-US',
      },
      policies: {
        freeShippingThreshold: 1000,
        returnWindowDays: 14,
        supportEmail: '',
        supportPhone: '',
        whatsappNumber: '',
        businessAddress: '',
      },
      announcements: [],
      socialLinks: [],
      theme: {
        primaryColor: '#111827',
        accentColor: '#B77A68',
        creamColor: '#FAF6F2',
        blushColor: '#E8B8B5',
        roseGoldColor: '#B77A68',
        fontSerif: 'Playfair Display, serif',
        fontSans: 'Plus Jakarta Sans, sans-serif',
      },
      brandPromises: [],
    };

    this.cachedConfig = fallbackNeutralConfig;
    return { data: fallbackNeutralConfig };
  }

  public static clearCache(): void {
    this.cachedConfig = null;
  }
}

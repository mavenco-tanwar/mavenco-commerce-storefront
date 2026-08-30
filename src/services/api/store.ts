import { apiClient } from './client';
import { TenantService } from './tenant';
import { StoreConfig } from '@/types/store';
import { defaultStoreConfig } from '@/data/storeConfig';

export class StoreApiService {
  private static cachedConfig: StoreConfig | null = null;

  public static async getStoreConfig(): Promise<{ data: StoreConfig }> {
    if (this.cachedConfig) {
      return { data: this.cachedConfig };
    }

    try {
      const tenant = await TenantService.resolveTenant();
      const settingsRes = await apiClient.get<any>('/api/v1/settings');
      const settings = settingsRes.data || {};

      const config: StoreConfig = {
        storeId: tenant.storeId,
        storeName: settings.storeName || tenant.storeName || 'JQ Trends',
        tagline: settings.tagline || 'Style that speaks you',
        subTitle: 'Women & Kids Fashion Boutique',
        logo: {
          src: '/images/brand/jq-trends-logo.png',
          alt: 'JQ Trends Logo',
          width: 180,
          height: 50,
        },
        favicon: '/favicon.ico',
        currency: {
          code: tenant.defaultCurrency || 'INR',
          symbol: tenant.defaultCurrency === 'INR' ? '₹' : '$',
          locale: tenant.defaultLocale || 'en-IN',
        },
        policies: {
          freeShippingThreshold: settings.freeShippingThreshold || 999,
          returnWindowDays: 7,
          supportEmail: settings.contactEmail || 'care@jqtrends.com',
          supportPhone: settings.contactPhone || '+91 98765 43210',
          whatsappNumber: '+91 98765 43210',
          businessAddress: settings.address || 'Indiranagar, Bengaluru, Karnataka - 560038, India',
        },
        announcements: [
          { id: 'ann-1', text: '✨ Free Express Doorstep Shipping on all orders above ₹999', highlightText: 'FREE SHIPPING' },
          { id: 'ann-2', text: '🌸 Fresh Festive Chanderi Silk & Linen Co-ords Released', highlightText: 'NEW DROP' },
          { id: 'ann-3', text: '🎁 Use code WELCOME200 for ₹200 OFF on your first purchase', highlightText: 'WELCOME200' },
        ],
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/jqtrends', label: 'Instagram' },
          { platform: 'facebook', url: 'https://facebook.com/jqtrends', label: 'Facebook' },
          { platform: 'whatsapp', url: 'https://wa.me/919876543210', label: 'WhatsApp' },
        ],
        theme: {
          primaryColor: tenant.theme?.tokens?.colors?.primary || '#111111',
          accentColor: tenant.theme?.tokens?.colors?.accent || '#B77A68',
          creamColor: tenant.theme?.tokens?.colors?.surface || '#FAF6F2',
          blushColor: tenant.theme?.tokens?.colors?.blush || '#E8B8B5',
          roseGoldColor: '#B77A68',
          fontSerif: 'Playfair Display, Georgia, serif',
          fontSans: 'Plus Jakarta Sans, system-ui, sans-serif',
        },
        brandPromises: defaultStoreConfig.brandPromises,
      };

      this.cachedConfig = config;
      return { data: config };
    } catch (err) {
      console.warn('[StoreApiService] Failed to load store settings from CMS, falling back to default:', err);
      this.cachedConfig = defaultStoreConfig;
      return { data: defaultStoreConfig };
    }
  }
}

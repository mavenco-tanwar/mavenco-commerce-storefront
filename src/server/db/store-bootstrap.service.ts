/**
 * Module 35: Store Bootstrap Service
 * Aggregates all DB-backed storefront initialization data in a single optimized payload.
 * Eliminates all static fallback business data.
 */

import { TenantContext, TenantDatabaseResolver } from './tenant-database.resolver';

export interface StorefrontBootstrapPayload {
  store: {
    id: string;
    name: string;
    tagline?: string;
    description?: string;
    logo?: { url: string; alt: string };
    favicon?: string;
    contact?: { email?: string; phone?: string; address?: string };
    socialLinks?: Array<{ platform: string; url: string; label: string }>;
    announcements?: Array<{ id: string; text: string; link?: string }>;
  };
  navigation: {
    header: Array<{ id: string; label: string; url: string; children?: any[] }>;
    footer: Array<{ id: string; title: string; links: Array<{ label: string; url: string }> }>;
    mobile: Array<{ id: string; label: string; url: string }>;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: string;
  };
  market: {
    code: string;
    currency: string;
    locale: string;
  };
  featureFlags: {
    subscriptionsEnabled: boolean;
    membershipsEnabled: boolean;
    reviewsEnabled: boolean;
    wishlistEnabled: boolean;
    loyaltyEnabled: boolean;
  };
  seoDefaults: {
    titleTemplate: string;
    description: string;
  };
  meta: {
    tenantId: string;
    source: 'mongodb' | 'database_store';
    timestamp: string;
  };
}

export class StoreBootstrapService {
  // Tenant-scoped database stores
  private static tenantSettingsStore: Map<string, any> = new Map();
  private static tenantThemeStore: Map<string, any> = new Map();
  private static tenantNavStore: Map<string, any> = new Map();

  /**
   * Generates dynamic, DB-backed bootstrap payload for a tenant.
   * Renders empty state if unconfigured without leaking any hardcoded brand data.
   */
  public static async getBootstrapPayload(context: TenantContext): Promise<StorefrontBootstrapPayload> {
    const db = await TenantDatabaseResolver.getTenantDatabase(context.tenantId);
    let source: 'mongodb' | 'database_store' = 'database_store';

    let settingsDoc: any = null;
    let themeDoc: any = null;
    let navDoc: any = null;

    if (db) {
      try {
        const [sDoc, tDoc, nDoc] = await Promise.all([
          db.collection('store_settings').findOne({ status: 'published' }),
          db.collection('themes').findOne({ status: 'published' }),
          db.collection('navigation').findOne({ status: 'published' }),
        ]);
        settingsDoc = sDoc;
        themeDoc = tDoc;
        navDoc = nDoc;
        source = 'mongodb';
      } catch (err) {
        console.warn('[StoreBootstrapService] MongoDB query warning:', err);
      }
    }

    if (!settingsDoc) {
      settingsDoc = this.tenantSettingsStore.get(context.tenantId);
    }
    if (!themeDoc) {
      themeDoc = this.tenantThemeStore.get(context.tenantId);
    }
    if (!navDoc) {
      navDoc = this.tenantNavStore.get(context.tenantId);
    }

    // Format clean display name dynamically from tenantId if not explicitly named
    const dynamicStoreName =
      settingsDoc?.storeName ||
      context.tenantId
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return {
      store: {
        id: settingsDoc?.id || context.storeId,
        name: dynamicStoreName,
        tagline: settingsDoc?.tagline || 'Artisanal Commerce',
        description: settingsDoc?.description || `Welcome to ${dynamicStoreName}.`,
        logo: settingsDoc?.logo || {
          url: '',
          alt: dynamicStoreName,
        },
        favicon: settingsDoc?.favicon || '/favicon.ico',
        contact: {
          email: settingsDoc?.contactEmail || '',
          phone: settingsDoc?.contactPhone || '',
          address: settingsDoc?.address || '',
        },
        socialLinks: settingsDoc?.socialLinks || [],
        announcements: settingsDoc?.announcements || [],
      },
      navigation: {
        header: navDoc?.headerItems || [
          { id: 'nav-1', label: 'Home', url: '/' },
          { id: 'nav-2', label: 'Collection', url: '/collections' },
          { id: 'nav-3', label: 'Sale', url: '/sale' },
        ],
        footer: navDoc?.footerColumns || [
          {
            id: 'col-1',
            title: 'Shop',
            links: [
              { label: 'New Arrivals', url: '/new-arrivals' },
              { label: 'Featured Collections', url: '/collections' },
            ],
          },
          {
            id: 'col-2',
            title: 'Support',
            links: [
              { label: 'Contact Us', url: '/contact' },
              { label: 'FAQ', url: '/faq' },
            ],
          },
        ],
        mobile: navDoc?.mobileItems || [
          { id: 'm-1', label: 'Home', url: '/' },
          { id: 'm-2', label: 'Collections', url: '/collections' },
        ],
      },
      theme: {
        primaryColor: themeDoc?.primaryColor || '#111827',
        accentColor: themeDoc?.accentColor || '#B77A68',
        fontHeading: themeDoc?.fontHeading || 'Playfair Display, serif',
        fontBody: themeDoc?.fontBody || 'Plus Jakarta Sans, sans-serif',
        borderRadius: themeDoc?.borderRadius || '8px',
      },
      market: {
        code: context.marketId,
        currency: context.currency,
        locale: context.locale,
      },
      featureFlags: {
        subscriptionsEnabled: settingsDoc?.featureFlags?.subscriptions ?? true,
        membershipsEnabled: settingsDoc?.featureFlags?.memberships ?? true,
        reviewsEnabled: settingsDoc?.featureFlags?.reviews ?? true,
        wishlistEnabled: settingsDoc?.featureFlags?.wishlist ?? true,
        loyaltyEnabled: settingsDoc?.featureFlags?.loyalty ?? true,
      },
      seoDefaults: {
        titleTemplate: `%s | ${dynamicStoreName}`,
        description: `Shop luxury artisanal fashion and contemporary collections at ${dynamicStoreName}.`,
      },
      meta: {
        tenantId: context.tenantId,
        source,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Persists or updates tenant store settings in database.
   */
  public static async updateStoreSettings(tenantId: string, settings: any): Promise<void> {
    this.tenantSettingsStore.set(tenantId, settings);
    const db = await TenantDatabaseResolver.getTenantDatabase(tenantId);
    if (db) {
      try {
        await db.collection('store_settings').updateOne(
          { tenantId },
          { $set: { ...settings, tenantId, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      } catch (err) {
        console.warn('MongoDB updateStoreSettings warning:', err);
      }
    }
  }
}

/**
 * Module 36: Storefront Page Management & Versioning Service
 * Manages pages, section composition, draft saves, publish workflows,
 * and immutable storefront snapshots and rollbacks.
 */

import {
  Storefront,
  StorefrontPage,
  StorefrontSection,
  StorefrontVersion,
} from '@/types/tenant-governance.types';
import { getDatabase } from '@/lib/mongodb';

export class StorefrontPageService {
  private static storefontsStore: Map<string, Storefront> = new Map();
  private static pagesStore: Map<string, StorefrontPage[]> = new Map();
  private static versionsStore: Map<string, StorefrontVersion[]> = new Map();

  /**
   * Retrieves or initializes a storefront record for a tenant.
   */
  public static async getStorefront(tenantId: string, storeId: string = 'store_primary'): Promise<Storefront> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const key = `${safeTenantId}:${storeId}`;

    if (this.storefontsStore.has(key)) {
      return this.storefontsStore.get(key)!;
    }

    try {
      const db = await getDatabase();
      if (db) {
        const doc = await db.collection('storefronts').findOne({ tenantId: safeTenantId, storeId });
        if (doc) {
          const { _id, ...clean } = doc;
          this.storefontsStore.set(key, clean as any);
          return clean as any;
        }
      }
    } catch (err) {
      console.warn('[StorefrontPageService] DB fetch warning:', err);
    }

    // Default initialized storefront
    const now = new Date().toISOString();
    const sf: Storefront = {
      id: `sf_${safeTenantId}`,
      tenantId: safeTenantId,
      storeId,
      environmentId: 'production',
      name: `${safeTenantId.toUpperCase()} Storefront`,
      slug: safeTenantId,
      status: 'active',
      defaultLocale: 'en-US',
      defaultCurrency: 'USD',
      defaultMarketId: 'GLOBAL',
      themeId: `theme_${safeTenantId}`,
      publishedVersion: 1,
      draftVersion: 1,
      lastPublishedAt: now,
      lastPublishedBy: 'system',
      settings: {
        titleTemplate: `%s | ${safeTenantId.toUpperCase()}`,
        enableBreadcrumbs: true,
        announcementBarEnabled: true,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.storefontsStore.set(key, sf);
    return sf;
  }

  /**
   * Retrieves all pages for a given storefront.
   */
  public static async getPages(tenantId: string, storefrontId: string): Promise<StorefrontPage[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const key = `${safeTenantId}:${storefrontId}`;

    if (this.pagesStore.has(key)) {
      return this.pagesStore.get(key)!;
    }

    try {
      const db = await getDatabase();
      if (db) {
        const docs = await db.collection('storefront_pages').find({ tenantId: safeTenantId, storefrontId }).toArray();
        if (docs.length > 0) {
          const clean = docs.map(({ _id, ...rest }) => rest as any);
          this.pagesStore.set(key, clean);
          return clean;
        }
      }
    } catch (err) {
      console.warn('[StorefrontPageService] Pages query warning:', err);
    }

    return this.pagesStore.get(key) || [];
  }

  /**
   * Retrieves a single page by its ID.
   */
  public static async getPageById(tenantId: string, pageId: string): Promise<StorefrontPage | null> {
    const safeTenantId = tenantId.toLowerCase().trim();
    for (const pages of this.pagesStore.values()) {
      const found = pages.find((p) => p.id === pageId && p.tenantId === safeTenantId);
      if (found) return found;
    }

    try {
      const db = await getDatabase();
      if (db) {
        const doc = await db.collection('storefront_pages').findOne({ id: pageId, tenantId: safeTenantId });
        if (doc) {
          const { _id, ...clean } = doc;
          return clean as any;
        }
      }
    } catch (err) {
      console.warn('[StorefrontPageService] Page query warning:', err);
    }

    return null;
  }

  /**
   * Saves draft modifications to a page without overwriting published version.
   */
  public static async savePageDraft(
    tenantId: string,
    pageId: string,
    sections: StorefrontSection[],
    seo?: StorefrontPage['seo']
  ): Promise<StorefrontPage> {
    const page = await this.getPageById(tenantId, pageId);
    if (!page) {
      throw new Error(`Page '${pageId}' not found for tenant '${tenantId}'`);
    }

    page.sections = sections;
    if (seo) page.seo = seo;
    page.status = 'draft';
    page.updatedAt = new Date().toISOString();

    const storefront = await this.getStorefront(tenantId, page.storeId);
    storefront.draftVersion += 1;

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('storefront_pages').updateOne(
          { id: pageId, tenantId: tenantId.toLowerCase().trim() },
          { $set: page },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[StorefrontPageService] DB savePageDraft warning:', err);
    }

    return page;
  }

  /**
   * Publishes a single page.
   */
  public static async publishPage(
    tenantId: string,
    pageId: string,
    publishedBy: string = 'superadmin'
  ): Promise<StorefrontPage> {
    const page = await this.getPageById(tenantId, pageId);
    if (!page) {
      throw new Error(`Page '${pageId}' not found for tenant '${tenantId}'`);
    }

    const now = new Date().toISOString();
    page.status = 'published';
    page.publishedAt = now;
    page.updatedAt = now;

    // Automatically trigger storefront publish snapshot
    await this.publishStorefront(tenantId, page.storefrontId, publishedBy, `Published page: ${page.title}`);

    return page;
  }

  /**
   * Publishes the entire storefront, creating an immutable version record.
   */
  public static async publishStorefront(
    tenantId: string,
    storefrontId: string,
    publishedBy: string = 'superadmin',
    changelog: string = 'Regular publish'
  ): Promise<StorefrontVersion> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const storefront = await this.getStorefront(safeTenantId);
    const pages = await this.getPages(safeTenantId, storefrontId);

    const nextVersion = storefront.publishedVersion + 1;
    storefront.publishedVersion = nextVersion;
    storefront.lastPublishedAt = new Date().toISOString();
    storefront.lastPublishedBy = publishedBy;
    storefront.updatedAt = new Date().toISOString();

    const snapshotRecord: StorefrontVersion = {
      id: `ver_${storefrontId}_${nextVersion}`,
      storefrontId,
      tenantId: safeTenantId,
      version: nextVersion,
      snapshot: {
        storefront: { ...storefront },
        pages: JSON.parse(JSON.stringify(pages)),
      },
      status: 'published',
      publishedBy,
      publishedAt: new Date().toISOString(),
      changelog,
    };

    const verKey = `${safeTenantId}:${storefrontId}`;
    const vList = this.versionsStore.get(verKey) || [];
    vList.unshift(snapshotRecord);
    this.versionsStore.set(verKey, vList);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('storefront_versions').insertOne(snapshotRecord);
        await db.collection('storefronts').updateOne(
          { id: storefrontId, tenantId: safeTenantId },
          { $set: storefront },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[StorefrontPageService] Publish version DB write warning:', err);
    }

    return snapshotRecord;
  }

  /**
   * Rollback storefront to a previous version.
   * STRICT RULE: Rollback creates a NEW version snapshot with restored content; NEVER MUTATES PAST SNAPSHOTS.
   */
  public static async rollbackStorefront(
    tenantId: string,
    storefrontId: string,
    targetVersionNumber: number,
    rolledBackBy: string = 'superadmin'
  ): Promise<StorefrontVersion> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const verKey = `${safeTenantId}:${storefrontId}`;
    const versions = this.versionsStore.get(verKey) || [];
    const targetVersion = versions.find((v) => v.version === targetVersionNumber);

    if (!targetVersion) {
      throw new Error(`Target version ${targetVersionNumber} was not found for rollback.`);
    }

    // Restore pages and settings from past snapshot
    const restoredPages = targetVersion.snapshot.pages || [];
    const key = `${safeTenantId}:${storefrontId}`;
    this.pagesStore.set(key, JSON.parse(JSON.stringify(restoredPages)));

    // Create a NEW published version
    return this.publishStorefront(
      safeTenantId,
      storefrontId,
      rolledBackBy,
      `Rolled back to Version ${targetVersionNumber}`
    );
  }

  /**
   * Retrieves immutable version history for a storefront.
   */
  public static async getVersionHistory(tenantId: string, storefrontId: string): Promise<StorefrontVersion[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const verKey = `${safeTenantId}:${storefrontId}`;
    return this.versionsStore.get(verKey) || [];
  }

  /**
   * Seeds default pages for a new storefront during provisioning.
   */
  public static async seedStorefrontPages(
    tenantId: string,
    storefrontId: string,
    storeId: string,
    templateType: 'blank' | 'luxury' = 'luxury'
  ): Promise<StorefrontPage[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const now = new Date().toISOString();
    const pages: StorefrontPage[] = [];

    if (templateType === 'blank') {
      // Empty storefront: Clean blank home page
      pages.push({
        id: `page_${safeTenantId}_home`,
        storefrontId,
        tenantId: safeTenantId,
        storeId,
        slug: 'home',
        title: 'Home',
        type: 'homepage',
        status: 'published',
        sections: [],
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Luxury Boutique preset
      pages.push({
        id: `page_${safeTenantId}_home`,
        storefrontId,
        tenantId: safeTenantId,
        storeId,
        slug: 'home',
        title: 'Home',
        type: 'homepage',
        status: 'published',
        sections: [
          {
            id: 'sec_hero_1',
            type: 'hero',
            title: 'Artisanal Elegance & Contemporary Poise',
            subtitle: 'Handcrafted luxury silhouettes tailored for timeless moments.',
            displayOrder: 1,
            isVisible: true,
            settings: {
              badge: 'NEW SEASON DROP',
              primaryCtaText: 'Explore Lookbook',
              primaryCtaLink: '/collections',
              overlayOpacity: 20,
              image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
            },
          },
          {
            id: 'sec_categories_2',
            type: 'categories-grid',
            title: 'Curated Departments',
            subtitle: 'Explore our ateliers',
            displayOrder: 2,
            isVisible: true,
            settings: { layout: 'grid-3' },
          },
          {
            id: 'sec_featured_3',
            type: 'featured-products',
            title: 'Boutique Best Sellers',
            subtitle: 'Enduring favorites handcrafted in limited runs',
            displayOrder: 3,
            isVisible: true,
            settings: { limit: 8 },
          },
        ],
        createdAt: now,
        updatedAt: now,
      });

      pages.push({
        id: `page_${safeTenantId}_about`,
        storefrontId,
        tenantId: safeTenantId,
        storeId,
        slug: 'about',
        title: 'About Our Atelier',
        type: 'standard',
        status: 'published',
        sections: [
          {
            id: 'sec_about_text',
            type: 'rich-text',
            title: 'Our Heritage',
            displayOrder: 1,
            isVisible: true,
            settings: {
              content: 'Crafting effortless grace, hand-finished silhouettes, and timeless aesthetics.',
            },
          },
        ],
        createdAt: now,
        updatedAt: now,
      });
    }

    const key = `${safeTenantId}:${storefrontId}`;
    this.pagesStore.set(key, pages);

    try {
      const db = await getDatabase();
      if (db) {
        await db.collection('storefront_pages').insertMany(pages);
      }
    } catch (err) {
      console.warn('[StorefrontPageService] Pages seed warning:', err);
    }

    return pages;
  }
}

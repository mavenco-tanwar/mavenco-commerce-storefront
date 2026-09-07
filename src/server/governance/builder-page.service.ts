/**
 * Visual Page Builder Service & Persistence Engine
 * Enforces:
 * 1. Strict Tenant Isolation (pages, versions, components, templates).
 * 2. In-memory high-speed cache with MongoDB persistence.
 * 3. Immutable version snapshots on publish.
 * 4. Safe rollbacks and draft updates.
 */

import {
  PageBuilderDocument,
  PageVersionSnapshot,
  ReusableComponent,
  PageTemplate,
} from '@/types/builder.types';
import { TenantDatabaseResolver } from '@/server/db/tenant-database.resolver';
import { getDatabase } from '@/lib/mongodb';
import { SYSTEM_TEMPLATES } from '@/lib/builder/template-presets';

export class BuilderPageService {
  private static pagesStore: Map<string, PageBuilderDocument[]> = new Map();
  private static versionsStore: Map<string, PageVersionSnapshot[]> = new Map();
  private static componentsStore: Map<string, ReusableComponent[]> = new Map();
  private static templatesStore: Map<string, PageTemplate[]> = new Map();

  /**
   * Retrieves all builder pages for a tenant.
   */
  public static async getPages(tenantId: string): Promise<PageBuilderDocument[]> {
    const safeTenantId = tenantId.toLowerCase().trim();

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        const docs = await tenantDb.collection('cms_pages').find({}).toArray();
        if (docs.length > 0) {
          const clean = docs.map(({ _id, ...rest }) => rest as any);
          this.pagesStore.set(safeTenantId, clean);
          return clean;
        }
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB getPages warning:', err);
    }

    return this.pagesStore.get(safeTenantId) || [];
  }

  /**
   * Retrieves a single builder page by ID or slug for a given tenant.
   */
  public static async getPageById(tenantId: string, pageIdOrSlug: string): Promise<PageBuilderDocument | null> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const cleanId = pageIdOrSlug.replace(/^\//, '').toLowerCase().trim();

    // Check memory store
    const cachedPages = this.pagesStore.get(safeTenantId) || [];
    const found = cachedPages.find(
      (p) => p.id === cleanId || p.slug === cleanId || p.slug === `/${cleanId}`
    );
    if (found) return found;

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        const doc = await tenantDb.collection('cms_pages').findOne({
          $or: [{ id: cleanId }, { slug: cleanId }, { slug: `/${cleanId}` }],
        });
        if (doc) {
          const { _id, ...clean } = doc;
          return clean as any;
        }
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB getPageById warning:', err);
    }

    return null;
  }

  /**
   * Saves or creates a page draft.
   */
  public static async saveDraft(tenantId: string, pageDoc: PageBuilderDocument): Promise<PageBuilderDocument> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const now = new Date().toISOString();

    const cleanSlug = (pageDoc.slug || 'page').replace(/^\//, '').toLowerCase().trim();
    const updated: PageBuilderDocument = {
      ...pageDoc,
      tenantId: safeTenantId,
      slug: cleanSlug,
      status: pageDoc.status || 'draft',
      version: pageDoc.version || 1,
      updatedAt: now,
    };

    // Update in-memory store
    const list = this.pagesStore.get(safeTenantId) || [];
    const existingIdx = list.findIndex((p) => p.id === updated.id || p.slug === cleanSlug);
    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.push(updated);
    }
    this.pagesStore.set(safeTenantId, list);

    // Persist to MongoDB
    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        await tenantDb.collection('cms_pages').updateOne(
          { $or: [{ id: updated.id }, { slug: cleanSlug }] },
          { $set: updated },
          { upsert: true }
        );
      }
      const primaryDb = await getDatabase();
      if (primaryDb) {
        await primaryDb.collection('cms_pages').updateOne(
          {
            $and: [
              { $or: [{ id: updated.id }, { slug: cleanSlug }] },
              { $or: [{ tenantId: safeTenantId }, { tenantSlug: safeTenantId }] },
            ],
          },
          { $set: { ...updated, tenantSlug: safeTenantId } },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB saveDraft warning:', err);
    }

    return updated;
  }

  /**
   * Publishes a page and creates an immutable snapshot.
   */
  public static async publishPage(
    tenantId: string,
    pageId: string,
    publishedBy: string = 'admin',
    changelog: string = 'Regular publish'
  ): Promise<{ page: PageBuilderDocument; version: PageVersionSnapshot }> {
    const page = await this.getPageById(tenantId, pageId);
    if (!page) {
      throw new Error(`Page "${pageId}" not found for tenant "${tenantId}"`);
    }

    const now = new Date().toISOString();
    const nextVersion = (page.publishedVersion || page.version || 0) + 1;

    page.status = 'published';
    page.publishedVersion = nextVersion;
    page.publishedContent = page.content;
    page.publishedAt = now;
    page.updatedAt = now;

    // Create immutable snapshot
    const snapshot: PageVersionSnapshot = {
      id: `ver_${page.id}_${nextVersion}`,
      pageId: page.id,
      tenantId: tenantId.toLowerCase().trim(),
      version: nextVersion,
      title: page.title,
      content: page.publishedContent,
      seo: page.seo,
      author: publishedBy,
      changelog,
      createdAt: now,
    };

    // Save snapshot in memory
    const key = `${tenantId.toLowerCase().trim()}:${page.id}`;
    const vList = this.versionsStore.get(key) || [];
    vList.unshift(snapshot);
    this.versionsStore.set(key, vList);

    // Save page update in memory
    await this.saveDraft(tenantId, page);

    // Persist snapshot to MongoDB
    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(tenantId);
      if (tenantDb) {
        await tenantDb.collection('builder_page_versions').insertOne(snapshot);
      }
      const primaryDb = await getDatabase();
      if (primaryDb) {
        await primaryDb.collection('builder_page_versions').insertOne(snapshot);
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB publishPage warning:', err);
    }

    return { page, version: snapshot };
  }

  /**
   * Unpublishes a page back to draft status.
   */
  public static async unpublishPage(tenantId: string, pageId: string): Promise<PageBuilderDocument> {
    const page = await this.getPageById(tenantId, pageId);
    if (!page) {
      throw new Error(`Page "${pageId}" not found for tenant "${tenantId}"`);
    }

    page.status = 'draft';
    page.updatedAt = new Date().toISOString();
    return this.saveDraft(tenantId, page);
  }

  /**
   * Deletes a page from both memory and MongoDB.
   */
  public static async deletePage(tenantId: string, pageId: string): Promise<boolean> {
    const safeTenantId = tenantId.toLowerCase().trim();

    const list = this.pagesStore.get(safeTenantId) || [];
    this.pagesStore.set(
      safeTenantId,
      list.filter((p) => p.id !== pageId && p.slug !== pageId)
    );

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        await tenantDb.collection('cms_pages').deleteOne({
          $or: [{ id: pageId }, { slug: pageId }],
        });
      }
      const primaryDb = await getDatabase();
      if (primaryDb) {
        await primaryDb.collection('cms_pages').deleteOne({
          $and: [
            { $or: [{ id: pageId }, { slug: pageId }] },
            { $or: [{ tenantId: safeTenantId }, { tenantSlug: safeTenantId }] },
          ],
        });
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB deletePage warning:', err);
    }

    return true;
  }

  /**
   * Retrieves revision snapshots for a page.
   */
  public static async getVersions(tenantId: string, pageId: string): Promise<PageVersionSnapshot[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const key = `${safeTenantId}:${pageId}`;

    const memoryVersions = this.versionsStore.get(key) || [];
    if (memoryVersions.length > 0) {
      return memoryVersions;
    }

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        const docs = await tenantDb
          .collection('builder_page_versions')
          .find({ pageId })
          .sort({ version: -1 })
          .toArray();
        if (docs.length > 0) {
          const clean = docs.map(({ _id, ...rest }) => rest as any);
          this.versionsStore.set(key, clean);
          return clean;
        }
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB getVersions warning:', err);
    }

    return memoryVersions;
  }

  /**
   * Restores an active page draft to a historical version snapshot.
   */
  public static async restoreVersion(
    tenantId: string,
    pageId: string,
    versionNumber: number
  ): Promise<PageBuilderDocument> {
    const versions = await this.getVersions(tenantId, pageId);
    const target = versions.find((v) => v.version === versionNumber);
    if (!target) {
      throw new Error(`Version ${versionNumber} not found for page "${pageId}"`);
    }

    const page = await this.getPageById(tenantId, pageId);
    if (!page) {
      throw new Error(`Page "${pageId}" not found`);
    }

    page.content = JSON.parse(JSON.stringify(target.content));
    if (target.seo) page.seo = JSON.parse(JSON.stringify(target.seo));
    page.updatedAt = new Date().toISOString();

    return this.saveDraft(tenantId, page);
  }

  /**
   * Reusable Components Methods.
   */
  public static async getComponents(tenantId: string): Promise<ReusableComponent[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const cached = this.componentsStore.get(safeTenantId) || [];
    if (cached.length > 0) return cached;

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        const docs = await tenantDb.collection('builder_reusable_components').find({}).toArray();
        if (docs.length > 0) {
          const clean = docs.map(({ _id, ...rest }) => rest as any);
          this.componentsStore.set(safeTenantId, clean);
          return clean;
        }
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB getComponents warning:', err);
    }

    return cached;
  }

  public static async saveComponent(tenantId: string, comp: ReusableComponent): Promise<ReusableComponent> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const list = this.componentsStore.get(safeTenantId) || [];
    list.unshift(comp);
    this.componentsStore.set(safeTenantId, list);

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        await tenantDb.collection('builder_reusable_components').insertOne(comp);
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB saveComponent warning:', err);
    }

    return comp;
  }

  public static async deleteComponent(tenantId: string, compId: string): Promise<boolean> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const list = this.componentsStore.get(safeTenantId) || [];
    this.componentsStore.set(
      safeTenantId,
      list.filter((c) => c.id !== compId)
    );

    try {
      const tenantDb = await TenantDatabaseResolver.getTenantDatabase(safeTenantId);
      if (tenantDb) {
        await tenantDb.collection('builder_reusable_components').deleteOne({ id: compId });
      }
    } catch (err) {
      console.warn('[BuilderPageService] DB deleteComponent warning:', err);
    }

    return true;
  }

  /**
   * Templates Methods.
   */
  public static async getTemplates(tenantId: string): Promise<PageTemplate[]> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const custom = this.templatesStore.get(safeTenantId) || [];
    return [...SYSTEM_TEMPLATES, ...custom];
  }

  public static async saveTemplate(tenantId: string, template: PageTemplate): Promise<PageTemplate> {
    const safeTenantId = tenantId.toLowerCase().trim();
    const list = this.templatesStore.get(safeTenantId) || [];
    list.unshift(template);
    this.templatesStore.set(safeTenantId, list);
    return template;
  }
}

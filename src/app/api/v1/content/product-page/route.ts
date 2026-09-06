import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultPdpConfig, PDP_PRESET_TEMPLATES } from '@/lib/pdp-presets';
import { ProductPageConfig } from '@/types/pdp-template.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * GET /api/v1/content/product-page?tenant=slug&template=id&preview=draft
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = (searchParams.get('tenant') || 'lumina').toLowerCase().trim();
    const templateId = searchParams.get('template') || 'default_fashion';
    const isPreview = searchParams.get('preview') === 'draft' || searchParams.get('status') === 'draft';

    const db = await getDatabase();
    if (db) {
      const tenantMatchConditions = [
        { tenantSlug: tenant },
        { tenantId: tenant },
        { storeSlug: tenant },
        { tenantId: `store_${tenant}` },
        { storeId: `store_${tenant}` },
      ];

      // 1. Authoritative check in product_page_templates collection
      const doc = await db.collection('product_page_templates').findOne({
        $and: [
          { $or: tenantMatchConditions },
          { templateId: templateId },
        ],
      });

      if (doc) {
        const activeConfig = isPreview && doc.draft ? doc.draft : doc.published || doc.draft;
        if (activeConfig) {
          return NextResponse.json(
            {
              success: true,
              data: activeConfig,
              draft: doc.draft || doc.published,
              published: doc.published,
              templateId: doc.templateId || templateId,
              isDefault: doc.isDefault ?? true,
              updatedAt: doc.updatedAt,
              source: 'product_page_templates',
            },
            { headers: NO_CACHE_HEADERS }
          );
        }
      }

      // 2. Fallback check in cms_pages collection
      const cmsDoc = await db.collection('cms_pages').findOne({
        $and: [
          { type: 'product-page' },
          { $or: tenantMatchConditions },
        ],
      });

      if (cmsDoc?.config) {
        return NextResponse.json(
          {
            success: true,
            data: cmsDoc.config,
            draft: cmsDoc.config,
            published: cmsDoc.config,
            templateId: templateId,
            isDefault: true,
            updatedAt: cmsDoc.updatedAt,
            source: 'cms_pages',
          },
          { headers: NO_CACHE_HEADERS }
        );
      }
    }

    // 3. Preset Fallback
    const fallbackPreset = PDP_PRESET_TEMPLATES[templateId]?.config || getDefaultPdpConfig(tenant);
    return NextResponse.json(
      {
        success: true,
        data: fallbackPreset,
        draft: fallbackPreset,
        published: fallbackPreset,
        templateId: templateId,
        isDefault: true,
        fallback: true,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Failed to fetch PDP template:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * POST /api/v1/content/product-page
 * Body: { tenant: string, templateId: string, status: 'draft' | 'published', config: ProductPageConfig, isDefault?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant = 'lumina',
      templateId = 'default_fashion',
      status = 'published',
      config,
      isDefault,
    } = body;

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Missing configuration' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanTenant = String(tenant).toLowerCase().trim();
    const db = await getDatabase();
    if (db) {
      const collection = db.collection('product_page_templates');
      const now = new Date().toISOString();

      const updateDoc: any = {
        updatedAt: now,
        tenantSlug: cleanTenant,
        tenantId: cleanTenant,
        templateId: templateId,
      };

      if (isDefault !== undefined) {
        updateDoc.isDefault = isDefault;
      }

      if (status === 'published') {
        updateDoc.published = config;
        updateDoc.draft = config;
        updateDoc.publishedAt = now;

        // Archive into versions collection
        await db.collection('product_page_versions').insertOne({
          tenantSlug: cleanTenant,
          tenantId: cleanTenant,
          templateId: templateId,
          config: config,
          versionId: `ver_${Date.now()}`,
          publishedAt: now,
          summary: 'Published from Visual PDP Builder Studio',
        });

        // Mirror to cms_pages for universal CMS interoperability
        await db.collection('cms_pages').updateOne(
          {
            type: 'product-page',
            $or: [
              { tenantSlug: cleanTenant },
              { tenantId: cleanTenant },
              { storeSlug: cleanTenant },
              { tenantId: `store_${cleanTenant}` },
            ],
          },
          {
            $set: {
              type: 'product-page',
              tenantSlug: cleanTenant,
              tenantId: cleanTenant,
              title: `PDP Template (${cleanTenant})`,
              config: config,
              status: 'published',
              updatedAt: now,
            },
          },
          { upsert: true }
        );
      } else {
        updateDoc.draft = config;
      }

      // Upsert into product_page_templates
      await collection.updateOne(
        {
          templateId: templateId,
          $or: [
            { tenantSlug: cleanTenant },
            { tenantId: cleanTenant },
            { storeSlug: cleanTenant },
            { tenantId: `store_${cleanTenant}` },
          ],
        },
        { $set: updateDoc },
        { upsert: true }
      );

      return NextResponse.json(
        {
          success: true,
          message: `PDP template ${templateId} saved as ${status}`,
          data: config,
          status,
          updatedAt: now,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB unavailable, simulated local response',
        data: config,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Failed to save PDP template:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

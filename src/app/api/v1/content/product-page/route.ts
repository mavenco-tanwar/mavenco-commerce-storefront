import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getDefaultPdpConfig, PDP_PRESET_TEMPLATES } from '@/lib/pdp-presets';
import { ProductPageConfig } from '@/types/pdp-template.types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/content/product-page?tenant=slug&template=id
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenant = searchParams.get('tenant') || 'lumina';
    const templateId = searchParams.get('template') || 'default_fashion';

    const db = await getDatabase();
    if (db) {
      const doc = await db.collection('product_page_templates').findOne({
        tenantSlug: tenant,
        templateId: templateId,
      });

      if (doc?.published) {
        return NextResponse.json({
          success: true,
          data: doc.published,
          draft: doc.draft || doc.published,
          templateId: doc.templateId,
          isDefault: doc.isDefault ?? true,
          updatedAt: doc.updatedAt,
        });
      }
    }

    // Preset Fallback
    const fallbackPreset = PDP_PRESET_TEMPLATES[templateId]?.config || getDefaultPdpConfig(tenant);
    return NextResponse.json({
      success: true,
      data: fallbackPreset,
      draft: fallbackPreset,
      templateId: templateId,
      isDefault: true,
      fallback: true,
    });
  } catch (error: any) {
    console.error('Failed to fetch PDP template:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
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
    const { tenant = 'lumina', templateId = 'default_fashion', status = 'published', config, isDefault } = body;

    if (!config) {
      return NextResponse.json({ success: false, error: 'Missing configuration' }, { status: 400 });
    }

    const db = await getDatabase();
    if (db) {
      const collection = db.collection('product_page_templates');
      const now = new Date().toISOString();

      const updateDoc: any = {
        updatedAt: now,
        tenantSlug: tenant,
        templateId: templateId,
      };

      if (isDefault !== undefined) {
        updateDoc.isDefault = isDefault;
      }

      if (status === 'published') {
        updateDoc.published = config;
        updateDoc.draft = config;
        updateDoc.publishedAt = now;

        // Archive into versions
        await db.collection('product_page_versions').insertOne({
          tenantSlug: tenant,
          templateId: templateId,
          config: config,
          versionId: `ver_${Date.now()}`,
          publishedAt: now,
          summary: 'Published from Visual PDP Builder Studio',
        });
      } else {
        updateDoc.draft = config;
      }

      await collection.updateOne(
        { tenantSlug: tenant, templateId: templateId },
        { $set: updateDoc },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: `PDP template ${templateId} saved as ${status}`,
        data: config,
        status,
        updatedAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB unavailable, simulated local response',
      data: config,
    });
  } catch (error: any) {
    console.error('Failed to save PDP template:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

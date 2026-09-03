import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-API-Key, X-Store-ID',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

let memoryTenants: any[] = [];

export async function GET() {
  try {
    const db = await getDatabase();
    let tenants: any[] = [];

    if (db) {
      const collection = db.collection('platform_tenants_registry');
      const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
      tenants = docs.map(({ _id, ...rest }) => rest as any);
      memoryTenants = tenants;
    } else {
      tenants = memoryTenants;
    }

    return NextResponse.json({
      success: true,
      data: tenants,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    const now = new Date().toISOString();
    const tenantId = body.slug || `tenant_${Date.now()}`;

    const newTenant = {
      tenantId,
      slug: body.slug || `tenant-${Date.now()}`,
      name: body.name || 'New Enterprise Tenant',
      tagline: body.tagline || 'Modern Commerce Store',
      status: body.status || 'active',
      databaseIdentifier: `db_tenant_${tenantId}_prod`,
      planId: body.planId || 'plan_starter',
      planName: body.planName || 'Starter Boutique',
      storesCount: 1,
      customDomainsCount: 1,
      mrrMinor: body.mrrMinor || 29900,
      health: 'healthy',
      theme: body.theme || {
        primaryColor: '#0F172A',
        accentColor: '#E11D48',
        secondaryColor: '#FFFFFF',
        headingFont: 'Playfair Display',
        bodyFont: 'Plus Jakarta Sans',
        borderRadius: 'md',
        layoutPreset: 'flagship_luxury',
        headerLayout: 'glassmorphism_mega',
        footerLayout: 'editorial_4_column',
        productCardStyle: 'minimal_hover_zoom',
      },
      features: body.features || {},
      ownerName: body.ownerName || 'Store Owner',
      ownerEmail: body.ownerEmail || 'owner@platform.com',
      currency: body.currency || 'USD',
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('platform_tenants_registry').insertOne(newTenant);
    }
    memoryTenants.unshift(newTenant);

    return NextResponse.json({
      success: true,
      data: newTenant,
      message: `Tenant '${newTenant.name}' provisioned and registered successfully!`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const targetId = (body.tenantId || body.id || body.slug || '').toLowerCase().trim();
    const safeSlug = targetId.replace(/^store_/, '');
    const db = await getDatabase();

    const updates: any = {};
    if (body.action) {
      updates.status = body.action === 'suspend' ? 'suspended' : body.action === 'restore' ? 'active' : 'maintenance';
    }
    if (body.status) updates.status = body.status;
    if (body.name) updates.name = body.name;
    if (body.tagline) updates.tagline = body.tagline;
    if (body.planId) updates.planId = body.planId;
    if (body.planName) updates.planName = body.planName;
    if (body.ownerName) updates.ownerName = body.ownerName;
    if (body.ownerEmail) updates.ownerEmail = body.ownerEmail;
    if (body.currency) updates.currency = body.currency;
    if (body.theme) updates.theme = body.theme;
    if (body.features) updates.features = body.features;
    updates.updatedAt = new Date().toISOString();

    if (db) {
      await db.collection('platform_tenants_registry').updateOne(
        { $or: [{ tenantId: targetId }, { slug: targetId }, { tenantId: safeSlug }, { slug: safeSlug }] },
        { $set: updates }
      );
    }

    const idx = memoryTenants.findIndex(
      (t) => (t.tenantId || '').toLowerCase() === targetId || (t.slug || '').toLowerCase() === targetId || (t.slug || '').toLowerCase() === safeSlug
    );
    if (idx >= 0) {
      memoryTenants[idx] = {
        ...memoryTenants[idx],
        ...updates,
      };
    }

    return NextResponse.json({
      success: true,
      data: idx >= 0 ? memoryTenants[idx] : updates,
      message: `Tenant '${safeSlug}' configuration updated successfully.`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deleteAll = searchParams.get('all') === 'true';
    let targetId = searchParams.get('tenantId') || searchParams.get('id') || searchParams.get('slug');

    if (!targetId && !deleteAll) {
      try {
        const body = await req.json();
        targetId = body.tenantId || body.id || body.slug;
      } catch {}
    }

    if (!targetId && !deleteAll) {
      return NextResponse.json(
        { success: false, error: 'tenantId or slug is required for deletion' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const cleanTargetId = (targetId || '').toLowerCase().trim();
    const safeSlug = cleanTargetId.replace(/^store_/, '');

    const db = await getDatabase();
    let deletedCount = 0;

    if (deleteAll) {
      if (db) {
        const res = await db.collection('platform_tenants_registry').deleteMany({});
        deletedCount = res.deletedCount;
        await db.collection('tenant_module_entitlements').deleteMany({});
        await db.collection('tenant_roles').deleteMany({});
        await db.collection('storefronts').deleteMany({});
        await db.collection('storefront_pages').deleteMany({});
        await db.collection('storefront_versions').deleteMany({});
        await db.collection('stores').deleteMany({});
      }
      memoryTenants = [];
      return NextResponse.json(
        {
          success: true,
          deletedCount,
          message: 'All platform tenants and isolated database records have been completely purged from MongoDB.',
        },
        { headers: corsHeaders() }
      );
    }

    // Filter memory registry
    memoryTenants = memoryTenants.filter((t) => {
      const tid = (t.tenantId || t.id || t.slug || '').toLowerCase();
      const tslug = (t.slug || '').toLowerCase();
      return tid !== cleanTargetId && tslug !== cleanTargetId && tid !== safeSlug && tslug !== safeSlug;
    });

    if (db) {
      // 1. Delete from platform_tenants_registry
      const deleteResult = await db.collection('platform_tenants_registry').deleteMany({
        $or: [
          { tenantId: cleanTargetId },
          { slug: cleanTargetId },
          { id: cleanTargetId },
          { tenantId: safeSlug },
          { slug: safeSlug },
        ],
      });
      deletedCount = deleteResult.deletedCount;

      // 2. Cascade cleanup from platform governance & storefront collections
      await db.collection('tenant_module_entitlements').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('tenant_roles').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefronts').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_pages').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('storefront_versions').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });
      await db.collection('stores').deleteMany({
        $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }],
      });

      // 3. Drop isolated dedicated database for this tenant
      try {
        const client = await getMongoClient();
        if (client) {
          await client.db(`tenant_${safeSlug}`).dropDatabase();
        }
      } catch (dropErr) {
        console.warn(`[DELETE /platform/tenants] Could not drop database tenant_${safeSlug}:`, dropErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        deletedCount,
        deletedTenantId: safeSlug,
        message: `Tenant '${safeSlug}' and all its isolated database records have been permanently deleted from MongoDB.`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}


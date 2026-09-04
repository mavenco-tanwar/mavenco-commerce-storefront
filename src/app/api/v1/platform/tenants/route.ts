import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getMongoClient } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tenant-slug, X-Tenant-Slug, x-tenant, x-store-slug, x-store-id, x-user-name, X-Store-ID, X-API-Key, x-api-key, *',
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
      // Primary DB source: read directly from 'tenants' collection
      let docs = await db.collection('tenants').find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();

      // If 'tenants' collection is empty, check 'platform_tenants_registry'
      if (docs.length === 0) {
        docs = await db.collection('platform_tenants_registry').find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).toArray();
      }

      tenants = docs.map(({ _id, ...t }: any) => ({
        id: t.id || `store_${t.slug}`,
        tenantId: t.tenantId || t.slug,
        slug: t.slug,
        name: t.name,
        code: t.code || (t.name ? t.name.substring(0, 4).toUpperCase() : 'STOR'),
        tagline: t.tagline || 'Modern Commerce Store',
        status: t.status || 'active',
        planId: t.planId || 'plan_starter',
        planName: t.planName || 'Starter Boutique',
        databaseName: t.databaseName || `tenant_${t.slug}`,
        databaseIdentifier: t.databaseIdentifier || `db_tenant_${t.slug}_prod`,
        currency: t.currency || 'USD',
        ownerName: t.ownerName || t.adminName || 'Store Owner',
        ownerEmail: t.ownerEmail || t.contact?.email || t.email || '',
        primaryDomain: t.primaryDomain || `${t.slug}.com`,
        theme: t.theme || {
          primaryColor: '#0F172A',
          accentColor: '#E11D48',
          secondaryColor: '#FFFFFF',
          headingFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans',
          borderRadius: 'md',
          layoutPreset: 'flagship_luxury',
        },
        features: t.features || {},
        metrics: t.metrics || {
          products: 12,
          orders: 0,
          customers: 0,
          monthlyRevenue: 0,
          storageUsedMb: 12,
        },
        createdAt: t.createdAt || new Date().toISOString(),
        updatedAt: t.updatedAt || new Date().toISOString(),
        ...t,
      }));

      memoryTenants = tenants;
    } else {
      tenants = memoryTenants;
    }

    return NextResponse.json({
      success: true,
      data: tenants,
      count: tenants.length,
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
    const cleanSlug = (body.slug || `tenant-${Date.now()}`).toLowerCase().trim();
    const tenantId = body.tenantId || cleanSlug;

    const cleanPassword = body.temporaryPassword || body.password || `Mavenco@2026!${cleanSlug}`;
    const cleanIsTemp = body.isTemporaryPassword !== undefined ? body.isTemporaryPassword : true;

    const newTenant = {
      id: body.id || `store_${cleanSlug}`,
      tenantId,
      slug: cleanSlug,
      name: body.name || 'New Enterprise Tenant',
      code: body.code || (body.name ? body.name.substring(0, 4).toUpperCase() : 'STOR'),
      tagline: body.tagline || 'Modern Commerce Store',
      status: body.status || 'active',
      databaseName: `tenant_${cleanSlug}`,
      databaseIdentifier: `db_tenant_${cleanSlug}_prod`,
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
      ownerName: body.ownerName || body.adminName || 'Store Owner',
      ownerEmail: body.ownerEmail ? body.ownerEmail.toLowerCase().trim() : (body.email ? body.email.toLowerCase().trim() : ''),
      currency: body.currency || 'USD',
      currencySymbol: body.currency === 'INR' ? '₹' : '$',
      primaryDomain: body.primaryDomain || `${cleanSlug}.com`,
      password: cleanPassword,
      temporaryPassword: cleanPassword,
      isTemporaryPassword: cleanIsTemp,
      passwordUpdatedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      const tenantMatch = {
        $or: [
          { slug: cleanSlug },
          { id: body.id || `store_${cleanSlug}` },
          { tenantId },
        ],
      };

      // Synchronize write to both 'tenants' and 'platform_tenants_registry'
      await Promise.all([
        db.collection('tenants').updateOne(tenantMatch, { $set: newTenant, $setOnInsert: { createdAt: now } }, { upsert: true }),
        db.collection('platform_tenants_registry').updateOne(tenantMatch, { $set: newTenant, $setOnInsert: { createdAt: now } }, { upsert: true }),
      ]);

      // Synchronize/upsert store owner in 'users' collection
      const ownerEmail = body.ownerEmail ? body.ownerEmail.toLowerCase().trim() : null;
      if (ownerEmail) {
        await db.collection('users').updateOne(
          { email: ownerEmail },
          {
            $set: {
              email: ownerEmail,
              name: body.ownerName || body.name || 'Store Owner',
              firstName: body.ownerName ? body.ownerName.split(' ')[0] : body.name || 'Store',
              lastName: body.ownerName ? body.ownerName.split(' ').slice(1).join(' ') || 'Owner' : 'Owner',
              roleId: 'role_owner',
              role: 'owner',
              roleName: 'Store Owner & Administrator',
              tenantId: body.id || `store_${cleanSlug}`,
              tenantSlug: cleanSlug,
              password: cleanPassword,
              temporaryPassword: cleanPassword,
              isTemporaryPassword: cleanIsTemp,
              status: body.status || 'active',
              passwordUpdatedAt: now,
              updatedAt: now,
            },
            $setOnInsert: {
              id: `user_${ownerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
              createdAt: now,
            },
          },
          { upsert: true }
        );
      }
    }

    memoryTenants.unshift(newTenant);

    return NextResponse.json({
      success: true,
      data: newTenant,
      message: `Tenant '${newTenant.name}' provisioned and synchronized successfully across database collections!`,
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
    const now = new Date().toISOString();

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
    if (body.currency) {
      updates.currency = body.currency;
      updates.currencySymbol = body.currency === 'INR' ? '₹' : '$';
    }
    if (body.theme) updates.theme = body.theme;
    if (body.features) updates.features = body.features;
    if (body.password || body.temporaryPassword) {
      const pass = body.password || body.temporaryPassword;
      updates.password = pass;
      updates.temporaryPassword = pass;
      updates.isTemporaryPassword = body.isTemporaryPassword !== undefined ? body.isTemporaryPassword : false;
      updates.passwordUpdatedAt = now;
    }
    updates.updatedAt = now;

    const filter = {
      $or: [
        { slug: targetId },
        { id: targetId },
        { tenantId: targetId },
        { slug: safeSlug },
        { id: `store_${safeSlug}` },
      ],
    };

    if (db) {
      // Synchronize updates across both 'tenants' and 'platform_tenants_registry'
      await Promise.all([
        db.collection('tenants').updateMany(filter, { $set: updates }),
        db.collection('platform_tenants_registry').updateMany(filter, { $set: updates }),
      ]);

      // If password or owner details updated, also synchronize users collection
      const cleanOwnerEmail = (body.ownerEmail || body.email || '').toLowerCase().trim();
      if (updates.password || cleanOwnerEmail) {
        const userFilter: any[] = [];
        if (cleanOwnerEmail) userFilter.push({ email: cleanOwnerEmail });
        if (safeSlug) userFilter.push({ tenantSlug: safeSlug });

        if (userFilter.length > 0) {
          const userUpdates: any = { updatedAt: now };
          if (updates.password) {
            userUpdates.password = updates.password;
            userUpdates.temporaryPassword = updates.temporaryPassword;
            userUpdates.isTemporaryPassword = updates.isTemporaryPassword;
            userUpdates.passwordUpdatedAt = now;
          }
          if (updates.ownerName) userUpdates.name = updates.ownerName;
          if (cleanOwnerEmail) userUpdates.email = cleanOwnerEmail;
          if (safeSlug) userUpdates.tenantSlug = safeSlug;

          await db.collection('users').updateMany({ $or: userFilter }, { $set: userUpdates });
        }
      }
    }

    const idx = memoryTenants.findIndex(
      (t) =>
        (t.tenantId || '').toLowerCase() === targetId ||
        (t.slug || '').toLowerCase() === targetId ||
        (t.slug || '').toLowerCase() === safeSlug
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
      message: `Tenant '${safeSlug}' configuration updated across all database collections.`,
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
        const [r1, r2] = await Promise.all([
          db.collection('tenants').deleteMany({}),
          db.collection('platform_tenants_registry').deleteMany({}),
        ]);
        deletedCount = (r1.deletedCount || 0) + (r2.deletedCount || 0);
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

    memoryTenants = memoryTenants.filter((t) => {
      const tid = (t.tenantId || t.id || t.slug || '').toLowerCase();
      const tslug = (t.slug || '').toLowerCase();
      return tid !== cleanTargetId && tslug !== cleanTargetId && tid !== safeSlug && tslug !== safeSlug;
    });

    const filter = {
      $or: [
        { slug: cleanTargetId },
        { id: cleanTargetId },
        { tenantId: cleanTargetId },
        { slug: safeSlug },
        { id: `store_${safeSlug}` },
      ],
    };

    if (db) {
      // Synchronize deletion across both 'tenants' and 'platform_tenants_registry'
      const [delTenants, delRegistry] = await Promise.all([
        db.collection('tenants').deleteMany(filter),
        db.collection('platform_tenants_registry').deleteMany(filter),
      ]);
      deletedCount = delTenants.deletedCount || delRegistry.deletedCount || 0;

      await Promise.all([
        db.collection('tenant_module_entitlements').deleteMany({ $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }] }),
        db.collection('tenant_roles').deleteMany({ $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }] }),
        db.collection('storefronts').deleteMany({ $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }] }),
        db.collection('storefront_pages').deleteMany({ $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }] }),
        db.collection('storefront_versions').deleteMany({ $or: [{ tenantId: cleanTargetId }, { tenantId: safeSlug }] }),
        db.collection('stores').deleteMany({ $or: [{ slug: cleanTargetId }, { slug: safeSlug }] }),
      ]);
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Tenant '${safeSlug}' deleted completely from MongoDB.`,
    }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

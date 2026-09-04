import 'server-only';
import { getDatabase } from '@/lib/mongodb';
import { TenantBrandConfig } from '@/lib/tenant-config';

export async function checkTenantValidityDb(slug?: string): Promise<{
  isValid: boolean;
  isSuspended: boolean;
  config: TenantBrandConfig | null;
}> {
  if (!slug) return { isValid: false, isSuspended: false, config: null };
  const clean = slug.toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      // 1. Primary check in 'tenants' collection
      const doc = await db.collection('tenants').findOne({
        $or: [
          { slug: clean },
          { id: clean },
          { id: `store_${clean}` },
          { primaryDomain: clean },
          { 'domains.domain': clean },
        ],
      });

      if (doc) {
        if (doc.status === 'deleted' || doc.deletedAt) {
          return { isValid: false, isSuspended: false, config: null };
        }
        if (doc.status === 'suspended') {
          return { isValid: true, isSuspended: true, config: null };
        }
        const { _id, ...cleanConfig } = doc;
        return {
          isValid: true,
          isSuspended: false,
          config: cleanConfig as TenantBrandConfig,
        };
      }

      // 2. Secondary check in 'platform_tenants_registry'
      const regDoc = await db.collection('platform_tenants_registry').findOne({
        $or: [
          { slug: clean },
          { tenantId: clean },
          { id: clean },
        ],
      });

      if (regDoc) {
        if (regDoc.status === 'deleted' || regDoc.deletedAt) {
          return { isValid: false, isSuspended: false, config: null };
        }
        if (regDoc.status === 'suspended') {
          return { isValid: true, isSuspended: true, config: null };
        }
        const { _id, ...cleanReg } = regDoc;
        return {
          isValid: true,
          isSuspended: false,
          config: cleanReg as any,
        };
      }

      // Database is connected and store was NOT found in either collection -> DELETED / INVALID
      return { isValid: false, isSuspended: false, config: null };
    }
  } catch (err) {
    console.warn('MongoDB tenant check warning:', err);
  }

  // If database was completely unreachable, only permit 'demo'
  if (clean === 'demo') {
    return {
      isValid: true,
      isSuspended: false,
      config: {
        id: 'store_demo',
        name: 'Demo Store',
        slug: 'demo',
        tagline: 'Platform Reference Implementation',
        description: 'Verified demo store',
        currency: 'USD',
        currencySymbol: '$',
        theme: {
          primaryColor: '#0F172A',
          secondaryColor: '#F8FAFC',
          accentColor: '#E11D48',
          headingFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans',
        },
        contact: { phone: '', email: '', whatsapp: '', address: '' },
        announcements: { leftCallout: '', mainText: '', highlightText: '', link: '' },
        navLinks: [],
        footerShopLinks: [],
        footerCareLinks: [],
      },
    };
  }

  return { isValid: false, isSuspended: false, config: null };
}

export async function resolveRequestTenantSlug(
  req: { headers: Headers | { get(key: string): string | null } },
  searchParams?: URLSearchParams,
  db?: any
): Promise<string> {
  const fromQuery = searchParams?.get('tenant') || searchParams?.get('store') || searchParams?.get('tenantId');
  const fromHeader =
    req.headers.get('x-tenant-slug') ||
    req.headers.get('x-store-slug') ||
    req.headers.get('x-tenant-id') ||
    req.headers.get('x-store-id') ||
    req.headers.get('x-store');

  const raw = (fromQuery || fromHeader || '').trim();
  if (raw) {
    const cleaned = raw.replace(/^store_/, '').replace(/^store-/, '').replace(/_/g, '-').toLowerCase();
    if (cleaned && cleaned !== 'all' && cleaned !== 'demo' && cleaned !== 'lumina') {
      return cleaned;
    }
  }

  // Default fallback: return 'jq-trends' or the active tenant
  if (db) {
    try {
      const defaultTenant = await db.collection('tenants').findOne({
        slug: 'jq-trends',
        status: { $ne: 'deleted' },
      });
      if (defaultTenant?.slug) return defaultTenant.slug.toLowerCase().trim();

      const activeDoc = await db.collection('tenants').findOne(
        { status: { $ne: 'deleted' } },
        { sort: { createdAt: 1 } }
      );
      if (activeDoc?.slug) {
        return activeDoc.slug.toLowerCase().trim();
      }
    } catch {}
  }

  return 'jq-trends';
}

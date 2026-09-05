export interface TenantBrandConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  currency: string;
  currencySymbol: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    taglineColor?: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
  };
  announcements: {
    leftCallout: string;
    mainText: string;
    highlightText: string;
    link: string;
  };
  navLinks: {
    label: string;
    href: string;
    badge?: string;
  }[];
  footerShopLinks: {
    label: string;
    href: string;
  }[];
  footerCareLinks: {
    label: string;
    href: string;
  }[];
}

export const SEED_TENANTS: Record<string, TenantBrandConfig> = {};

export function formatStoreName(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function createDefaultTenantBrandConfig(slug: string): TenantBrandConfig {
  const clean = slug.toLowerCase().trim();
  const displayName = formatStoreName(clean);

  return {
    id: `store_${clean}`,
    name: displayName,
    slug: clean,
    tagline: 'Contemporary Commerce & Apparel',
    description: `Welcome to ${displayName}. Premium storefront powered by Mavenco Commerce platform.`,
    currency: 'INR',
    currencySymbol: '₹',
    theme: {
      primaryColor: '#0F172A',
      secondaryColor: '#F8FAFC',
      accentColor: '#6366F1',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
      address: '',
    },
    announcements: {
      leftCallout: '',
      mainText: '',
      highlightText: '',
      link: '',
    },
    navLinks: [],
    footerShopLinks: [],
    footerCareLinks: [],
  };
}

const archivedTenantsSet = new Set<string>();
const suspendedTenantsSet = new Set<string>();

export function unarchiveTenantSlug(slug: string) {
  const clean = slug.toLowerCase().trim();
  archivedTenantsSet.delete(clean);

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('jq_archived_tenants') || '[]';
      const arr = JSON.parse(stored).filter((s: string) => s !== clean);
      localStorage.setItem('jq_archived_tenants', JSON.stringify(arr));
    } catch {}
  }

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/archived_tenants.json';
      if (fs.existsSync(tmpPath)) {
        const arr = JSON.parse(fs.readFileSync(tmpPath, 'utf-8')).filter((s: string) => s !== clean);
        fs.writeFileSync(tmpPath, JSON.stringify(arr), 'utf-8');
      }
    } catch {}
  }
}

export function archiveTenantSlug(slug: string) {
  const clean = slug.toLowerCase().trim();
  archivedTenantsSet.add(clean);
  dynamicTenantsMap.delete(clean);

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/archived_tenants.json';
      let existing: string[] = [];
      if (fs.existsSync(tmpPath)) {
        existing = JSON.parse(fs.readFileSync(tmpPath, 'utf-8'));
      }
      if (!existing.includes(clean)) {
        existing.push(clean);
        fs.writeFileSync(tmpPath, JSON.stringify(existing), 'utf-8');
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('jq_archived_tenants') || '[]';
      const arr = JSON.parse(stored);
      if (!arr.includes(clean)) {
        arr.push(clean);
        localStorage.setItem('jq_archived_tenants', JSON.stringify(arr));
      }
    } catch {}
  }
}

export function suspendTenantSlug(slug: string, suspend = true) {
  const clean = slug.toLowerCase().trim();
  if (suspend) {
    suspendedTenantsSet.add(clean);
  } else {
    suspendedTenantsSet.delete(clean);
  }
}

export function checkTenantValidity(slug?: string): {
  isValid: boolean;
  isSuspended: boolean;
  config: TenantBrandConfig | null;
} {
  if (!slug) return { isValid: false, isSuspended: false, config: null };
  const clean = slug.toLowerCase().trim();

  // Explicitly archived or deleted stores in memory
  if (archivedTenantsSet.has(clean)) {
    return { isValid: false, isSuspended: false, config: null };
  }

  // Server disk check for archived list
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/archived_tenants.json';
      if (fs.existsSync(tmpPath)) {
        const arr = JSON.parse(fs.readFileSync(tmpPath, 'utf-8'));
        if (Array.isArray(arr) && arr.includes(clean)) {
          return { isValid: false, isSuspended: false, config: null };
        }
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('jq_archived_tenants');
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.includes(clean)) {
          return { isValid: false, isSuspended: false, config: null };
        }
      }
    } catch {}
  }

  // Verified platform seed tenant
  if (SEED_TENANTS[clean]) {
    const isSuspended = suspendedTenantsSet.has(clean);
    return {
      isValid: true,
      isSuspended,
      config: SEED_TENANTS[clean],
    };
  }

  // Dynamic memory registered tenant
  if (dynamicTenantsMap.has(clean)) {
    const isSuspended = suspendedTenantsSet.has(clean);
    return {
      isValid: true,
      isSuspended,
      config: dynamicTenantsMap.get(clean)!,
    };
  }

  // Browser storage check
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`tenant_config_${clean}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) {
          dynamicTenantsMap.set(clean, parsed);
          const isSuspended = suspendedTenantsSet.has(clean);
          return {
            isValid: true,
            isSuspended,
            config: parsed,
          };
        }
      }
    } catch {}
  }

  // Server disk check
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = `/tmp/store_${clean}_tenant_config.json`;
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed?.name) {
          dynamicTenantsMap.set(clean, parsed);
          const isSuspended = suspendedTenantsSet.has(clean);
          return {
            isValid: true,
            isSuspended,
            config: parsed,
          };
        }
      }
    } catch {}
  }

  // Store is not registered, or has been deleted -> 404 Inactive
  return {
    isValid: false,
    isSuspended: false,
    config: null,
  };
}

// Mutable store in memory
const dynamicTenantsMap = new Map<string, TenantBrandConfig>();

export function getTenantConfig(slug?: string): TenantBrandConfig {
  const clean = (slug || 'demo').toLowerCase().trim();
  if (dynamicTenantsMap.has(clean)) {
    return dynamicTenantsMap.get(clean)!;
  }

  // Server disk check
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = `/tmp/store_${clean}_tenant_config.json`;
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed?.name) {
          dynamicTenantsMap.set(clean, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  // Browser storage check
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`tenant_config_${clean}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) {
          dynamicTenantsMap.set(clean, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  const base = SEED_TENANTS[clean] || createDefaultTenantBrandConfig(clean);
  dynamicTenantsMap.set(clean, base);
  return base;
}

export function updateTenantConfig(slug: string, updates: Partial<TenantBrandConfig> & { status?: string }): TenantBrandConfig {
  const clean = slug.toLowerCase().trim();
  unarchiveTenantSlug(clean);
  if (updates.status === 'suspended') {
    suspendTenantSlug(clean, true);
  } else if (updates.status === 'active') {
    suspendTenantSlug(clean, false);
  }
  const current = getTenantConfig(clean);
  const merged: TenantBrandConfig = {
    ...current,
    ...updates,
    theme: {
      ...current.theme,
      ...(updates.theme || {}),
    },
    contact: {
      ...current.contact,
      ...(updates.contact || {}),
    },
    announcements: {
      ...current.announcements,
      ...(updates.announcements || {}),
    },
  };

  dynamicTenantsMap.set(clean, merged);

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = `/tmp/store_${clean}_tenant_config.json`;
      fs.writeFileSync(tmpPath, JSON.stringify(merged, null, 2), 'utf-8');
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`tenant_config_${clean}`, JSON.stringify(merged));
    } catch {}
  }

  return merged;
}

export function resolveTenant(tenantParam?: string | null): TenantBrandConfig {
  if (tenantParam) {
    const clean = tenantParam.toLowerCase().trim();
    if (typeof window !== 'undefined') {
      try {
        document.cookie = `jq_active_tenant=${clean}; path=/; max-age=604800; SameSite=Lax`;
        localStorage.setItem('jq_active_tenant', clean);
      } catch {}
    }
    return getTenantConfig(clean);
  }

  // Browser check for URL path, query param, or hostname
  if (typeof window !== 'undefined') {
    // 1. Check path for /stores/[slug]
    const pathMatch = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      const slug = pathMatch[2].toLowerCase();
      try {
        document.cookie = `jq_active_tenant=${slug}; path=/; max-age=604800; SameSite=Lax`;
        localStorage.setItem('jq_active_tenant', slug);
      } catch {}
      return getTenantConfig(slug);
    }

    // 2. Check query param ?tenant=slug
    const urlParams = new URLSearchParams(window.location.search);
    const qTenant = urlParams.get('tenant');
    if (qTenant) {
      const slug = qTenant.toLowerCase().trim();
      try {
        document.cookie = `jq_active_tenant=${slug}; path=/; max-age=604800; SameSite=Lax`;
        localStorage.setItem('jq_active_tenant', slug);
      } catch {}
      return getTenantConfig(slug);
    }

    // 3. Check domain / subdomain
    const host = window.location.hostname.toLowerCase();
    if (host.includes('lumina') || host.startsWith('lumina.')) return getTenantConfig('lumina');
    if (host.includes('auraliving') || host.startsWith('auraliving.')) return getTenantConfig('auraliving');
    if (host.includes('apexathletics') || host.startsWith('apexathletics.')) return getTenantConfig('apexathletics');
    if (host.includes('jqtrends') || host.startsWith('jqtrends.')) return getTenantConfig('jqtrends'); // audit:ignore - Domain hostname routing rule

    // 4. Check cookie
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, val] = cookie.trim().split('=');
        if (name === 'jq_active_tenant' && val) {
          return getTenantConfig(val);
        }
      }
    } catch {}

    // 5. Check localStorage fallback
    try {
      const stored = localStorage.getItem('jq_active_tenant');
      if (stored) {
        return getTenantConfig(stored);
      }
    } catch {}
  }

  return getTenantConfig('demo');
}

export function resolveActiveTenantSlug(
  pathname?: string | null,
  searchParams?: { get: (k: string) => string | null } | null,
  explicitSlug?: string | null
): string {
  if (explicitSlug && explicitSlug.trim()) {
    return explicitSlug.toLowerCase().trim();
  }
  if (pathname) {
    const pathMatch = pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch && pathMatch[2]) {
      return pathMatch[2].toLowerCase().trim();
    }
  }
  if (searchParams) {
    const q = searchParams.get('tenant');
    if (q && q.trim()) {
      return q.toLowerCase().trim();
    }
  }
  return 'demo';
}

/**
 * Automatically scopes internal storefront links to the active tenant store
 * (e.g. /collections/festive -> /stores/demo/collections/festive)
 */
export function formatTenantHref(href?: string, explicitTenant?: string): string {
  if (!href) return '/';
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    href.startsWith('javascript:')
  ) {
    return href;
  }

  // Determine active tenant slug
  let tenant = (explicitTenant || '').toLowerCase().trim();
  if (!tenant && typeof window !== 'undefined') {
    const pathMatch = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      tenant = pathMatch[2].toLowerCase().trim();
    } else {
      const qTenant = new URLSearchParams(window.location.search).get('tenant');
      if (qTenant) tenant = qTenant.toLowerCase().trim();
    }
  }

  if (!tenant) return href;

  // Rewrite any legacy collections?category=xyz to format 2: /[category] (or /stores/[tenant]/[category])
  if (href.includes('collections?category=') || href.includes('?category=')) {
    const legacyCatMatch = href.match(/[?&]category=([^&#]+)/);
    if (legacyCatMatch && legacyCatMatch[1]) {
      const rawCat = decodeURIComponent(legacyCatMatch[1]).replace(/^\/+/, '');
      const storeMatch = href.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
      if (storeMatch) {
        return `/${storeMatch[1]}/${storeMatch[2]}/${cleanCategorySlug(rawCat)}`;
      }
      href = `/${cleanCategorySlug(rawCat)}`;
    }
  }

  // Don't prefix external or already-prefixed store paths
  if (href.startsWith('/stores/') || href.startsWith('/tenant/')) {
    return href;
  }

  // SaaS administrative & billing paths that shouldn't be prefixed
  if (
    href.startsWith('/api/') ||
    href.startsWith('/pricing') ||
    href.startsWith('/admin') ||
    href.startsWith('/superadmin') ||
    href.startsWith('/cms')
  ) {
    return href;
  }

  if (href === '/' || href === '') {
    return `/stores/${tenant}`;
  }

  const cleanPath = href.startsWith('/') ? href : `/${href}`;
  return `/stores/${tenant}${cleanPath}`;
}

/**
 * Sanitizes category slug, stripping database prefixes and tenant suffixes
 * (e.g. cat_clothestees_gever -> clothestees, cat_womens-t-shirt_jq-trends -> womens-t-shirt)
 */
export function cleanCategorySlug(cat?: string): string {
  if (!cat) return 'collection';
  let clean = String(cat).toLowerCase().trim();
  if (clean.startsWith('cat_')) {
    clean = clean.replace(/^cat_/, '');
    const lastUnderscore = clean.lastIndexOf('_');
    if (lastUnderscore !== -1) {
      clean = clean.substring(0, lastUnderscore);
    }
  }
  // Strip any remaining trailing tenant slug like _gever
  clean = clean.replace(/_[a-z0-9-]+$/, '');
  return clean || 'collection';
}

/**
 * Automatically scopes product links to the nested category URL:
 * /stores/[tenant]/[category]/[productSlug] (e.g. /stores/gever/clothestees/fffff)
 * or fallback: /[category]/[productSlug]
 */
export function formatProductHref(
  productSlug: string,
  category?: string,
  explicitTenant?: string
): string {
  if (!productSlug) return '/';
  const cleanCat = cleanCategorySlug(category);
  const cleanSlug = productSlug.startsWith('/') ? productSlug.slice(1) : productSlug;

  // Determine active tenant slug
  let tenant = (explicitTenant || '').toLowerCase().trim();
  if (!tenant && typeof window !== 'undefined') {
    const pathMatch = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      tenant = pathMatch[2].toLowerCase().trim();
    } else {
      const qTenant = new URLSearchParams(window.location.search).get('tenant');
      if (qTenant) tenant = qTenant.toLowerCase().trim();
    }
  }

  if (tenant) {
    return `/stores/${tenant}/${cleanCat}/${cleanSlug}`;
  }

  return `/${cleanCat}/${cleanSlug}`;
}

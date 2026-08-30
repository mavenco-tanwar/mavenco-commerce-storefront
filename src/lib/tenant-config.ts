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

export const SEED_TENANTS: Record<string, TenantBrandConfig> = {
  jqtrends: {
    id: 'store_jq_trends',
    name: 'JQ Trends',
    slug: 'jqtrends',
    tagline: 'Style that speaks you',
    description:
      'Artisanal women and kids festive wear crafted from pure chanderi and mulmul silk. Effortless luxury designed for timeless celebrations.',
    currency: 'INR',
    currencySymbol: '₹',
    theme: {
      primaryColor: '#111111',
      secondaryColor: '#FFFDFC',
      accentColor: '#B77A68',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'care@jqtrends.com',
      whatsapp: '919876543210',
      address: 'Boutique Atelier, Designer District, Mumbai, India',
    },
    announcements: {
      leftCallout: 'Affordable Luxury Fashion',
      mainText: 'New Season Atelier Drops Live Now •',
      highlightText: 'EXPLORE FRESH ARRIVALS',
      link: '/new-arrivals',
    },
    navLinks: [
      { label: 'WOMEN', href: '/women' },
      { label: 'KIDS', href: '/kids' },
      { label: 'NEW IN', href: '/new-arrivals', badge: 'Fresh' },
      { label: 'COLLECTIONS', href: '/collections/festive' },
      { label: 'SALE', href: '/sale' },
    ],
    footerShopLinks: [
      { label: "Women's Haute Couture", href: '/women' },
      { label: 'Little Royals Festive Line', href: '/kids' },
      { label: 'Chanderi Kurti Sets', href: '/women?category=kurtis' },
      { label: 'Linen Co-ords', href: '/women?category=co-ords' },
      { label: 'Festive Atelier Sale (20% Off)', href: '/sale' },
    ],
    footerCareLinks: [
      { label: 'About JQ Trends', href: '/about-us' },
      { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
      { label: 'Returns & Doorstep Exchanges', href: '/return-policy' },
      { label: 'Concierge & WhatsApp Help', href: '/contact' },
      { label: 'Track Your Order', href: '/account' },
    ],
  },
  auraliving: {
    id: 'store_aura_living',
    name: 'Aura Living',
    slug: 'auraliving',
    tagline: 'Mindful Nordic Sanctuary',
    description:
      'Scandinavian minimalist home objects, small-batch ceramic tableware, and Belgian organic linens for calm, conscious living.',
    currency: 'USD',
    currencySymbol: '$',
    theme: {
      primaryColor: '#1B4332',
      secondaryColor: '#FAF3E0',
      accentColor: '#74C69D',
      headingFont: 'Cinzel, serif',
      bodyFont: 'Inter, sans-serif',
    },
    contact: {
      phone: '+1 (555) 392-8192',
      email: 'hello@auraliving.com',
      whatsapp: '15553928192',
      address: 'Studio Sanctuary, Copenhagen / Stockholm Design House',
    },
    announcements: {
      leftCallout: 'Sustainable Nordic Living',
      mainText: 'Spring Living Refresh • 15% OFF with code NORDIC15 •',
      highlightText: 'SHOP SANCTUARY',
      link: '/sale',
    },
    navLinks: [
      { label: 'LIVING ROOM', href: '/women' },
      { label: 'CERAMICS', href: '/kids' },
      { label: 'ORGANIC LINENS', href: '/new-arrivals', badge: 'Eco' },
      { label: 'LIGHTING', href: '/collections/lighting' },
      { label: 'SANCTUARY SALE', href: '/sale' },
    ],
    footerShopLinks: [
      { label: 'Sculptural Ceramic Vases', href: '/women' },
      { label: 'Belgian Organic Linens', href: '/kids' },
      { label: 'Ambient Travertine Lighting', href: '/new-arrivals' },
      { label: 'Solid Oak Living Furniture', href: '/collections/lighting' },
      { label: 'Sustainable Home Sale', href: '/sale' },
    ],
    footerCareLinks: [
      { label: 'Our Nordic Philosophy', href: '/about-us' },
      { label: 'Carbon-Neutral Shipping', href: '/shipping-policy' },
      { label: 'Artisan Ceramic Care Guide', href: '/return-policy' },
      { label: 'Architect & Trade Program', href: '/contact' },
      { label: 'Track Order', href: '/account' },
    ],
  },
  apexathletics: {
    id: 'store_apex_athletics',
    name: 'Apex Athletics',
    slug: 'apexathletics',
    tagline: 'Engineered for Peak Performance',
    description:
      'High-performance compression sportswear, carbon-plated marathon footwear, and thermo-regulating activewear tested by elite triathletes.',
    currency: 'USD',
    currencySymbol: '$',
    theme: {
      primaryColor: '#0A0A0A',
      secondaryColor: '#161822',
      accentColor: '#00F5D4',
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Inter, sans-serif',
    },
    contact: {
      phone: '+1 (800) 492-APEX',
      email: 'support@apexathletics.com',
      whatsapp: '18004922739',
      address: 'Apex High-Performance Lab, Boulder, CO, USA',
    },
    announcements: {
      leftCallout: 'Championship Athletic Gear',
      mainText: 'Apex Pro 2026 Drops Live • Flat 20% OFF with code APEXPRO20 •',
      highlightText: 'CLAIM ATHLETE PASS',
      link: '/sale',
    },
    navLinks: [
      { label: "MEN'S TRAINING", href: '/women' },
      { label: "WOMEN'S ACTIVE", href: '/kids' },
      { label: 'COMPRESSION PRO', href: '/new-arrivals', badge: 'PRO' },
      { label: 'CARBON FOOTWEAR', href: '/collections/footwear' },
      { label: 'ATHLETE PASS', href: '/sale' },
    ],
    footerShopLinks: [
      { label: 'Aero Compression Tops', href: '/women' },
      { label: 'Carbon-Stride Running Shoes', href: '/kids' },
      { label: 'Seamless Performance Leggings', href: '/new-arrivals' },
      { label: 'Thermo-Regulating Hoodies', href: '/collections/footwear' },
      { label: 'Athlete Outlet (20% Off)', href: '/sale' },
    ],
    footerCareLinks: [
      { label: 'Apex Lab Science', href: '/about-us' },
      { label: 'Global Express Dispatch', href: '/shipping-policy' },
      { label: '30-Day Trial & Exchanges', href: '/return-policy' },
      { label: 'Athlete Sponsorship & Team', href: '/contact' },
      { label: 'Track Shipment', href: '/account' },
    ],
  },
  demo: {
    id: 'store_demo',
    name: 'Demo Store',
    slug: 'demo',
    tagline: 'Curated Modern Lifestyle & Apparel',
    description:
      'A generic demonstration storefront showcasing the power of the Mavenco Commerce SaaS Engine with real-time visual CMS, dynamic theme tokens, and edge rendering.',
    currency: 'USD',
    currencySymbol: '$',
    theme: {
      primaryColor: '#0F172A',
      secondaryColor: '#F8FAFC',
      accentColor: '#6366F1',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    contact: {
      phone: '+1 (800) 555-DEMO',
      email: 'demo@mavenco.com',
      whatsapp: '18005553366',
      address: 'Mavenco Global Commerce Lab, CA, USA',
    },
    announcements: {
      leftCallout: 'Live Interactive Demo Store',
      mainText: 'Experience Real-Time Headless Commerce •',
      highlightText: 'EXPLORE DEMO',
      link: '/sale',
    },
    navLinks: [
      { label: 'NEW ARRIVALS', href: '/new-arrivals', badge: 'Fresh' },
      { label: 'APPAREL', href: '/women' },
      { label: 'LIFESTYLE', href: '/kids' },
      { label: 'COLLECTIONS', href: '/collections/festive' },
      { label: 'SALE', href: '/sale' },
    ],
    footerShopLinks: [
      { label: 'Curated Apparel', href: '/women' },
      { label: 'Design Objects & Living', href: '/kids' },
      { label: 'New Season Lookbook', href: '/new-arrivals' },
      { label: 'Limited Capsule', href: '/collections/festive' },
      { label: 'Special Offers', href: '/sale' },
    ],
    footerCareLinks: [
      { label: 'About This Demo Store', href: '/about-us' },
      { label: 'Global Shipping Simulation', href: '/shipping-policy' },
      { label: 'Returns & Exchanges', href: '/return-policy' },
      { label: 'Client Support Concierge', href: '/contact' },
      { label: 'Order Tracking', href: '/account' },
    ],
  },
};

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
    tagline: 'Curated Modern Lifestyle & Apparel',
    description: `Welcome to ${displayName}. A curated modern storefront showcasing seasonal apparel, lifestyle essentials, and contemporary designs.`,
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
      phone: '+91 98765 43210',
      email: `care@${clean.replace(/_/g, '-')}.com`,
      whatsapp: '919876543210',
      address: 'Mavenco Global Commerce Studio, CA / Delhi',
    },
    announcements: {
      leftCallout: `Welcome to ${displayName}`,
      mainText: 'New Season Atelier Drops Live Now • Complimentary Doorstep Delivery •',
      highlightText: 'EXPLORE NEW IN',
      link: '/new-arrivals',
    },
    navLinks: [
      { label: 'NEW ARRIVALS', href: '/new-arrivals', badge: 'Fresh' },
      { label: 'APPAREL', href: '/women' },
      { label: 'LIFESTYLE', href: '/kids' },
      { label: 'COLLECTIONS', href: '/collections/festive' },
      { label: 'SALE', href: '/sale' },
    ],
    footerShopLinks: [
      { label: 'Curated Apparel', href: '/women' },
      { label: 'Lifestyle & Living', href: '/kids' },
      { label: 'New Season Lookbook', href: '/new-arrivals' },
      { label: 'Limited Capsule', href: '/collections/festive' },
      { label: 'Special Offers', href: '/sale' },
    ],
    footerCareLinks: [
      { label: `About ${displayName}`, href: '/about-us' },
      { label: 'Shipping & Delivery Policy', href: '/shipping-policy' },
      { label: 'Returns & Exchanges', href: '/return-policy' },
      { label: 'Client Support Concierge', href: '/contact' },
      { label: 'Track Your Order', href: '/account' },
    ],
  };
}

const archivedTenantsSet = new Set<string>(['tanwar-tailor', 'muskan-bhati', 'jqtrends']);
const suspendedTenantsSet = new Set<string>();

export function archiveTenantSlug(slug: string) {
  const clean = slug.toLowerCase().trim();
  archivedTenantsSet.add(clean);

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/archived_tenants.json';
      let existing: string[] = ['tanwar-tailor', 'muskan-bhati', 'jqtrends'];
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

  // Explicitly suspended stores
  const isSuspended = suspendedTenantsSet.has(clean);

  // Return valid with config
  return {
    isValid: true,
    isSuspended,
    config: getTenantConfig(clean),
  };
}

// Mutable store in memory
const dynamicTenantsMap = new Map<string, TenantBrandConfig>();

export function getTenantConfig(slug?: string): TenantBrandConfig {
  const clean = (slug || 'jqtrends').toLowerCase().trim();
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

export function updateTenantConfig(slug: string, updates: Partial<TenantBrandConfig>): TenantBrandConfig {
  const clean = slug.toLowerCase().trim();
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
    return getTenantConfig(clean);
  }

  // Browser check for URL path, query param, or hostname
  if (typeof window !== 'undefined') {
    // 1. Check path for /stores/[slug]
    const pathMatch = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      const slug = pathMatch[2].toLowerCase();
      return getTenantConfig(slug);
    }

    // 2. Check query param ?tenant=slug
    const urlParams = new URLSearchParams(window.location.search);
    const qTenant = urlParams.get('tenant');
    if (qTenant) {
      return getTenantConfig(qTenant);
    }

    // 3. Check domain / subdomain
    const host = window.location.hostname.toLowerCase();
    if (host.includes('auraliving') || host.startsWith('auraliving.')) return getTenantConfig('auraliving');
    if (host.includes('apexathletics') || host.startsWith('apexathletics.')) return getTenantConfig('apexathletics');
    if (host.includes('jqtrends') || host.startsWith('jqtrends.')) return getTenantConfig('jqtrends');

    // 4. Check cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'jq_active_tenant' && val) {
        return getTenantConfig(val);
      }
    }
  }

  return getTenantConfig('jqtrends');
}

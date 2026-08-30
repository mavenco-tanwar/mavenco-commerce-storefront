export interface TenantBrandConfig {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  navLinks: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

export const SEED_TENANTS: Record<string, TenantBrandConfig> = {
  jqtrends: {
    id: 'store_jq_trends',
    name: 'JQ Trends',
    slug: 'jqtrends',
    tagline: 'Affordable Luxury Women & Kids Fashion',
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
    },
    navLinks: [
      { label: 'WOMEN', href: '/women' },
      { label: 'KIDS', href: '/kids' },
      { label: 'NEW IN', href: '/new-arrivals', badge: 'Fresh' },
      { label: 'COLLECTIONS', href: '/collections/festive' },
      { label: 'SALE', href: '/sale' },
    ],
  },
  auraliving: {
    id: 'store_aura_living',
    name: 'Aura Living',
    slug: 'auraliving',
    tagline: 'Minimalist Scandinavian Home Decor & Lifestyle',
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
    },
    navLinks: [
      { label: 'LIVING ROOM', href: '/living' },
      { label: 'CERAMICS', href: '/ceramics' },
      { label: 'LIGHTING', href: '/lighting', badge: 'Eco' },
      { label: 'FURNITURE', href: '/furniture' },
      { label: 'OFFERS', href: '/sale' },
    ],
  },
  apexathletics: {
    id: 'store_apex_athletics',
    name: 'Apex Athletics',
    slug: 'apexathletics',
    tagline: 'High-Performance Activewear & Compression Gear',
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
    },
    navLinks: [
      { label: 'MEN PERFORMANCE', href: '/men' },
      { label: 'WOMEN ATHLETIC', href: '/women' },
      { label: 'COMPRESSION', href: '/compression', badge: 'PRO' },
      { label: 'FOOTWEAR', href: '/footwear' },
      { label: 'OUTLET', href: '/sale' },
    ],
  },
};

export function resolveTenant(tenantParam?: string | null): TenantBrandConfig {
  if (tenantParam) {
    const clean = tenantParam.toLowerCase().trim();
    if (SEED_TENANTS[clean]) return SEED_TENANTS[clean];
  }

  // Browser check for query param or hostname
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const qTenant = urlParams.get('tenant');
    if (qTenant && SEED_TENANTS[qTenant.toLowerCase()]) {
      return SEED_TENANTS[qTenant.toLowerCase()];
    }

    const host = window.location.hostname.toLowerCase();
    if (host.includes('auraliving')) return SEED_TENANTS.auraliving;
    if (host.includes('apexathletics')) return SEED_TENANTS.apexathletics;
  }

  return SEED_TENANTS.jqtrends;
}

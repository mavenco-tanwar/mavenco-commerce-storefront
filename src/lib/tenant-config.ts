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
};

export function resolveTenant(tenantParam?: string | null): TenantBrandConfig {
  if (tenantParam) {
    const clean = tenantParam.toLowerCase().trim();
    if (SEED_TENANTS[clean]) return SEED_TENANTS[clean];
  }

  // Browser check for URL path, query param, or hostname
  if (typeof window !== 'undefined') {
    // 1. Check path for /stores/[slug]
    const pathMatch = window.location.pathname.match(/^\/(stores|tenant)\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      const slug = pathMatch[2].toLowerCase();
      if (SEED_TENANTS[slug]) return SEED_TENANTS[slug];
    }

    // 2. Check query param ?tenant=slug
    const urlParams = new URLSearchParams(window.location.search);
    const qTenant = urlParams.get('tenant');
    if (qTenant && SEED_TENANTS[qTenant.toLowerCase()]) {
      return SEED_TENANTS[qTenant.toLowerCase()];
    }

    // 3. Check domain / subdomain
    const host = window.location.hostname.toLowerCase();
    if (host.includes('auraliving') || host.startsWith('auraliving.')) return SEED_TENANTS.auraliving;
    if (host.includes('apexathletics') || host.startsWith('apexathletics.')) return SEED_TENANTS.apexathletics;
    if (host.includes('jqtrends') || host.startsWith('jqtrends.')) return SEED_TENANTS.jqtrends;

    // 4. Check cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'jq_active_tenant' && val && SEED_TENANTS[val.toLowerCase()]) {
        return SEED_TENANTS[val.toLowerCase()];
      }
    }
  }

  return SEED_TENANTS.jqtrends;
}

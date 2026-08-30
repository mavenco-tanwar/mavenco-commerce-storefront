import { CmsHomepageSection } from '@/services/api/cms';

export const JQTRENDS_SECTIONS: CmsHomepageSection[] = [
  {
    id: 'sec_hero_jq',
    type: 'hero',
    title: 'Elegance In Every Thread',
    subtitle: 'Affordable Luxury Women & Kids Fashion crafted from pure chanderi and mulmul silk.',
    displayOrder: 1,
    isVisible: true,
    settings: {
      tagline: 'Spring / Summer 2026 Collection',
      primaryBtnText: 'Shop Women',
      primaryBtnLink: '/women',
      secondaryBtnText: 'Shop Kids',
      secondaryBtnLink: '/kids',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
      overlayOpacity: 40,
    },
  },
  {
    id: 'sec_categories_jq',
    type: 'categories',
    title: 'Curated Pret Departments',
    subtitle: 'Handpicked silhouettes designed for every festive celebration and formal salon.',
    displayOrder: 2,
    isVisible: true,
    settings: {
      categoryIds: ['cat_dresses_jq', 'cat_kurtis_jq', 'cat_coords_jq', 'cat_girls_jq'],
    },
  },
  {
    id: 'sec_new_arrivals_jq',
    type: 'new_arrivals',
    title: 'New Season Atelier Drops',
    subtitle: 'Fresh boutique creations crafted with intricate zari and delicate mirror work.',
    displayOrder: 3,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_womens_editorial_jq',
    type: 'womens_editorial',
    title: "Women's Haute Couture",
    subtitle: 'Hand-embroidered florals, zari borders, and contemporary runway cuts.',
    displayOrder: 4,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Explore Women',
      ctaUrl: '/women',
    },
  },
  {
    id: 'sec_promo_jq',
    type: 'promotional_banner',
    title: 'Festive Atelier Sale',
    subtitle: 'Flat 20% OFF on all Festive Pret Collection with code JQFESTIVE20.',
    displayOrder: 5,
    isVisible: true,
    settings: {
      code: 'JQFESTIVE20',
      ctaText: 'Claim Offer',
      ctaUrl: '/sale',
    },
  },
  {
    id: 'sec_kids_editorial_jq',
    type: 'kids_editorial',
    title: 'Little Royals Festive Line',
    subtitle: 'Comfort-first silk kurta sets and twirl-ready organza frocks for little ones.',
    displayOrder: 6,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Shop Kids',
      ctaUrl: '/kids',
    },
  },
  {
    id: 'sec_trending_jq',
    type: 'trending',
    title: 'Trending This Week',
    subtitle: 'The season’s most coveted luxury styles loved by our community.',
    displayOrder: 7,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_best_sellers_jq',
    type: 'best_sellers',
    title: 'Iconic Best Sellers',
    subtitle: 'Celebrated staples designed for effortless elegance and all-day comfort.',
    displayOrder: 8,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_testimonials_jq',
    type: 'testimonials',
    title: 'Loved By Our Patrons',
    subtitle: 'Verified reviews from fashion connoisseurs across India.',
    displayOrder: 9,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_instagram_jq',
    type: 'instagram_feed',
    title: 'Follow @jqtrends.studio',
    subtitle: 'Tag #JQWomen for a chance to be featured on our official journal.',
    displayOrder: 10,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_newsletter_jq',
    type: 'newsletter',
    title: 'Join The JQ Circle',
    subtitle: 'Be the first to access VIP lookbooks, private salon events, and 10% off your first order.',
    displayOrder: 11,
    isVisible: true,
    settings: {},
  },
];

export const AURALIVING_SECTIONS: CmsHomepageSection[] = [
  {
    id: 'sec_hero_aura',
    type: 'hero',
    title: 'Scandinavian Serenity',
    subtitle: 'Handcrafted ceramic pottery, Belgian organic linens, and solid oak furniture for mindful living.',
    displayOrder: 1,
    isVisible: true,
    settings: {
      tagline: 'Nordic Living Sanctuary 2026',
      primaryBtnText: 'Explore Living',
      primaryBtnLink: '/women',
      secondaryBtnText: 'Shop Ceramics',
      secondaryBtnLink: '/kids',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      overlayOpacity: 35,
    },
  },
  {
    id: 'sec_categories_aura',
    type: 'categories',
    title: 'Mindfully Crafted Spaces',
    subtitle: 'Explore our curated collections of organic textures, earthy tones, and sculptural forms.',
    displayOrder: 2,
    isVisible: true,
    settings: {
      categoryIds: ['cat_living', 'cat_ceramics', 'cat_linens', 'cat_lighting'],
    },
  },
  {
    id: 'sec_new_arrivals_aura',
    type: 'new_arrivals',
    title: 'New Season Home Objects',
    subtitle: 'Small-batch artisanal ceramics and textured wool throws hand-loomed in Portugal.',
    displayOrder: 3,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_womens_editorial_aura',
    type: 'womens_editorial',
    title: 'The Organic Living Room',
    subtitle: 'Sculptural travertine tables, ambient paper lamps, and curved bouclé seating.',
    displayOrder: 4,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Discover Living Room',
      ctaUrl: '/women',
    },
  },
  {
    id: 'sec_promo_aura',
    type: 'promotional_banner',
    title: 'Spring Interior Refresh',
    subtitle: 'Enjoy 15% OFF across our handcrafted ceramic and sustainable linen collection with code NORDIC15.',
    displayOrder: 5,
    isVisible: true,
    settings: {
      code: 'NORDIC15',
      ctaText: 'Shop Sanctuary',
      ctaUrl: '/sale',
    },
  },
  {
    id: 'sec_kids_editorial_aura',
    type: 'kids_editorial',
    title: 'The Little Dreamer Nursery',
    subtitle: 'Non-toxic rattan cribs, organic cotton swaddles, and calming pastel nursery accents.',
    displayOrder: 6,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Shop Nursery',
      ctaUrl: '/kids',
    },
  },
  {
    id: 'sec_trending_aura',
    type: 'trending',
    title: 'Most Coveted Objects',
    subtitle: 'Timeless architectural home pieces chosen by interior architects and stylists.',
    displayOrder: 7,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_best_sellers_aura',
    type: 'best_sellers',
    title: 'Everyday Essentials',
    subtitle: 'Durable stonewashed linens and matte glazed dinnerware designed for daily joy.',
    displayOrder: 8,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_testimonials_aura',
    type: 'testimonials',
    title: 'Stories From Calm Homes',
    subtitle: 'What architects, designers, and mindful homeowners say about Aura Living.',
    displayOrder: 9,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_instagram_aura',
    type: 'instagram_feed',
    title: 'Follow @auraliving.home',
    subtitle: 'Tag #AuraHome to share your calming interiors and be featured in our lookbook.',
    displayOrder: 10,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_newsletter_aura',
    type: 'newsletter',
    title: 'Join The Nordic Journal',
    subtitle: 'Receive seasonal architectural lookbooks, sustainable living guides, and 10% off your first piece.',
    displayOrder: 11,
    isVisible: true,
    settings: {},
  },
];

export const APEXATHLETICS_SECTIONS: CmsHomepageSection[] = [
  {
    id: 'sec_hero_apex',
    type: 'hero',
    title: 'Unstoppable Performance',
    subtitle: 'Engineered compression apparel, carbon-plated footwear, and thermo-regulating training gear.',
    displayOrder: 1,
    isVisible: true,
    settings: {
      tagline: 'Apex Pro Athletic Series 2026',
      primaryBtnText: "Shop Men's Training",
      primaryBtnLink: '/women',
      secondaryBtnText: "Shop Women's Active",
      secondaryBtnLink: '/kids',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
      overlayOpacity: 50,
    },
  },
  {
    id: 'sec_categories_apex',
    type: 'categories',
    title: 'Engineered Disciplines',
    subtitle: 'Gear calibrated for high-intensity training, marathon running, recovery, and strength.',
    displayOrder: 2,
    isVisible: true,
    settings: {
      categoryIds: ['cat_compression', 'cat_running', 'cat_training', 'cat_footwear'],
    },
  },
  {
    id: 'sec_new_arrivals_apex',
    type: 'new_arrivals',
    title: 'New Speed & Endurance Drops',
    subtitle: 'Featherweight breathable aero-fabrics with bonded seam technology.',
    displayOrder: 3,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_womens_editorial_apex',
    type: 'womens_editorial',
    title: 'Apex Aerodynamic Compression',
    subtitle: 'Graduated muscle compression that enhances blood flow and reduces fatigue during peak performance.',
    displayOrder: 4,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Explore Compression Pro',
      ctaUrl: '/women',
    },
  },
  {
    id: 'sec_promo_apex',
    type: 'promotional_banner',
    title: 'Athlete Season Kickoff',
    subtitle: 'Flat 20% OFF on all Pro Series footwear and compression tops with code APEXPRO20.',
    displayOrder: 5,
    isVisible: true,
    settings: {
      code: 'APEXPRO20',
      ctaText: 'Claim Athlete Pass',
      ctaUrl: '/sale',
    },
  },
  {
    id: 'sec_kids_editorial_apex',
    type: 'kids_editorial',
    title: 'Next-Gen Youth Athletic',
    subtitle: 'Moisture-wicking tracksuits, durable turf cleats, and athletic backpacks for young athletes.',
    displayOrder: 6,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Shop Youth Athletic',
      ctaUrl: '/kids',
    },
  },
  {
    id: 'sec_trending_apex',
    type: 'trending',
    title: 'Elite Training Gear',
    subtitle: 'The championship activewear chosen by elite triathletes and CrossFit athletes.',
    displayOrder: 7,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_best_sellers_apex',
    type: 'best_sellers',
    title: 'Core Training Staples',
    subtitle: 'Anti-odor seamless tops and squat-proof 4-way stretch shorts built to endure 10,000 reps.',
    displayOrder: 8,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_testimonials_apex',
    type: 'testimonials',
    title: 'Tested Under Pressure',
    subtitle: 'Verified feedback from professional runners, coaches, and fitness athletes.',
    displayOrder: 9,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_instagram_apex',
    type: 'instagram_feed',
    title: 'Follow @apexathletics.pro',
    subtitle: 'Tag #TeamApex to be featured on our global leaderboards and athlete roster.',
    displayOrder: 10,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_newsletter_apex',
    type: 'newsletter',
    title: 'Join Apex Elite Club',
    subtitle: 'Get early access to limited edition shoe drops, nutrition guides, and VIP athlete discounts.',
    displayOrder: 11,
    isVisible: true,
    settings: {},
  },
];

export const DEMO_SECTIONS: CmsHomepageSection[] = [
  {
    id: 'sec_hero_demo',
    type: 'hero',
    title: 'Curated Modern Design',
    subtitle: 'High-precision craftsmanship, sustainable materials, and timeless aesthetic silhouettes for the discerning individual.',
    displayOrder: 1,
    isVisible: true,
    settings: {
      headline: 'Next-Gen Commerce Experience',
      subheadline: 'Explore our curated collection of artisanal apparel, architectural living objects, and performance gear.',
      ctaPrimaryText: 'Explore New In',
      ctaPrimaryUrl: '/new-arrivals',
      ctaSecondaryText: 'View Collections',
      ctaSecondaryUrl: '/collections/festive',
      badgeText: 'Live Demo Store • Season 2026',
      mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'sec_categories_demo',
    type: 'categories',
    title: 'Shop By Department',
    subtitle: 'Explore our meticulously curated departments tailored for everyday luxury.',
    displayOrder: 2,
    isVisible: true,
    settings: {
      limit: 6,
    },
  },
  {
    id: 'sec_editorial_demo',
    type: 'curated_collection',
    title: 'The Modern Capsule Lookbook',
    subtitle: 'A photographic journey into minimalist tailoring, organic textures, and intentional living.',
    displayOrder: 3,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Discover Lookbook',
      ctaUrl: '/new-arrivals',
    },
  },
  {
    id: 'sec_new_arrivals_demo',
    type: 'new_arrivals',
    title: 'Fresh Arrivals & Studio Drops',
    subtitle: 'Explore our latest arrivals crafted in limited quantities with zero compromises.',
    displayOrder: 4,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_promo_demo',
    type: 'promotional_banner',
    title: 'Limited Seasonal Celebration',
    subtitle: 'Enjoy 20% off across the complete demo catalog with code DEMO20 at checkout.',
    displayOrder: 5,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1600&auto=format&fit=crop',
      couponCode: 'DEMO20',
      ctaText: 'Apply Discount & Shop',
      ctaUrl: '/sale',
    },
  },
  {
    id: 'sec_trending_demo',
    type: 'trending',
    title: 'Trending Essentials',
    subtitle: 'The season’s most celebrated pieces, curated and loved worldwide.',
    displayOrder: 6,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_testimonials_demo',
    type: 'testimonials',
    title: 'Client Experiences',
    subtitle: 'See what design critics, tastemakers, and happy clients say about our collection.',
    displayOrder: 7,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_newsletter_demo',
    type: 'newsletter',
    title: 'Join The Private Circle',
    subtitle: 'Subscribe for private preview invitations, lookbook drops, and complimentary shipping privileges.',
    displayOrder: 8,
    isVisible: true,
    settings: {},
  },
];

export function formatStoreDisplayName(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function createDefaultDemoSections(slug: string): CmsHomepageSection[] {
  const storeName = formatStoreDisplayName(slug);

  return [
    {
      id: `sec_hero_${slug}`,
      type: 'hero',
      title: `Crafted For Distinction`,
      subtitle: `Welcome to ${storeName}. Discover artisanal bespoke tailoring, seasonal garments, and handcrafted elegance.`,
      displayOrder: 1,
      isVisible: true,
      settings: {
        tagline: 'New Season 2026 Atelier Collection',
        primaryBtnText: 'Explore Catalog',
        primaryBtnLink: '/women',
        secondaryBtnText: 'Bespoke Consultation',
        secondaryBtnLink: '/contact',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop',
        bannerImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop',
        overlayOpacity: 35,
      },
    },
    {
      id: `sec_categories_${slug}`,
      type: 'categories',
      title: 'Curated Departments',
      subtitle: 'Explore our signature bespoke suits, artisanal shirts, festive kurtas, and handcrafted accessories.',
      displayOrder: 2,
      isVisible: true,
      settings: {
        categoryIds: ['cat_dresses_jq', 'cat_kurtis_jq', 'cat_coords_jq', 'cat_girls_jq'],
      },
    },
    {
      id: `sec_new_arrivals_${slug}`,
      type: 'new_arrivals',
      title: 'New Season Releases',
      subtitle: 'Fresh cuts, breathable natural textiles, and hand-finished detailing.',
      displayOrder: 3,
      isVisible: true,
      settings: {
        limit: 4,
      },
    },
    {
      id: `sec_womens_editorial_${slug}`,
      type: 'womens_editorial',
      title: 'The Atelier Heritage',
      subtitle: 'Every garment is meticulously cut, stitched, and styled to celebrate individuality and timeless elegance.',
      displayOrder: 4,
      isVisible: true,
      settings: {
        bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
        ctaText: 'Explore Collection',
        ctaUrl: '/women',
      },
    },
    {
      id: `sec_promo_${slug}`,
      type: 'promotional_banner',
      title: 'Inaugural Season Privileges',
      subtitle: 'Enjoy 15% off on all bespoke tailoring and ready-to-wear collections with code ATELIER15.',
      displayOrder: 5,
      isVisible: true,
      settings: {
        bannerImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1600&auto=format&fit=crop',
        couponCode: 'ATELIER15',
        ctaText: 'Apply Code & Shop',
        ctaUrl: '/sale',
      },
    },
    {
      id: `sec_trending_${slug}`,
      type: 'trending',
      title: 'Trending This Season',
      subtitle: 'Our most requested silhouettes and masterfully crafted staples.',
      displayOrder: 6,
      isVisible: true,
      settings: {
        limit: 4,
      },
    },
    {
      id: `sec_testimonials_${slug}`,
      type: 'testimonials',
      title: 'Patron Experiences',
      subtitle: 'Verified client impressions and bespoke reviews from our valued community.',
      displayOrder: 7,
      isVisible: true,
      settings: {},
    },
    {
      id: `sec_newsletter_${slug}`,
      type: 'newsletter',
      title: `Join The Private ${storeName} Circle`,
      subtitle: 'Receive invitations to private lookbook launches, fabric previews, and seasonal concierge offers.',
      displayOrder: 8,
      isVisible: true,
      settings: {},
    },
  ];
}

const TENANT_DEFAULT_MAP: Record<string, CmsHomepageSection[]> = {
  jqtrends: JQTRENDS_SECTIONS,
  auraliving: AURALIVING_SECTIONS,
  apexathletics: APEXATHLETICS_SECTIONS,
  demo: DEMO_SECTIONS,
};

// Global in-memory cache map keyed by tenant
const memoryStoreByTenant = new Map<string, CmsHomepageSection[]>();

export function getStoredHomepageSections(tenantSlug?: string): CmsHomepageSection[] {
  const slug = (tenantSlug || 'jqtrends').toLowerCase();
  
  if (memoryStoreByTenant.has(slug)) {
    return memoryStoreByTenant.get(slug)!;
  }

  // Server-side fallback read from /tmp
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = `/tmp/store_${slug}_homepage_store.json`;
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryStoreByTenant.set(slug, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  // Browser client fallback
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`jq_homepage_sections_${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryStoreByTenant.set(slug, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  const defaultForTenant = TENANT_DEFAULT_MAP[slug] || createDefaultDemoSections(slug);
  memoryStoreByTenant.set(slug, defaultForTenant);
  return defaultForTenant;
}

export function saveStoredHomepageSections(sections: CmsHomepageSection[], tenantSlug?: string): void {
  const slug = (tenantSlug || 'jqtrends').toLowerCase();
  memoryStoreByTenant.set(slug, sections);

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = `/tmp/store_${slug}_homepage_store.json`;
      fs.writeFileSync(tmpPath, JSON.stringify(sections, null, 2), 'utf-8');
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`jq_homepage_sections_${slug}`, JSON.stringify(sections));
    } catch {}
  }
}

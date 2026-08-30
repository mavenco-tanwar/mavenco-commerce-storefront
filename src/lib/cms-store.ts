import { CmsHomepageSection } from '@/services/api/cms';

const DEFAULT_SECTIONS: CmsHomepageSection[] = [
  {
    id: 'sec_hero_1',
    type: 'hero',
    title: 'Elegance In Every Thread',
    subtitle: 'Affordable Luxury Women & Kids Fashion',
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
      overlayOpacity: 45,
    },
  },
  {
    id: 'sec_categories_2',
    type: 'categories',
    title: 'Curated Departments',
    subtitle: 'Explore our handpicked silhouettes designed for every festive moment.',
    displayOrder: 2,
    isVisible: true,
    settings: {
      categoryIds: ['cat_dresses_jq', 'cat_kurtis_jq', 'cat_coords_jq', 'cat_girls_jq'],
    },
  },
  {
    id: 'sec_new_arrivals_3',
    type: 'new_arrivals',
    title: 'New Season Arrivals',
    subtitle: 'Fresh atelier creations crafted from pure chanderi and mulmul silk.',
    displayOrder: 3,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_womens_editorial_4',
    type: 'womens_editorial',
    title: "Women's Haute Couture",
    subtitle: 'Hand-embroidered florals, zari borders, and contemporary cuts.',
    displayOrder: 4,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Explore Women',
      ctaUrl: '/women',
    },
  },
  {
    id: 'sec_promo_5',
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
    id: 'sec_kids_editorial_6',
    type: 'kids_editorial',
    title: 'Little Royals Collection',
    subtitle: 'Comfort-first festive frocks and silk kurta sets for little ones.',
    displayOrder: 6,
    isVisible: true,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1600&auto=format&fit=crop',
      ctaText: 'Shop Kids',
      ctaUrl: '/kids',
    },
  },
  {
    id: 'sec_trending_7',
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
    id: 'sec_best_sellers_8',
    type: 'best_sellers',
    title: 'Iconic Best Sellers',
    subtitle: 'Celebrated staples designed for effortless elegance and comfort.',
    displayOrder: 8,
    isVisible: true,
    settings: {
      limit: 4,
    },
  },
  {
    id: 'sec_testimonials_9',
    type: 'testimonials',
    title: 'Loved By Our Patrons',
    subtitle: 'Verified reviews from fashion connoisseurs across India.',
    displayOrder: 9,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_instagram_10',
    type: 'instagram_feed',
    title: 'Follow @jqtrends.studio',
    subtitle: 'Tag #JQWomen for a chance to be featured on our official journal.',
    displayOrder: 10,
    isVisible: true,
    settings: {},
  },
  {
    id: 'sec_newsletter_11',
    type: 'newsletter',
    title: 'Join The JQ Circle',
    subtitle: 'Be the first to access VIP lookbooks, private salon events, and 10% off your first order.',
    displayOrder: 11,
    isVisible: true,
    settings: {},
  },
];

// Global in-memory cache
let globalMemorySections: CmsHomepageSection[] | null = null;

export function getStoredHomepageSections(): CmsHomepageSection[] {
  if (globalMemorySections && globalMemorySections.length > 0) {
    return globalMemorySections;
  }

  // Server-side fallback read
  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/jq_trends_homepage_store.json';
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalMemorySections = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  // Browser client fallback
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('jq_homepage_sections_live');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalMemorySections = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  globalMemorySections = DEFAULT_SECTIONS;
  return DEFAULT_SECTIONS;
}

export function saveStoredHomepageSections(sections: CmsHomepageSection[]): void {
  globalMemorySections = sections;

  if (typeof window === 'undefined') {
    try {
      const fs = eval('require')('fs');
      const tmpPath = '/tmp/jq_trends_homepage_store.json';
      fs.writeFileSync(tmpPath, JSON.stringify(sections, null, 2), 'utf-8');
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jq_homepage_sections_live', JSON.stringify(sections));
    } catch {}
  }
}

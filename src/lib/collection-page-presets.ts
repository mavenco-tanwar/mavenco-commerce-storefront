import { CollectionPageConfig } from '../types/collection-page.types';

export interface CategoryBlueprintData {
  categoryKey: string;
  name: string;
  hero: {
    title: string;
    description: string;
    bgImage: string;
    mobileImage: string;
    ctaText: string;
    badgeText: string;
  };
  defaultCategories: Array<{ slug: string; name: string }>;
  promo: {
    title: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export const CATEGORY_BLUEPRINTS: Record<string, CategoryBlueprintData> = {
  jewelry: {
    categoryKey: 'jewelry',
    name: 'Haute Joaillerie & Fine Timepieces',
    hero: {
      title: 'Fine Jewelry & Haute Horology Collections',
      description: 'Handcrafted 18K solid gold, GIA-certified solitaire diamonds, and master Swiss automatic timepieces.',
      bgImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Atelier',
      badgeText: 'CERTIFIED ATELIER VAULT',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'diamonds', name: 'Diamond Rings' },
      { slug: 'gold', name: '18K Solid Gold Chains' },
      { slug: 'watches', name: 'Luxury Timepieces' },
      { slug: 'pearls', name: 'Baroque Pearls' },
      { slug: 'tennis', name: 'Diamond Tennis Suites' },
    ],
    promo: {
      title: 'Private Atelier Salon',
      subtitle: 'Schedule a private diamond appraisal and bespoke design session with our master gemologist.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Book Private Appointment',
      ctaLink: '/contact',
    },
    seo: {
      metaTitle: 'Fine Jewelry & Luxury Timepiece Collections',
      metaDescription: 'Explore master collections of certified solitaire diamonds, 18K gold Cuban links, and Swiss chronometers.',
    },
  },

  grocery: {
    categoryKey: 'grocery',
    name: 'Artisan Gourmet Grocery & Organics',
    hero: {
      title: 'Artisan Pantry & Heirloom Harvest',
      description: 'Single-estate cold-pressed extra virgin olive oils, seasonal organic produce, and direct-trade specialty coffees.',
      bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Shop Fresh Harvest',
      badgeText: '100% CERTIFIED ORGANIC',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'produce', name: 'Heirloom Organic Produce' },
      { slug: 'bakery', name: 'Artisan Stoneground Bakery' },
      { slug: 'pantry', name: 'Single-Estate Olive Oils' },
      { slug: 'coffee', name: 'Direct Trade Coffee & Tea' },
      { slug: 'superfoods', name: 'Specialty Superfoods' },
    ],
    promo: {
      title: 'Weekly Farm-to-Table Harvest Box',
      subtitle: 'Subscribe to seasonal produce curated directly from certified local organic family growers.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Subscribe to Harvest Box',
      ctaLink: '/subscriptions',
    },
    seo: {
      metaTitle: 'Artisan Gourmet Grocery & Organic Harvest',
      metaDescription: 'Discover farm-fresh organic produce crates, cold-pressed olive oils, and small-batch pantry staples.',
    },
  },

  electronics: {
    categoryKey: 'electronics',
    name: 'Next-Gen Audio & Smart Electronics',
    hero: {
      title: 'Next-Gen Audio & Smart Electronics',
      description: 'Precision acoustic transducers, flagship noise-cancelling headphones, and studio-grade audio gear.',
      bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Gear',
      badgeText: 'STUDIO ACOUSTICS',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'headphones', name: 'Audiophile Headphones' },
      { slug: 'earbuds', name: 'Wireless ANC Earbuds' },
      { slug: 'speakers', name: 'Hi-Fi Studio Speakers' },
      { slug: 'accessories', name: 'Studio Cables & DACs' },
    ],
    promo: {
      title: 'Audiophile Listening Lounge',
      subtitle: 'Experience studio acoustic calibration and lossless high-resolution audio streaming gear.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Audio Lab',
      ctaLink: '/about',
    },
    seo: {
      metaTitle: 'Next-Gen Audio & Electronics Collections',
      metaDescription: 'High-fidelity audio monitors, wireless earbuds, and precision sound engineering equipment.',
    },
  },

  beauty: {
    categoryKey: 'beauty',
    name: 'Clean Clinical Botanicals & Skincare',
    hero: {
      title: 'Clean Clinical Botanicals & Skincare',
      description: 'Dermatologist-formulated active serums, organic cold-pressed botanicals, and clean barrier hydration.',
      bgImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Shop Botanicals',
      badgeText: 'CLEAN BOTANICAL LAB',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'serums', name: 'Barrier Repair Serums' },
      { slug: 'oils', name: 'Botanical Face Oils' },
      { slug: 'cleansers', name: 'Gentle Cleansers' },
      { slug: 'moisturizers', name: 'Antioxidant Moisturizers' },
    ],
    promo: {
      title: 'Complimentary Skin Diagnostic',
      subtitle: 'Get an AI-powered personalized botanical routine tailored to your skin barrier.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Start Skin Diagnostic',
      ctaLink: '/diagnostic',
    },
    seo: {
      metaTitle: 'Clean Clinical Botanicals & Skincare',
      metaDescription: 'Dermatologist-formulated active serums, cold-pressed botanicals, and clean skin barrier hydration.',
    },
  },

  fitness: {
    categoryKey: 'fitness',
    name: 'High-Performance Activewear & Training',
    hero: {
      title: 'High-Performance Activewear & Training',
      description: 'Seamless 4-way compression fabric, moisture-wicking technical knits, and Olympic-grade gym apparel.',
      bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Shop Activewear',
      badgeText: 'ENGINEERED PERFORMANCE',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'leggings', name: 'Compression Leggings' },
      { slug: 'tops', name: 'Seamless Training Tops' },
      { slug: 'shorts', name: 'Performance Shorts' },
      { slug: 'outerwear', name: 'Thermal Activewear' },
    ],
    promo: {
      title: 'Athlete Pro Testing Program',
      subtitle: 'Test our unreleased compression prototypes and receive early access to competition gear.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Join Athlete Program',
      ctaLink: '/athlete-program',
    },
    seo: {
      metaTitle: 'High-Performance Activewear & Gym Apparel',
      metaDescription: 'Seamless compression wear, technical training knits, and engineered athletic apparel.',
    },
  },

  home: {
    categoryKey: 'home',
    name: 'Nordic Architectural Living & Home Accents',
    hero: {
      title: 'Nordic Architectural Living & Home Accents',
      description: 'Solid white oak furnishings, hand-blown organic ceramics, and textured linen living accents.',
      bgImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Living',
      badgeText: 'TIMELESS NORDIC LIVING',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'furniture', name: 'Solid Oak Furnishings' },
      { slug: 'ceramics', name: 'Hand-Thrown Ceramics' },
      { slug: 'lighting', name: 'Architectural Lighting' },
      { slug: 'textiles', name: 'Belgian Linen Accents' },
    ],
    promo: {
      title: 'Interior Design Consultation',
      subtitle: 'Collaborate with our Nordic studio architects on tailored residential space planning.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Book Interior Consult',
      ctaLink: '/contact',
    },
    seo: {
      metaTitle: 'Nordic Furniture, Lighting & Home Decor',
      metaDescription: 'Solid oak furnishings, hand-blown ceramics, and architectural interior decor.',
    },
  },

  footwear: {
    categoryKey: 'footwear',
    name: 'Curated Designer Footwear & Luxury Sneakers',
    hero: {
      title: 'Curated Designer Footwear & Luxury Sneakers',
      description: 'Hand-stitched Tuscan calfskin leather, vulcanized court silhouettes, and responsive athletic cushioning.',
      bgImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Shop Footwear',
      badgeText: 'HERITAGE COBBLER EDIT',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'sneakers', name: 'Luxury Low-Top Sneakers' },
      { slug: 'dress-shoes', name: 'Hand-Welted Oxfords' },
      { slug: 'runners', name: 'Athletic Runners' },
      { slug: 'boots', name: 'Italian Leather Boots' },
    ],
    promo: {
      title: 'Custom Cobbler Monogramming',
      subtitle: 'Complimentary laser monogramming and custom patina finishing on all handcrafted calfskin boots.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Personalize Your Pair',
      ctaLink: '/custom',
    },
    seo: {
      metaTitle: 'Designer Footwear, Luxury Sneakers & Boots',
      metaDescription: 'Handcrafted Italian leather shoes, designer sneakers, and heritage welted boots.',
    },
  },

  fashion: {
    categoryKey: 'fashion',
    name: 'Atelier Haute Couture & Designer Silhouettes',
    hero: {
      title: 'Atelier Haute Couture & Designer Silhouettes',
      description: 'Handcrafted silhouettes engineered from organic silks, heritage linens, and bespoke embroidery.',
      bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Lookbook',
      badgeText: 'CURATED RUNWAY EDIT',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'women', name: 'Women' },
      { slug: 'men', name: 'Sartorial Men' },
      { slug: 'eveningwear', name: 'Haute Eveningwear' },
      { slug: 'co-ords', name: 'Silk Co-Ords' },
      { slug: 'knitwear', name: 'Cashmere Knitwear' },
    ],
    promo: {
      title: 'Private Client Concierge',
      subtitle: 'Schedule a virtual styling session with our senior master atelier.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Book Private Appointment',
      ctaLink: '/about',
    },
    seo: {
      metaTitle: 'Curated Designer Collections | Fashion Atelier',
      metaDescription: 'Discover our complete collection of bespoke women wear, handcrafted co-ords, and luxury accessories.',
    },
  },

  multipurpose: {
    categoryKey: 'multipurpose',
    name: 'Flagship Multi-Category Catalog',
    hero: {
      title: 'Curated Flagship Catalog',
      description: 'Discover our premier multi-category department collection spanning fashion, beauty, home, and technology.',
      bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Explore Catalog',
      badgeText: 'FLAGSHIP STOREFRONT',
    },
    defaultCategories: [
      { slug: 'all', name: 'All Collections' },
      { slug: 'fashion', name: 'Designer Fashion' },
      { slug: 'electronics', name: 'Electronics & Audio' },
      { slug: 'home', name: 'Home & Living' },
      { slug: 'beauty', name: 'Beauty & Wellness' },
    ],
    promo: {
      title: 'Flagship Loyalty Rewards',
      subtitle: 'Earn exclusive concierge points and early access drops on all departmental purchases.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
      ctaText: 'Join Rewards Club',
      ctaLink: '/rewards',
    },
    seo: {
      metaTitle: 'Premier Department Storefront Collections',
      metaDescription: 'Shop premier collections across designer apparel, consumer technology, and architectural living.',
    },
  },
};

export function inferCategoryFromTenant(tenantSlug?: string): string {
  if (!tenantSlug) return 'fashion';
  const s = tenantSlug.toLowerCase().trim();

  if (
    s.includes('jewel') ||
    s.includes('silvora') ||
    s.includes('gold') ||
    s.includes('diamond') ||
    s.includes('watch') ||
    s.includes('aurum') ||
    s.includes('gem')
  ) {
    return 'jewelry';
  }

  if (
    s.includes('veg') ||
    s.includes('grocery') ||
    s.includes('coffee') ||
    s.includes('superfood') ||
    s.includes('organic') ||
    s.includes('freshharbor') ||
    s.includes('pantry') ||
    s.includes('garden') ||
    s.includes('farm') ||
    s.includes('food')
  ) {
    return 'grocery';
  }

  if (
    s.includes('volt') ||
    s.includes('electronic') ||
    s.includes('gadget') ||
    s.includes('audio') ||
    s.includes('headphone') ||
    s.includes('tech') ||
    s.includes('sound')
  ) {
    return 'electronics';
  }

  if (
    s.includes('glow') ||
    s.includes('beauty') ||
    s.includes('cosmetic') ||
    s.includes('skincare') ||
    s.includes('botanica') ||
    s.includes('serum')
  ) {
    return 'beauty';
  }

  if (
    s.includes('apex') ||
    s.includes('fit') ||
    s.includes('activewear') ||
    s.includes('athletic') ||
    s.includes('gym') ||
    s.includes('sport')
  ) {
    return 'fitness';
  }

  if (
    s.includes('aura') ||
    s.includes('furniture') ||
    s.includes('decor') ||
    s.includes('living') ||
    s.includes('nordic') ||
    s.includes('home')
  ) {
    return 'home';
  }

  if (
    s.includes('kick') ||
    s.includes('shoe') ||
    s.includes('sneaker') ||
    s.includes('footwear') ||
    s.includes('boot')
  ) {
    return 'footwear';
  }

  if (
    s.includes('universal') ||
    s.includes('megastore') ||
    s.includes('multi') ||
    s === 'demo'
  ) {
    return 'multipurpose';
  }

  return 'fashion';
}

export function getDefaultCollectionPageConfig(
  tenantId: string = 'lumina',
  categoryKeyOverride?: string
): CollectionPageConfig & { defaultCategories?: Array<{ slug: string; name: string }> } {
  const catKey = categoryKeyOverride || inferCategoryFromTenant(tenantId);
  const blueprint = CATEGORY_BLUEPRINTS[catKey] || CATEGORY_BLUEPRINTS.fashion;

  return {
    id: `col_page_${tenantId}`,
    tenantId,
    templateId: `default_${catKey}`,
    name: blueprint.name,
    status: 'published',
    version: 1,

    hero: {
      enabled: true,
      title: blueprint.hero.title,
      description: blueprint.hero.description,
      bgImage: blueprint.hero.bgImage,
      mobileImage: blueprint.hero.mobileImage,
      overlayOpacity: 45,
      alignment: 'center',
      height: 'medium',
      ctaText: blueprint.hero.ctaText,
      ctaLink: '#products',
      badgeText: blueprint.hero.badgeText,
    },

    breadcrumbs: {
      enabled: true,
      showHome: true,
      separator: '/',
    },

    header: {
      enabled: true,
      showCount: true,
      showDescription: true,
      alignment: 'left',
    },

    toolbar: {
      showCount: true,
      showFilterBtn: true,
      showSort: true,
      showViewToggle: true,
      defaultView: 'grid',
    },

    filters: {
      position: 'left',
      sticky: true,
      items: [
        { id: 'f_cat', key: 'category', label: 'Category', type: 'checkbox', enabled: true, collapsed: false, position: 1 },
        { id: 'f_color', key: 'color', label: 'Color / Metal', type: 'color', enabled: true, collapsed: false, position: 2 },
        { id: 'f_size', key: 'size', label: 'Size / Option', type: 'swatch', enabled: true, collapsed: false, position: 3 },
        { id: 'f_price', key: 'price', label: 'Price Range', type: 'range', enabled: true, collapsed: false, position: 4 },
        { id: 'f_instock', key: 'in_stock', label: 'In Stock Only', type: 'boolean', enabled: true, collapsed: false, position: 5 },
      ],
    },

    sorting: {
      defaultSort: 'featured',
      items: [
        { key: 'featured', label: 'Featured & Best Selling', enabled: true, position: 1 },
        { key: 'newest', label: 'Newest Arrivals', enabled: true, position: 2 },
        { key: 'price_asc', label: 'Price: Low to High', enabled: true, position: 3 },
        { key: 'price_desc', label: 'Price: High to Low', enabled: true, position: 4 },
        { key: 'rating', label: 'Highest Customer Rating', enabled: true, position: 5 },
      ],
    },

    grid: {
      desktopColumns: 4,
      tabletColumns: 3,
      mobileColumns: 2,
      gap: '24px',
    },

    pagination: {
      type: 'pagination',
      productsPerPage: 24,
    },

    promo: {
      enabled: true,
      insertAfterIndex: 4,
      title: blueprint.promo.title,
      subtitle: blueprint.promo.subtitle,
      image: blueprint.promo.image,
      ctaText: blueprint.promo.ctaText,
      ctaLink: blueprint.promo.ctaLink,
      colSpan: '2',
    },

    seo: {
      metaTitle: blueprint.seo.metaTitle,
      metaDescription: blueprint.seo.metaDescription,
      canonicalUrl: `https://${tenantId}.mavenco-storefront.com/collections`,
      ogImage: blueprint.hero.bgImage,
    },

    defaultCategories: blueprint.defaultCategories,
  };
}

export const COLLECTION_PAGE_PRESETS: {
  id: string;
  name: string;
  description: string;
  getConfig: (tenantId: string) => CollectionPageConfig;
}[] = [
  {
    id: 'default_fashion',
    name: 'Industry Blueprint Dynamic Template',
    description: 'Hero background banner, sticky left filter sidebar, 4-column desktop grid, and promotional insert automatically tailored to your store category.',
    getConfig: (tId) => getDefaultCollectionPageConfig(tId),
  },
  {
    id: 'minimal_studio',
    name: 'Minimalist Scandinavian Studio',
    description: 'Header-only top layout without large hero, drawer filters, and high-contrast 4-column square cards.',
    getConfig: (tId) => {
      const c = getDefaultCollectionPageConfig(tId);
      c.name = 'Minimalist Studio Template';
      c.hero.enabled = false;
      c.filters.position = 'none';
      c.grid.desktopColumns = 4;
      c.promo.enabled = false;
      return c;
    },
  },
  {
    id: 'luxury_atelier',
    name: 'Luxury Haute Couture & Atelier',
    description: 'Centered dramatic hero, 3-column spacious luxury grid, gold accents, and private concierge promo.',
    getConfig: (tId) => {
      const c = getDefaultCollectionPageConfig(tId);
      c.name = 'Luxury Haute Couture Template';
      c.hero.height = 'large';
      c.hero.alignment = 'center';
      c.grid.desktopColumns = 3;
      c.promo.colSpan = 'full';
      return c;
    },
  },
  {
    id: 'editorial_magazine',
    name: 'Editorial Storytelling Lookbook',
    description: 'Split layout hero, large editorial descriptions, 3-column cards, and embedded lookbook notes.',
    getConfig: (tId) => {
      const c = getDefaultCollectionPageConfig(tId);
      c.name = 'Editorial Storytelling Template';
      c.hero.alignment = 'left';
      c.grid.desktopColumns = 3;
      c.pagination.type = 'load_more';
      return c;
    },
  },
  {
    id: 'sale_clearance',
    name: 'Flash Sale & Vault Clearance',
    description: 'High-contrast countdown header, infinite scroll, dense 5-column product grid with instant discounts.',
    getConfig: (tId) => {
      const c = getDefaultCollectionPageConfig(tId);
      c.name = 'Sale & Clearance Template';
      c.hero.title = 'Vault Archive Sale — Up to 50% Off';
      c.hero.description = 'Exclusive seasonal archival releases at limited-time privileged rates.';
      c.grid.desktopColumns = 4;
      c.pagination.type = 'infinite_scroll';
      return c;
    },
  },
];

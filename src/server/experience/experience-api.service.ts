import { NextRequest } from 'next/server';
import {
  StorefrontRequestContext,
  StorefrontChannel,
  Market,
  PublicStoreConfiguration,
  StorefrontNavigation,
  StorefrontProduct,
  StorefrontCart,
  StorefrontCartItem,
  StorefrontCheckoutSession,
} from '@/types/headless-experience.types';

// In-Memory dynamic registry for Omnichannel stores, channels and markets
const DEFAULT_MARKETS: Market[] = [
  {
    id: 'mkt_us_global',
    tenantId: 'tenant_lumina',
    name: 'North America & Global',
    code: 'US_GLOBAL',
    countries: ['US', 'CA', 'MX', 'GB', 'AU'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD', 'EUR'],
    defaultLocale: 'en-US',
    supportedLocales: ['en-US', 'es-US', 'fr-CA'],
    taxZoneId: 'tax_na_standard',
    shippingZoneId: 'ship_na_global',
    status: 'active',
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mkt_eu_uk',
    tenantId: 'tenant_lumina',
    name: 'European Union & United Kingdom',
    code: 'EU_UK',
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'GB'],
    defaultCurrency: 'EUR',
    supportedCurrencies: ['EUR', 'GBP'],
    defaultLocale: 'en-GB',
    supportedLocales: ['en-GB', 'de-DE', 'fr-FR', 'it-IT', 'es-ES'],
    taxZoneId: 'tax_vat_europe',
    shippingZoneId: 'ship_eu_standard',
    status: 'active',
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mkt_apac_in',
    tenantId: 'tenant_lumina',
    name: 'Asia-Pacific & India',
    code: 'APAC_IN',
    countries: ['IN', 'SG', 'AE', 'JP'],
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'SGD', 'AED', 'JPY', 'USD'],
    defaultLocale: 'en-IN',
    supportedLocales: ['en-IN', 'hi-IN', 'ja-JP'],
    taxZoneId: 'tax_gst_india',
    shippingZoneId: 'ship_apac_standard',
    status: 'active',
    createdAt: new Date(Date.now() - 80000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export let CHANNELS_REGISTRY: StorefrontChannel[] = [
  {
    id: 'chan_web_primary',
    tenantId: 'tenant_lumina',
    storeId: 'store_flagship_01',
    name: 'Next.js Flagship Web Storefront',
    code: 'WEB_PRIMARY',
    type: 'web',
    status: 'active',
    apiKeyPrefix: 'sf_live_web_982',
    configuration: {
      locale: 'en-US',
      currency: 'USD',
      allowedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
      allowedLocales: ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'hi-IN'],
      catalogVisibility: 'all',
      pricingMultiplier: 1.0,
      allowGuestCheckout: true,
      requiresCustomerApproval: false,
      inventoryAllocationPolicy: 'shared',
      paymentMethodIds: ['pm_stripe_card', 'pm_apple_pay', 'pm_google_pay', 'pm_paypal', 'pm_klarna'],
      shippingMethodIds: ['ship_standard_ground', 'ship_express_air', 'ship_overnight_priority'],
      seo: {
        titleTemplate: '%s | Lumina Luxury Commerce',
        defaultMetaDescription: 'Curated luxury fashion, couture tailoring, and modern lifestyle essentials.',
        robotsRule: 'index, follow',
        canonicalBaseUrl: 'https://lumina-luxury.com',
      },
      features: {
        wishlist: true,
        reviews: true,
        loyalty: true,
        giftCards: true,
        wallet: true,
        recommendations: true,
        analytics: true,
      },
    },
    activeVersion: 3,
    metrics24h: {
      requestCount: 148920,
      avgLatencyMs: 38,
      conversionRate: 3.82,
      ordersCount: 429,
      revenue: 68420.5,
    },
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_mobile_app',
    tenantId: 'tenant_lumina',
    storeId: 'store_flagship_01',
    name: 'iOS & Android Native Mobile App',
    code: 'MOBILE_APP',
    type: 'mobile',
    status: 'active',
    apiKeyPrefix: 'sf_live_mob_419',
    configuration: {
      locale: 'en-US',
      currency: 'USD',
      allowedCurrencies: ['USD', 'EUR', 'GBP'],
      allowedLocales: ['en-US', 'en-GB'],
      catalogVisibility: 'all',
      pricingMultiplier: 0.95, // 5% Mobile App Exclusive Discount
      allowGuestCheckout: true,
      requiresCustomerApproval: false,
      inventoryAllocationPolicy: 'shared',
      paymentMethodIds: ['pm_apple_pay', 'pm_google_pay', 'pm_stripe_card'],
      shippingMethodIds: ['ship_standard_ground', 'ship_express_air'],
      seo: {
        titleTemplate: '%s | Lumina App',
        defaultMetaDescription: 'Lumina Mobile VIP Shopping Experience.',
        robotsRule: 'noindex, nofollow',
        canonicalBaseUrl: 'https://lumina-luxury.com',
      },
      features: {
        wishlist: true,
        reviews: true,
        loyalty: true,
        giftCards: true,
        wallet: true,
        recommendations: true,
        analytics: true,
      },
    },
    activeVersion: 2,
    metrics24h: {
      requestCount: 84210,
      avgLatencyMs: 24,
      conversionRate: 4.65,
      ordersCount: 312,
      revenue: 47910.0,
    },
    createdAt: new Date(Date.now() - 80000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_pos_flagship',
    tenantId: 'tenant_lumina',
    storeId: 'store_flagship_01',
    name: 'NYC Fifth Avenue Boutique POS',
    code: 'POS_NYC_5TH',
    type: 'pos',
    status: 'active',
    apiKeyPrefix: 'sf_live_pos_771',
    configuration: {
      locale: 'en-US',
      currency: 'USD',
      allowedCurrencies: ['USD'],
      allowedLocales: ['en-US'],
      catalogVisibility: 'curated',
      pricingMultiplier: 1.0,
      allowGuestCheckout: true,
      requiresCustomerApproval: false,
      inventoryAllocationPolicy: 'channel_reserved',
      reservedWarehouseId: 'wh_nyc_flagship_01',
      paymentMethodIds: ['pm_pos_terminal_chip', 'pm_cash_register', 'pm_pos_gift_card'],
      shippingMethodIds: ['ship_instore_pickup', 'ship_local_courier'],
      seo: {
        titleTemplate: 'POS Terminal | NYC Store',
        defaultMetaDescription: 'POS In-store register',
        robotsRule: 'noindex, nofollow',
        canonicalBaseUrl: 'https://lumina-luxury.com',
      },
      features: {
        wishlist: false,
        reviews: false,
        loyalty: true,
        giftCards: true,
        wallet: true,
        recommendations: true,
        analytics: true,
      },
    },
    activeVersion: 1,
    metrics24h: {
      requestCount: 14200,
      avgLatencyMs: 18,
      conversionRate: 42.1,
      ordersCount: 94,
      revenue: 31800.0,
    },
    createdAt: new Date(Date.now() - 60000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chan_marketplace_amazon',
    tenantId: 'tenant_lumina',
    storeId: 'store_flagship_01',
    name: 'Amazon Luxury Stores Marketplace',
    code: 'MKT_AMAZON_US',
    type: 'marketplace',
    status: 'active',
    apiKeyPrefix: 'sf_live_mkt_502',
    configuration: {
      locale: 'en-US',
      currency: 'USD',
      allowedCurrencies: ['USD'],
      allowedLocales: ['en-US'],
      catalogVisibility: 'curated',
      pricingMultiplier: 1.08, // 8% Marketplace Commission Offset
      allowGuestCheckout: false,
      requiresCustomerApproval: false,
      inventoryAllocationPolicy: 'safety_stock',
      paymentMethodIds: ['pm_marketplace_settlement'],
      shippingMethodIds: ['ship_fba_prime', 'ship_fbm_express'],
      seo: {
        titleTemplate: 'Amazon Storefeed',
        defaultMetaDescription: 'Amazon Luxury Feed',
        robotsRule: 'noindex, nofollow',
        canonicalBaseUrl: 'https://lumina-luxury.com',
      },
      features: {
        wishlist: false,
        reviews: false,
        loyalty: false,
        giftCards: false,
        wallet: false,
        recommendations: false,
        analytics: true,
      },
    },
    activeVersion: 1,
    metrics24h: {
      requestCount: 32900,
      avgLatencyMs: 42,
      conversionRate: 2.1,
      ordersCount: 88,
      revenue: 14920.0,
    },
    createdAt: new Date(Date.now() - 40000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample Normalized Catalog Mock Database
const CATALOG_DATABASE: StorefrontProduct[] = [
  {
    id: 'prod_lum_001',
    slug: 'lumina-silk-cashmere-overcoat',
    title: 'Lumina Silk-Cashmere Tailored Overcoat',
    description: 'Crafted in Northern Italy with 70% pure Mongolian cashmere and 30% mulberry silk.',
    shortDescription: 'Italian crafted cashmere-silk luxury overcoat with mother-of-pearl buttons.',
    brand: 'Lumina Atelier',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
    category: 'Outerwear',
    categories: ['Outerwear', 'Luxury Coats', 'Winter 2026'],
    collections: ['Autumn / Winter Runway', 'VIP Exclusive Selection'],
    options: [
      { name: 'Size', values: ['38R', '40R', '42R', '44R'] },
      { name: 'Color', values: ['Midnight Charcoal', 'Camel Tweed', 'Onyx Black'] },
    ],
    variants: [
      {
        id: 'var_001_38_charcoal',
        sku: 'LUM-COAT-38-CHR',
        title: '38R / Midnight Charcoal',
        options: { Size: '38R', Color: 'Midnight Charcoal' },
        price: 1250.0,
        compareAtPrice: 1450.0,
        availability: 'in_stock',
      },
      {
        id: 'var_001_40_charcoal',
        sku: 'LUM-COAT-40-CHR',
        title: '40R / Midnight Charcoal',
        options: { Size: '40R', Color: 'Midnight Charcoal' },
        price: 1250.0,
        compareAtPrice: 1450.0,
        availability: 'in_stock',
      },
      {
        id: 'var_001_42_camel',
        sku: 'LUM-COAT-42-CML',
        title: '42R / Camel Tweed',
        options: { Size: '42R', Color: 'Camel Tweed' },
        price: 1350.0,
        compareAtPrice: 1550.0,
        availability: 'low_stock',
      },
    ],
    pricing: {
      basePrice: 1250.0,
      salePrice: 1250.0,
      compareAtPrice: 1450.0,
      discountPercentage: 14,
      currency: 'USD',
      formattedPrice: '$1,250.00',
      formattedCompareAtPrice: '$1,450.00',
    },
    availability: {
      status: 'in_stock',
      displayLabel: 'In Stock - Ships Tomorrow',
      canPurchase: true,
    },
    rating: {
      average: 4.95,
      count: 128,
    },
    badges: ['Runway 2026', 'Handcrafted Italy', 'Bestseller'],
    shippingInformation: {
      estimatedDeliveryDays: '2-3 Business Days',
      freeShippingThreshold: 500,
      shipsFromZone: 'US-East-Central',
    },
    returnInformation: {
      returnWindowDays: 30,
      freeReturns: true,
    },
    seo: {
      title: 'Lumina Silk-Cashmere Overcoat | Luxury Menswear Outerwear',
      description: 'Hand-tailored cashmere and silk overcoat with natural horn buttons.',
      canonicalUrl: 'https://lumina-luxury.com/products/lumina-silk-cashmere-overcoat',
      ogImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
    },
    tags: ['coat', 'cashmere', 'silk', 'luxury', 'outerwear', 'winter'],
  },
  {
    id: 'prod_lum_002',
    slug: 'monaco-calfskin-weekender-bag',
    title: 'Monaco Full-Grain Calfskin Weekender Bag',
    description: 'Supple full-grain French calfskin with polished solid brass hardware.',
    shortDescription: 'Handmade travel duffel with water-resistant suede interior lining.',
    brand: 'Lumina Leathercraft',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80',
    category: 'Bags & Accessories',
    categories: ['Bags & Accessories', 'Leather Goods', 'Travel'],
    collections: ['Luggage & Travel', 'Signature Essentials'],
    options: [
      { name: 'Color', values: ['Cognac Tan', 'Obsidian Black', 'Espresso Brown'] },
    ],
    variants: [
      {
        id: 'var_002_cognac',
        sku: 'LUM-BAG-CGN',
        title: 'Cognac Tan',
        options: { Color: 'Cognac Tan' },
        price: 890.0,
        availability: 'in_stock',
      },
    ],
    pricing: {
      basePrice: 890.0,
      salePrice: 890.0,
      currency: 'USD',
      formattedPrice: '$890.00',
    },
    availability: {
      status: 'in_stock',
      displayLabel: 'In Stock',
      canPurchase: true,
    },
    rating: {
      average: 4.88,
      count: 94,
    },
    badges: ['Full Grain Leather', 'Lifetime Warranty'],
    shippingInformation: {
      estimatedDeliveryDays: '2-4 Business Days',
      freeShippingThreshold: 500,
      shipsFromZone: 'US-East-Central',
    },
    returnInformation: {
      returnWindowDays: 30,
      freeReturns: true,
    },
    seo: {
      title: 'Monaco Calfskin Weekender Bag | Lumina Travel Collection',
      description: 'Luxury travel bag in vegetable-tanned French calfskin leather.',
      canonicalUrl: 'https://lumina-luxury.com/products/monaco-calfskin-weekender-bag',
    },
    tags: ['leather', 'bag', 'travel', 'weekender', 'accessories'],
  },
  {
    id: 'prod_lum_003',
    slug: 'venetian-merino-wool-knit-sweater',
    title: 'Venetian Fine-Gauge Merino Wool Sweater',
    description: '100% extrafine Australian merino wool with ribbed cuffs and tailored fit.',
    shortDescription: 'Ultra-soft all-season merino wool knitwear.',
    brand: 'Lumina Atelier',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80',
    category: 'Knitwear',
    categories: ['Knitwear', 'Sweaters', 'Tops'],
    collections: ['Signature Essentials', 'Autumn / Winter Runway'],
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Navy Blue', 'Forest Green', 'Heather Grey'] },
    ],
    variants: [
      {
        id: 'var_003_m_navy',
        sku: 'LUM-SWT-M-NVY',
        title: 'M / Navy Blue',
        options: { Size: 'M', Color: 'Navy Blue' },
        price: 450.0,
        availability: 'in_stock',
      },
    ],
    pricing: {
      basePrice: 450.0,
      salePrice: 450.0,
      currency: 'USD',
      formattedPrice: '$450.00',
    },
    availability: {
      status: 'in_stock',
      displayLabel: 'In Stock',
      canPurchase: true,
    },
    rating: {
      average: 4.92,
      count: 67,
    },
    badges: ['100% Extrafine Merino'],
    shippingInformation: {
      estimatedDeliveryDays: '2-3 Business Days',
      freeShippingThreshold: 500,
      shipsFromZone: 'US-East-Central',
    },
    returnInformation: {
      returnWindowDays: 30,
      freeReturns: true,
    },
    seo: {
      title: 'Venetian Fine-Gauge Merino Wool Sweater | Lumina',
      description: 'Luxury merino wool sweater for effortless layering.',
      canonicalUrl: 'https://lumina-luxury.com/products/venetian-merino-wool-knit-sweater',
    },
    tags: ['sweater', 'merino', 'wool', 'knitwear', 'winter'],
  },
];

// In-Memory active Storefront Carts & Checkout Sessions
const CARTS_STORE = new Map<string, StorefrontCart>();
const CHECKOUTS_STORE = new Map<string, StorefrontCheckoutSession>();

export class ExperienceAPIService {
  /**
   * Resolves the StorefrontRequestContext securely from request headers & cookies
   */
  public static resolveContext(req: NextRequest): StorefrontRequestContext {
    const headers = req.headers;
    const url = new URL(req.url);

    const hostname = headers.get('host') || 'lumina-luxury.com';
    const tenantId = headers.get('x-tenant-slug') || headers.get('x-tenant-id') || 'tenant_lumina';
    const storeId = headers.get('x-store-id') || 'store_flagship_01';
    const channelCode = headers.get('x-channel-code') || url.searchParams.get('channel') || 'WEB_PRIMARY';
    const channel = CHANNELS_REGISTRY.find((c) => c.code === channelCode) || CHANNELS_REGISTRY[0];

    const environmentId = headers.get('x-environment-id') || 'env_production';
    const locale = headers.get('x-locale') || channel.configuration.locale || 'en-US';
    const currency = headers.get('x-currency') || channel.configuration.currency || 'USD';
    const marketId = headers.get('x-market-code') || 'mkt_us_global';
    const sessionId = headers.get('x-session-id') || `sess_${Math.random().toString(36).substring(2, 12)}`;
    const customerId = headers.get('x-customer-id') || null;

    const userAgent = headers.get('user-agent') || '';
    let device: 'desktop' | 'mobile' | 'tablet' | 'pos' | 'bot' | 'unknown' = 'desktop';
    if (channel.type === 'pos') device = 'pos';
    else if (/mobile/i.test(userAgent)) device = 'mobile';
    else if (/tablet|ipad/i.test(userAgent)) device = 'tablet';
    else if (/bot|crawler|spider/i.test(userAgent)) device = 'bot';

    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      traceId: `trc_${Math.random().toString(36).substring(2, 10)}`,
      tenantId,
      storeId,
      channelId: channel.id,
      environmentId,
      domain: hostname,
      locale,
      currency,
      marketId,
      customerId,
      sessionId,
      device,
      userAgent,
      ipAddress: headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1',
    };
  }

  /**
   * Returns safe, normalized public store configuration
   */
  public static getPublicStoreConfig(ctx: StorefrontRequestContext): PublicStoreConfiguration {
    const channel = CHANNELS_REGISTRY.find((c) => c.id === ctx.channelId) || CHANNELS_REGISTRY[0];

    return {
      store: {
        id: ctx.storeId,
        name: 'Lumina Luxury Flagship',
        slug: 'lumina-luxury',
        brandLogo: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=150&q=80',
        favicon: '/favicon.ico',
      },
      channel: {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        code: channel.code,
      },
      localization: {
        defaultLocale: channel.configuration.locale,
        supportedLocales: channel.configuration.allowedLocales,
        defaultCurrency: channel.configuration.currency,
        supportedCurrencies: channel.configuration.allowedCurrencies,
        currencySymbols: {
          USD: '$',
          EUR: '€',
          GBP: '£',
          INR: '₹',
          CAD: 'CA$',
          AUD: 'AU$',
        },
      },
      markets: DEFAULT_MARKETS,
      features: {
        guestCheckout: channel.configuration.allowGuestCheckout,
        wishlist: channel.configuration.features.wishlist,
        reviews: channel.configuration.features.reviews,
        loyalty: channel.configuration.features.loyalty,
        giftCards: channel.configuration.features.giftCards,
        wallet: channel.configuration.features.wallet,
        searchAutocomplete: true,
        aiRecommendations: channel.configuration.features.recommendations,
      },
      seo: {
        defaultTitle: 'Lumina Luxury Commerce | High Fashion & Couture',
        titleTemplate: channel.configuration.seo.titleTemplate,
        defaultDescription: channel.configuration.seo.defaultMetaDescription,
        canonicalBaseUrl: channel.configuration.seo.canonicalBaseUrl,
      },
    };
  }

  /**
   * Returns Channel-Resolved Storefront Navigation
   */
  public static getNavigation(ctx: StorefrontRequestContext): StorefrontNavigation {
    return {
      headerMenu: [
        {
          id: 'nav_new',
          label: 'New Arrivals',
          href: '/new-arrivals',
          badge: 'Spring 2026',
          children: [
            { id: 'nav_new_runway', label: 'Runway Highlights', href: '/collections/runway-2026', description: 'Curated from Paris & Milan presentations' },
            { id: 'nav_new_apparel', label: 'Ready-To-Wear', href: '/collections/ready-to-wear', description: 'Silk shirts, blazers & bespoke trousers' },
            { id: 'nav_new_leather', label: 'Fine Leathercraft', href: '/collections/leather-goods', description: 'Handcrafted bags, wallets & travel trunks' },
          ],
        },
        {
          id: 'nav_women',
          label: 'Women',
          href: '/women',
          children: [
            { id: 'nav_w_coats', label: 'Overcoats & Capes', href: '/categories/coats' },
            { id: 'nav_w_dresses', label: 'Silk Dresses', href: '/categories/dresses' },
            { id: 'nav_w_bags', label: 'Handbags & Clutches', href: '/categories/bags' },
          ],
        },
        {
          id: 'nav_men',
          label: 'Men',
          href: '/men',
          children: [
            { id: 'nav_m_tailoring', label: 'Bespoke Tailoring', href: '/categories/tailoring' },
            { id: 'nav_m_knitwear', label: 'Fine Knitwear', href: '/categories/knitwear' },
            { id: 'nav_m_shoes', label: 'Italian Footwear', href: '/categories/shoes' },
          ],
        },
        { id: 'nav_vip', label: 'VIP Club', href: '/loyalty', badge: 'Rewards' },
      ],
      footerMenu: [
        {
          id: 'foot_boutique',
          title: 'The Boutique',
          links: [
            { label: 'Our Story & Atelier', href: '/about' },
            { label: 'Store Locator', href: '/contact' },
            { label: 'Sustainability Pledge', href: '/sustainability' },
            { label: 'Careers & Craft', href: '/careers' },
          ],
        },
        {
          id: 'foot_service',
          title: 'Client Concierge',
          links: [
            { label: 'Track Your Order', href: '/account' },
            { label: 'Complimentary Returns', href: '/returns' },
            { label: 'Care & Maintenance', href: '/care-guide' },
            { label: 'Book Appointment', href: '/appointment' },
          ],
        },
        {
          id: 'foot_legal',
          title: 'Legal & Privacy',
          links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Tax & Compliance', href: '/compliance' },
            { label: 'Cookie Preferences', href: '/cookies' },
          ],
        },
      ],
    };
  }

  /**
   * Returns normalized products with channel pricing multiplier applied
   */
  public static getCatalogProducts(
    ctx: StorefrontRequestContext,
    options: {
      category?: string;
      collection?: string;
      search?: string;
      limit?: number;
      page?: number;
    } = {}
  ): { products: StorefrontProduct[]; total: number; page: number; limit: number } {
    const channel = CHANNELS_REGISTRY.find((c) => c.id === ctx.channelId) || CHANNELS_REGISTRY[0];
    const multiplier = channel.configuration.pricingMultiplier || 1.0;

    let items = [...CATALOG_DATABASE];

    if (options.category) {
      items = items.filter(
        (p) =>
          p.category.toLowerCase() === options.category?.toLowerCase() ||
          p.categories.some((c) => c.toLowerCase() === options.category?.toLowerCase())
      );
    }

    if (options.collection) {
      items = items.filter((p) =>
        p.collections.some((c) => c.toLowerCase().includes(options.collection!.toLowerCase()))
      );
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const transformed = items.map((prod) => {
      const salePrice = Math.round(prod.pricing.basePrice * multiplier * 100) / 100;
      const compareAt = prod.pricing.compareAtPrice
        ? Math.round(prod.pricing.compareAtPrice * multiplier * 100) / 100
        : undefined;

      return {
        ...prod,
        pricing: {
          ...prod.pricing,
          salePrice,
          compareAtPrice: compareAt,
          currency: ctx.currency,
          formattedPrice: `${ctx.currency === 'EUR' ? '€' : ctx.currency === 'GBP' ? '£' : '$'}${salePrice.toFixed(2)}`,
          formattedCompareAtPrice: compareAt
            ? `${ctx.currency === 'EUR' ? '€' : ctx.currency === 'GBP' ? '£' : '$'}${compareAt.toFixed(2)}`
            : undefined,
        },
      };
    });

    const page = options.page || 1;
    const limit = options.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginated = transformed.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total: transformed.length,
      page,
      limit,
    };
  }

  /**
   * Returns product by slug with channel pricing
   */
  public static getProductBySlug(ctx: StorefrontRequestContext, slug: string): StorefrontProduct | null {
    const channel = CHANNELS_REGISTRY.find((c) => c.id === ctx.channelId) || CHANNELS_REGISTRY[0];
    const multiplier = channel.configuration.pricingMultiplier || 1.0;

    const prod = CATALOG_DATABASE.find((p) => p.slug === slug);
    if (!prod) return null;

    const salePrice = Math.round(prod.pricing.basePrice * multiplier * 100) / 100;
    const compareAt = prod.pricing.compareAtPrice
      ? Math.round(prod.pricing.compareAtPrice * multiplier * 100) / 100
      : undefined;

    return {
      ...prod,
      pricing: {
        ...prod.pricing,
        salePrice,
        compareAtPrice: compareAt,
        currency: ctx.currency,
        formattedPrice: `${ctx.currency === 'EUR' ? '€' : ctx.currency === 'GBP' ? '£' : '$'}${salePrice.toFixed(2)}`,
        formattedCompareAtPrice: compareAt
          ? `${ctx.currency === 'EUR' ? '€' : ctx.currency === 'GBP' ? '£' : '$'}${compareAt.toFixed(2)}`
          : undefined,
      },
    };
  }

  /**
   * Universal Cart Management
   */
  public static getOrCreateCart(ctx: StorefrontRequestContext, cartId?: string): StorefrontCart {
    if (cartId && CARTS_STORE.has(cartId)) {
      return CARTS_STORE.get(cartId)!;
    }

    const newCartId = cartId || `cart_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newCart: StorefrontCart = {
      id: newCartId,
      tenantId: ctx.tenantId,
      storeId: ctx.storeId,
      channelId: ctx.channelId,
      currency: ctx.currency,
      locale: ctx.locale,
      items: [],
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      shippingTotal: 0,
      grandTotal: 0,
      appliedCoupons: [],
      appliedGiftCards: [],
      appliedStoreCredit: 0,
      itemCount: 0,
      currencySnapshot: {
        code: ctx.currency,
        rateToBase: 1.0,
      },
      updatedAt: new Date().toISOString(),
    };

    CARTS_STORE.set(newCartId, newCart);
    return newCart;
  }

  public static addItemToCart(
    ctx: StorefrontRequestContext,
    cartId: string,
    itemPayload: {
      productId: string;
      variantId?: string;
      quantity: number;
      selectedOptions?: Record<string, string>;
    }
  ): StorefrontCart {
    const cart = this.getOrCreateCart(ctx, cartId);
    const product = CATALOG_DATABASE.find((p) => p.id === itemPayload.productId);
    if (!product) throw new Error('Product not found in active catalog');

    const channel = CHANNELS_REGISTRY.find((c) => c.id === ctx.channelId) || CHANNELS_REGISTRY[0];
    const unitPrice = Math.round(product.pricing.basePrice * (channel.configuration.pricingMultiplier || 1.0) * 100) / 100;

    const existingIndex = cart.items.findIndex(
      (i) => i.productId === itemPayload.productId && i.variantId === (itemPayload.variantId || 'default')
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += itemPayload.quantity;
      cart.items[existingIndex].totalPrice = cart.items[existingIndex].quantity * unitPrice;
    } else {
      const newItem: StorefrontCartItem = {
        id: `citem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        variantId: itemPayload.variantId || 'default',
        title: product.title,
        slug: product.slug,
        image: product.thumbnail,
        quantity: itemPayload.quantity,
        unitPrice,
        totalPrice: itemPayload.quantity * unitPrice,
        selectedOptions: itemPayload.selectedOptions || {},
      };
      cart.items.push(newItem);
    }

    this.recalculateCart(cart);
    return cart;
  }

  public static updateCartItem(
    ctx: StorefrontRequestContext,
    cartId: string,
    itemId: string,
    quantity: number
  ): StorefrontCart {
    const cart = this.getOrCreateCart(ctx, cartId);
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    } else {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    }
    this.recalculateCart(cart);
    return cart;
  }

  public static applyCoupon(ctx: StorefrontRequestContext, cartId: string, couponCode: string): StorefrontCart {
    const cart = this.getOrCreateCart(ctx, cartId);
    if (couponCode.toUpperCase() === 'VIP20') {
      const discount = Math.round(cart.subtotal * 0.2 * 100) / 100;
      cart.appliedCoupons = [{ code: 'VIP20', discountAmount: discount }];
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      const discount = Math.round(cart.subtotal * 0.1 * 100) / 100;
      cart.appliedCoupons = [{ code: 'WELCOME10', discountAmount: discount }];
    } else {
      throw new Error(`Invalid promotion coupon code '${couponCode}'`);
    }

    this.recalculateCart(cart);
    return cart;
  }

  private static recalculateCart(cart: StorefrontCart) {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const discountTotal = cart.appliedCoupons.reduce((sum, c) => sum + c.discountAmount, 0);
    cart.discountTotal = Math.min(discountTotal, cart.subtotal);

    // Tax calculation standard 8.5%
    const taxableSubtotal = Math.max(0, cart.subtotal - cart.discountTotal);
    cart.taxTotal = Math.round(taxableSubtotal * 0.085 * 100) / 100;

    // Free shipping above $500 else $25 flat rate
    cart.shippingTotal = cart.subtotal >= 500 || cart.itemCount === 0 ? 0 : 25.0;

    const giftCardsTotal = cart.appliedGiftCards.reduce((sum, g) => sum + g.balanceApplied, 0);
    const payable = taxableSubtotal + cart.taxTotal + cart.shippingTotal;
    cart.grandTotal = Math.max(0, Math.round((payable - giftCardsTotal - cart.appliedStoreCredit) * 100) / 100);
    cart.updatedAt = new Date().toISOString();
  }

  /**
   * Headless Checkout State Machine
   */
  public static createCheckoutSession(ctx: StorefrontRequestContext, cartId: string): StorefrontCheckoutSession {
    const cart = this.getOrCreateCart(ctx, cartId);
    if (cart.items.length === 0) {
      throw new Error('Cannot initiate checkout session for an empty cart');
    }

    const checkoutId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const session: StorefrontCheckoutSession = {
      id: checkoutId,
      cartId: cart.id,
      tenantId: ctx.tenantId,
      storeId: ctx.storeId,
      channelId: ctx.channelId,
      customerId: ctx.customerId,
      currency: cart.currency,
      locale: cart.locale,
      state: 'created',
      totals: {
        subtotal: cart.subtotal,
        discount: cart.discountTotal,
        tax: cart.taxTotal,
        shipping: cart.shippingTotal,
        total: cart.grandTotal,
      },
      idempotencyKey: `idemp_${Math.random().toString(36).substring(2, 12)}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      createdAt: new Date().toISOString(),
    };

    CHECKOUTS_STORE.set(checkoutId, session);
    return session;
  }

  public static updateCheckoutContact(
    ctx: StorefrontRequestContext,
    sessionId: string,
    contact: { email: string; phone?: string; firstName: string; lastName: string }
  ): StorefrontCheckoutSession {
    const session = CHECKOUTS_STORE.get(sessionId);
    if (!session) throw new Error('Checkout session not found');

    session.contact = contact;
    session.state = 'contact_completed';
    return session;
  }

  public static updateCheckoutAddress(
    ctx: StorefrontRequestContext,
    sessionId: string,
    shippingAddress: any,
    billingAddress?: any
  ): StorefrontCheckoutSession {
    const session = CHECKOUTS_STORE.get(sessionId);
    if (!session) throw new Error('Checkout session not found');

    session.shippingAddress = shippingAddress;
    session.billingAddress = billingAddress || shippingAddress;
    session.state = 'address_completed';
    return session;
  }

  public static selectShippingMethod(
    ctx: StorefrontRequestContext,
    sessionId: string,
    methodId: string
  ): StorefrontCheckoutSession {
    const session = CHECKOUTS_STORE.get(sessionId);
    if (!session) throw new Error('Checkout session not found');

    session.selectedShippingMethod = {
      id: methodId,
      name: methodId === 'express' ? 'FedEx Priority Air' : 'Complimentary White Glove Delivery',
      rate: methodId === 'express' ? 35.0 : 0.0,
      carrier: 'FedEx Express',
      estimatedDays: methodId === 'express' ? '1-2 Days' : '3-5 Days',
    };
    session.state = 'shipping_selected';
    return session;
  }

  public static createPaymentSession(
    ctx: StorefrontRequestContext,
    sessionId: string,
    provider: string = 'stripe'
  ): StorefrontCheckoutSession {
    const session = CHECKOUTS_STORE.get(sessionId);
    if (!session) throw new Error('Checkout session not found');

    session.paymentSession = {
      sessionId: `psess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      provider,
      clientSecretPreview: `pi_test_${Math.random().toString(36).substring(2, 10)}_secret_preview`,
      status: 'requires_payment_method',
      amount: session.totals.total,
      currency: session.currency,
    };
    session.state = 'payment_pending';
    return session;
  }

  public static completeCheckout(
    ctx: StorefrontRequestContext,
    sessionId: string
  ): { success: boolean; orderId: string; orderNumber: string; session: StorefrontCheckoutSession } {
    const session = CHECKOUTS_STORE.get(sessionId);
    if (!session) throw new Error('Checkout session not found');

    session.state = 'completed';
    session.completedAt = new Date().toISOString();
    if (session.paymentSession) {
      session.paymentSession.status = 'succeeded';
    }

    const orderNumber = `LUM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      success: true,
      orderId,
      orderNumber,
      session,
    };
  }
}

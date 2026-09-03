/**
 * Global Commerce & Localization Core Service Engine (Module 32)
 * Comprehensive, decoupled multi-market resolution, pricing, currency, tax, shipping, and translation fallbacks.
 */

import {
  Market,
  CountryConfiguration,
  RegionConfiguration,
  LocaleConfiguration,
  CurrencyConfiguration,
  ExchangeRate,
  PriceList,
  PriceListEntry,
  TaxJurisdiction,
  HolidayCalendar,
  AddressSchema,
  PostalCodeRule,
  MarketContext,
  TranslationResource,
  TranslationNamespace,
  LocalizedSlug,
  MarketReadinessReport,
  MarketHealthDiagnostic,
  TextDirection,
} from '@/types/global-commerce.types';

// ============================================================================
// 1. DEFAULT DATA REGISTRY (DECOUPLED CONFIGURATION PRESETS)
// ============================================================================

export const DEFAULT_REGIONS: RegionConfiguration[] = [
  {
    id: 'reg-na',
    name: 'North America',
    code: 'NA',
    subregions: ['United States', 'Canada', 'Mexico'],
    countries: ['US', 'CA', 'MX'],
    defaultCurrency: 'USD',
    status: 'active',
  },
  {
    id: 'reg-eu',
    name: 'Europe',
    code: 'EU',
    subregions: ['Western Europe', 'Northern Europe', 'Southern Europe', 'DACH'],
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'GB', 'SE', 'CH'],
    defaultCurrency: 'EUR',
    status: 'active',
  },
  {
    id: 'reg-me',
    name: 'Middle East & GCC',
    code: 'ME',
    subregions: ['GCC', 'Levant'],
    countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'],
    defaultCurrency: 'AED',
    status: 'active',
  },
  {
    id: 'reg-apac',
    name: 'Asia Pacific',
    code: 'APAC',
    subregions: ['South Asia', 'East Asia', 'Southeast Asia', 'Australasia'],
    countries: ['IN', 'JP', 'SG', 'AU', 'NZ', 'KR'],
    defaultCurrency: 'INR',
    status: 'active',
  },
];

export const DEFAULT_COUNTRIES: CountryConfiguration[] = [
  {
    countryCode: 'US',
    name: 'United States',
    region: 'North America',
    subregion: 'US-Contiguous',
    defaultCurrency: 'USD',
    supportedLocales: ['en-US', 'es-US'],
    taxZone: 'tax-zone-us',
    shippingZone: 'ship-zone-na',
    supported: true,
    phoneCode: '+1',
    postalCodeRules: {
      pattern: '^\\d{5}(-\\d{4})?$',
      required: true,
      example: '90210 or 90210-1234',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'company', label: 'Company (Optional)', required: false, order: 2 },
        { name: 'address1', label: 'Street Address', required: true, order: 3 },
        { name: 'address2', label: 'Apartment, suite, etc.', required: false, order: 4 },
        { name: 'city', label: 'City', required: true, order: 5 },
        { name: 'state', label: 'State', required: true, order: 6 },
        { name: 'postalCode', label: 'ZIP Code', required: true, order: 7 },
      ],
      stateProvinceLabel: 'State',
      postalCodeLabel: 'ZIP Code',
    },
    unitSystem: 'imperial',
    flagEmoji: '🇺🇸',
    status: 'active',
  },
  {
    countryCode: 'CA',
    name: 'Canada',
    region: 'North America',
    subregion: 'Canada',
    defaultCurrency: 'CAD',
    supportedLocales: ['en-CA', 'fr-CA'],
    taxZone: 'tax-zone-ca',
    shippingZone: 'ship-zone-na',
    supported: true,
    phoneCode: '+1',
    postalCodeRules: {
      pattern: '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$',
      required: true,
      example: 'K1A 0B1',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'address1', label: 'Street Address', required: true, order: 2 },
        { name: 'city', label: 'City', required: true, order: 3 },
        { name: 'province', label: 'Province / Territory', required: true, order: 4 },
        { name: 'postalCode', label: 'Postal Code', required: true, order: 5 },
      ],
      stateProvinceLabel: 'Province',
      postalCodeLabel: 'Postal Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇨🇦',
    status: 'active',
  },
  {
    countryCode: 'DE',
    name: 'Germany',
    region: 'Europe',
    subregion: 'DACH',
    defaultCurrency: 'EUR',
    supportedLocales: ['de-DE', 'en-GB'],
    taxZone: 'tax-zone-eu-vat',
    shippingZone: 'ship-zone-eu',
    supported: true,
    phoneCode: '+49',
    postalCodeRules: {
      pattern: '^\\d{5}$',
      required: true,
      example: '10115',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'address1', label: 'Street & House Number', required: true, order: 2 },
        { name: 'postalCode', label: 'Postleitzahl (PLZ)', required: true, order: 3 },
        { name: 'city', label: 'Stadt', required: true, order: 4 },
      ],
      stateProvinceLabel: 'Region',
      postalCodeLabel: 'Postal Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇩🇪',
    status: 'active',
  },
  {
    countryCode: 'FR',
    name: 'France',
    region: 'Europe',
    subregion: 'Western Europe',
    defaultCurrency: 'EUR',
    supportedLocales: ['fr-FR', 'en-GB'],
    taxZone: 'tax-zone-eu-vat',
    shippingZone: 'ship-zone-eu',
    supported: true,
    phoneCode: '+33',
    postalCodeRules: {
      pattern: '^\\d{5}$',
      required: true,
      example: '75008',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Nom Complet', required: true, order: 1 },
        { name: 'address1', label: 'Adresse', required: true, order: 2 },
        { name: 'postalCode', label: 'Code Postal', required: true, order: 3 },
        { name: 'city', label: 'Ville', required: true, order: 4 },
      ],
      stateProvinceLabel: 'Region',
      postalCodeLabel: 'Postal Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇫🇷',
    status: 'active',
  },
  {
    countryCode: 'GB',
    name: 'United Kingdom',
    region: 'Europe',
    subregion: 'British Isles',
    defaultCurrency: 'GBP',
    supportedLocales: ['en-GB'],
    taxZone: 'tax-zone-uk-vat',
    shippingZone: 'ship-zone-uk',
    supported: true,
    phoneCode: '+44',
    postalCodeRules: {
      pattern: '^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$',
      required: true,
      example: 'SW1A 1AA',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'address1', label: 'Address Line 1', required: true, order: 2 },
        { name: 'address2', label: 'Address Line 2', required: false, order: 3 },
        { name: 'city', label: 'Town / City', required: true, order: 4 },
        { name: 'county', label: 'County', required: false, order: 5 },
        { name: 'postalCode', label: 'Postcode', required: true, order: 6 },
      ],
      stateProvinceLabel: 'County',
      postalCodeLabel: 'Postcode',
    },
    unitSystem: 'metric',
    flagEmoji: '🇬🇧',
    status: 'active',
  },
  {
    countryCode: 'IN',
    name: 'India',
    region: 'Asia Pacific',
    subregion: 'South Asia',
    defaultCurrency: 'INR',
    supportedLocales: ['en-IN', 'hi-IN'],
    taxZone: 'tax-zone-in-gst',
    shippingZone: 'ship-zone-in',
    supported: true,
    phoneCode: '+91',
    postalCodeRules: {
      pattern: '^\\d{6}$',
      required: true,
      example: '110001',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'address1', label: 'Flat, House no., Building, Street', required: true, order: 2 },
        { name: 'address2', label: 'Area, Colony, Sector, Village', required: false, order: 3 },
        { name: 'city', label: 'Town / City', required: true, order: 4 },
        { name: 'state', label: 'State', required: true, order: 5 },
        { name: 'postalCode', label: 'PIN Code', required: true, order: 6 },
      ],
      stateProvinceLabel: 'State',
      postalCodeLabel: 'PIN Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇮🇳',
    status: 'active',
  },
  {
    countryCode: 'AE',
    name: 'United Arab Emirates',
    region: 'Middle East & GCC',
    subregion: 'GCC',
    defaultCurrency: 'AED',
    supportedLocales: ['ar-AE', 'en-US'],
    taxZone: 'tax-zone-ae-vat',
    shippingZone: 'ship-zone-gcc',
    supported: true,
    phoneCode: '+971',
    postalCodeRules: {
      pattern: '.*', // UAE largely uses Makani or city without standard mandatory postal codes
      required: false,
      example: '00000 / N/A',
    },
    addressFormat: {
      fields: [
        { name: 'name', label: 'Full Name', required: true, order: 1 },
        { name: 'address1', label: 'Building, Street / Villa Number', required: true, order: 2 },
        { name: 'address2', label: 'Area / Landmark', required: true, order: 3 },
        { name: 'city', label: 'City', required: true, order: 4 },
        { name: 'state', label: 'Emirate', required: true, order: 5 },
      ],
      stateProvinceLabel: 'Emirate',
      postalCodeLabel: 'Postal Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇦🇪',
    status: 'active',
  },
  {
    countryCode: 'JP',
    name: 'Japan',
    region: 'Asia Pacific',
    subregion: 'East Asia',
    defaultCurrency: 'JPY',
    supportedLocales: ['ja-JP', 'en-US'],
    taxZone: 'tax-zone-jp-consumption',
    shippingZone: 'ship-zone-jp',
    supported: true,
    phoneCode: '+81',
    postalCodeRules: {
      pattern: '^\\d{3}-?\\d{4}$',
      required: true,
      example: '100-0001',
    },
    addressFormat: {
      fields: [
        { name: 'postalCode', label: 'Postal Code (〒)', required: true, order: 1 },
        { name: 'state', label: 'Prefecture (都道府県)', required: true, order: 2 },
        { name: 'city', label: 'City / Ward (市区町村)', required: true, order: 3 },
        { name: 'address1', label: 'Street Address (町域・番地)', required: true, order: 4 },
        { name: 'address2', label: 'Building Name (建物名・部屋番号)', required: false, order: 5 },
        { name: 'name', label: 'Full Name (お名前)', required: true, order: 6 },
      ],
      stateProvinceLabel: 'Prefecture',
      postalCodeLabel: 'Postal Code',
    },
    unitSystem: 'metric',
    flagEmoji: '🇯🇵',
    status: 'active',
  },
];

export const DEFAULT_LOCALES: LocaleConfiguration[] = [
  {
    code: 'en-US',
    language: 'English',
    region: 'United States',
    displayName: 'English (US)',
    nativeName: 'English (US)',
    direction: 'ltr',
    status: 'active',
  },
  {
    code: 'en-GB',
    language: 'English',
    region: 'United Kingdom',
    displayName: 'English (UK)',
    nativeName: 'English (UK)',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-US',
  },
  {
    code: 'fr-FR',
    language: 'Français',
    region: 'France',
    displayName: 'French (France)',
    nativeName: 'Français',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-US',
  },
  {
    code: 'de-DE',
    language: 'Deutsch',
    region: 'Germany',
    displayName: 'German (Germany)',
    nativeName: 'Deutsch',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-US',
  },
  {
    code: 'es-US',
    language: 'Español',
    region: 'United States',
    displayName: 'Spanish (US)',
    nativeName: 'Español',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-US',
  },
  {
    code: 'ar-AE',
    language: 'العربية',
    region: 'United Arab Emirates',
    displayName: 'Arabic (UAE)',
    nativeName: 'العربية (الإمارات)',
    direction: 'rtl',
    status: 'active',
    fallbackLocale: 'en-US',
  },
  {
    code: 'hi-IN',
    language: 'हिन्दी',
    region: 'India',
    displayName: 'Hindi (India)',
    nativeName: 'हिन्दी (भारत)',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-IN',
  },
  {
    code: 'ja-JP',
    language: '日本語',
    region: 'Japan',
    displayName: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    status: 'active',
    fallbackLocale: 'en-US',
  },
];

export const DEFAULT_CURRENCIES: CurrencyConfiguration[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: false,
    status: 'active',
    exchangeRateToBase: 1.0,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'suffix',
    spaceBetweenSymbolAndNumber: true,
    status: 'active',
    exchangeRateToBase: 0.92,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: false,
    status: 'active',
    exchangeRateToBase: 0.79,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: false,
    status: 'active',
    exchangeRateToBase: 83.5,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: true,
    status: 'active',
    exchangeRateToBase: 3.67,
    rateSource: 'fixed_peg',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    minorUnit: 100,
    decimalPlaces: 2,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: false,
    status: 'active',
    exchangeRateToBase: 1.36,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    minorUnit: 1, // 0 decimal places
    decimalPlaces: 0,
    symbolPosition: 'prefix',
    spaceBetweenSymbolAndNumber: false,
    status: 'active',
    exchangeRateToBase: 154.2,
    rateSource: 'ecb_reference',
    lastRateUpdate: new Date().toISOString(),
  },
];

export const INITIAL_MARKETS: Market[] = [
  {
    id: 'mkt-us',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    name: 'North America (Primary)',
    code: 'US',
    status: 'active',
    description: 'Primary market for United States and Canadian shoppers with USD/CAD pricing.',
    countries: ['US', 'CA'],
    regions: ['North America'],
    defaultLocale: 'en-US',
    supportedLocales: ['en-US', 'es-US', 'fr-CA'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'CAD'],
    priceListId: 'plist-na-standard',
    taxConfigurationId: 'tax-zone-us',
    shippingConfigurationId: 'ship-na-standard',
    paymentConfigurationId: 'pay-stripe-global',
    domainConfiguration: {
      domainType: 'shared',
      hostname: 'store.mavenco.com',
      sslStatus: 'active',
    },
    seoConfiguration: {
      hreflangCode: 'en-us',
      canonicalBaseUrl: 'https://store.mavenco.com',
      sitemapIndexEnabled: true,
    },
    metrics: {
      activeCustomers: 12450,
      monthlyGmvMinorUnits: 28450000, // $284,500.00
      orderCount: 3410,
      conversionRate: 3.82,
    },
    healthScore: 98,
    version: 1,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mkt-eu',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    name: 'European Union & UK',
    code: 'EU',
    status: 'active',
    description: 'Eurozone and UK market with VAT inclusive pricing and multi-lingual catalog.',
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'GB'],
    regions: ['Europe'],
    defaultLocale: 'de-DE',
    supportedLocales: ['de-DE', 'fr-FR', 'en-GB'],
    defaultCurrency: 'EUR',
    supportedCurrencies: ['EUR', 'GBP'],
    priceListId: 'plist-eu-vat-inclusive',
    taxConfigurationId: 'tax-zone-eu-vat',
    shippingConfigurationId: 'ship-eu-dhl',
    domainConfiguration: {
      domainType: 'subdirectory',
      hostname: 'store.mavenco.com',
      pathPrefix: '/eu',
      sslStatus: 'active',
    },
    seoConfiguration: {
      hreflangCode: 'de-de',
      canonicalBaseUrl: 'https://store.mavenco.com/eu',
      sitemapIndexEnabled: true,
    },
    metrics: {
      activeCustomers: 8120,
      monthlyGmvMinorUnits: 17200000, // €172,000.00
      orderCount: 1980,
      conversionRate: 3.15,
    },
    healthScore: 94,
    version: 1,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mkt-in',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    name: 'India & South Asia',
    code: 'IN',
    status: 'active',
    description: 'Fast growing Indian commerce hub with GST invoicing and UPI payments.',
    countries: ['IN'],
    regions: ['Asia Pacific'],
    defaultLocale: 'en-IN',
    supportedLocales: ['en-IN', 'hi-IN'],
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR'],
    priceListId: 'plist-in-gst-inclusive',
    taxConfigurationId: 'tax-zone-in-gst',
    shippingConfigurationId: 'ship-in-delhivery',
    domainConfiguration: {
      domainType: 'subdirectory',
      hostname: 'store.mavenco.com',
      pathPrefix: '/in',
      sslStatus: 'active',
    },
    seoConfiguration: {
      hreflangCode: 'en-in',
      canonicalBaseUrl: 'https://store.mavenco.com/in',
      sitemapIndexEnabled: true,
    },
    metrics: {
      activeCustomers: 15800,
      monthlyGmvMinorUnits: 980000000, // ₹9,800,000.00 (in minor units)
      orderCount: 5200,
      conversionRate: 4.45,
    },
    healthScore: 96,
    version: 1,
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mkt-gcc',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    name: 'Middle East & GCC',
    code: 'GCC',
    status: 'active',
    description: 'Middle East regional hub with full Arabic RTL and AED pricing.',
    countries: ['AE', 'SA', 'QA', 'KW'],
    regions: ['Middle East & GCC'],
    defaultLocale: 'ar-AE',
    supportedLocales: ['ar-AE', 'en-US'],
    defaultCurrency: 'AED',
    supportedCurrencies: ['AED', 'USD'],
    priceListId: 'plist-gcc-luxury',
    taxConfigurationId: 'tax-zone-ae-vat',
    shippingConfigurationId: 'ship-gcc-aramex',
    domainConfiguration: {
      domainType: 'subdirectory',
      hostname: 'store.mavenco.com',
      pathPrefix: '/gcc',
      sslStatus: 'active',
    },
    seoConfiguration: {
      hreflangCode: 'ar-ae',
      canonicalBaseUrl: 'https://store.mavenco.com/gcc',
      sitemapIndexEnabled: true,
    },
    metrics: {
      activeCustomers: 4320,
      monthlyGmvMinorUnits: 65400000, // 654,000.00 AED
      orderCount: 840,
      conversionRate: 2.94,
    },
    healthScore: 92,
    version: 1,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_TRANSLATIONS: TranslationResource[] = [
  // English (US)
  { id: 'tr-1', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'en-US', namespace: 'common', key: 'welcome', value: 'Welcome to our Global Store', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-2', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'en-US', namespace: 'common', key: 'add_to_cart', value: 'Add to Cart', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-3', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'en-US', namespace: 'checkout', key: 'pay_securely', value: 'Complete Secure Checkout', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-4', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'en-US', namespace: 'product', key: 'in_stock', value: 'In Stock - Ready to Ship', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-5', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'en-US', namespace: 'cart', key: 'free_shipping_notice', value: 'Free express shipping on international orders over $150', status: 'published', version: 1, updatedAt: '2026-03-01' },

  // German (DE)
  { id: 'tr-6', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'de-DE', namespace: 'common', key: 'welcome', value: 'Willkommen in unserem Store', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-7', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'de-DE', namespace: 'common', key: 'add_to_cart', value: 'In den Warenkorb', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-8', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'de-DE', namespace: 'checkout', key: 'pay_securely', value: 'Sicher zur Kasse', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-9', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'de-DE', namespace: 'product', key: 'in_stock', value: 'Auf Lager - Sofort lieferbar', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-10', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'de-DE', namespace: 'cart', key: 'free_shipping_notice', value: 'Kostenloser Expressversand ab 150 €', status: 'published', version: 1, updatedAt: '2026-03-01' },

  // French (FR)
  { id: 'tr-11', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'fr-FR', namespace: 'common', key: 'welcome', value: 'Bienvenue sur notre boutique', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-12', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'fr-FR', namespace: 'common', key: 'add_to_cart', value: 'Ajouter au panier', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-13', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'fr-FR', namespace: 'checkout', key: 'pay_securely', value: 'Paiement 100% Sécurisé', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-14', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'fr-FR', namespace: 'product', key: 'in_stock', value: 'En stock - Expédition immédiate', status: 'published', version: 1, updatedAt: '2026-03-01' },

  // Arabic (AE - RTL)
  { id: 'tr-15', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'ar-AE', namespace: 'common', key: 'welcome', value: 'مرحباً بكم في متجرنا العالمي', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-16', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'ar-AE', namespace: 'common', key: 'add_to_cart', value: 'أضف إلى السلة', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-17', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'ar-AE', namespace: 'checkout', key: 'pay_securely', value: 'إتمام الطلب بأمان', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-18', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'ar-AE', namespace: 'product', key: 'in_stock', value: 'متوفر في المخزون - جاهز للشحن', status: 'published', version: 1, updatedAt: '2026-03-01' },

  // Hindi (IN)
  { id: 'tr-19', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'hi-IN', namespace: 'common', key: 'welcome', value: 'हमारे ग्लोबल स्टोर में आपका स्वागत है', status: 'published', version: 1, updatedAt: '2026-03-01' },
  { id: 'tr-20', tenantId: 'tenant-demo', storeId: 'store-main', locale: 'hi-IN', namespace: 'common', key: 'add_to_cart', value: 'कार्ट में जोड़ें', status: 'published', version: 1, updatedAt: '2026-03-01' },
];

export const INITIAL_PRICE_LISTS: PriceList[] = [
  {
    id: 'plist-na-standard',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    marketId: 'mkt-us',
    name: 'North America Base Price List',
    code: 'PL-USD-STANDARD',
    currency: 'USD',
    priority: 10,
    status: 'active',
    roundingRule: 'round_99',
    entries: [
      { productId: 'prod-1', priceMinorUnits: 19999, compareAtPriceMinorUnits: 24999 },
      { productId: 'prod-2', priceMinorUnits: 8999, compareAtPriceMinorUnits: 11999 },
      { productId: 'prod-3', priceMinorUnits: 4999 },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'plist-eu-vat-inclusive',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    marketId: 'mkt-eu',
    name: 'Eurozone VAT-Inclusive Price List',
    code: 'PL-EUR-VAT',
    currency: 'EUR',
    priority: 20,
    status: 'active',
    roundingRule: 'round_95',
    entries: [
      { productId: 'prod-1', priceMinorUnits: 18995, compareAtPriceMinorUnits: 22995 },
      { productId: 'prod-2', priceMinorUnits: 8495, compareAtPriceMinorUnits: 10995 },
      { productId: 'prod-3', priceMinorUnits: 4695 },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'plist-in-gst-inclusive',
    tenantId: 'tenant-demo',
    storeId: 'store-main',
    marketId: 'mkt-in',
    name: 'India Regional Price List (GST Inclusive)',
    code: 'PL-INR-GST',
    currency: 'INR',
    priority: 20,
    status: 'active',
    roundingRule: 'round_00',
    entries: [
      { productId: 'prod-1', priceMinorUnits: 1499900, compareAtPriceMinorUnits: 1899900 },
      { productId: 'prod-2', priceMinorUnits: 699900, compareAtPriceMinorUnits: 899900 },
      { productId: 'prod-3', priceMinorUnits: 399900 },
    ],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

// ============================================================================
// 2. GLOBAL COMMERCE SERVICE CLASS
// ============================================================================

export class GlobalCommerceService {
  private static markets: Market[] = [...INITIAL_MARKETS];
  private static countries: CountryConfiguration[] = [...DEFAULT_COUNTRIES];
  private static locales: LocaleConfiguration[] = [...DEFAULT_LOCALES];
  private static currencies: CurrencyConfiguration[] = [...DEFAULT_CURRENCIES];
  private static translations: TranslationResource[] = [...INITIAL_TRANSLATIONS];
  private static priceLists: PriceList[] = [...INITIAL_PRICE_LISTS];

  // --------------------------------------------------------------------------
  // Market Resolution Engine (Deterministic 6-Step Fallback)
  // --------------------------------------------------------------------------
  public static resolveMarket(params: {
    explicitMarketCode?: string;
    hostname?: string;
    urlPath?: string;
    requestedLocale?: string;
    countryCode?: string;
    tenantId?: string;
    storeId?: string;
  }): MarketContext {
    let markets = this.markets.filter(
      (m) => m.status === 'active' && (!params.tenantId || m.tenantId === params.tenantId)
    );
    if (markets.length === 0) {
      markets = this.markets.filter((m) => m.status === 'active');
    }

    let resolvedMarket: Market | undefined;

    // Step 1: Explicit market code (from session, cookie, or header)
    if (params.explicitMarketCode) {
      resolvedMarket = markets.find(
        (m) => m.code.toLowerCase() === params.explicitMarketCode?.toLowerCase()
      );
    }

    // Step 2: Path prefix match (e.g. /eu, /in, /gcc)
    if (!resolvedMarket && params.urlPath) {
      resolvedMarket = markets.find(
        (m) => m.domainConfiguration?.pathPrefix && params.urlPath?.startsWith(m.domainConfiguration.pathPrefix)
      );
    }

    // Step 3: Domain / Hostname match
    if (!resolvedMarket && params.hostname) {
      resolvedMarket = markets.find(
        (m) => m.domainConfiguration?.hostname?.toLowerCase() === params.hostname?.toLowerCase()
      );
    }

    // Step 4: Country ISO Alpha-2 match
    if (!resolvedMarket && params.countryCode) {
      const code = params.countryCode.toUpperCase();
      resolvedMarket = markets.find((m) => m.countries.includes(code));
    }

    // Step 5: Locale match
    if (!resolvedMarket && params.requestedLocale) {
      resolvedMarket = markets.find((m) =>
        m.supportedLocales.some((l) => l.toLowerCase() === params.requestedLocale?.toLowerCase())
      );
    }

    // Step 6: Store Primary Default Market
    if (!resolvedMarket) {
      resolvedMarket = markets[0] || INITIAL_MARKETS[0];
    }

    // Determine target country
    const targetCountryCode =
      params.countryCode && resolvedMarket.countries.includes(params.countryCode.toUpperCase())
        ? params.countryCode.toUpperCase()
        : resolvedMarket.countries[0] || 'US';

    const countryConfig = this.countries.find((c) => c.countryCode === targetCountryCode) || this.countries[0];

    // Determine locale & text direction
    const targetLocale =
      params.requestedLocale && resolvedMarket.supportedLocales.includes(params.requestedLocale)
        ? params.requestedLocale
        : resolvedMarket.defaultLocale;

    const localeConfig = this.locales.find((l) => l.code === targetLocale) || this.locales[0];

    return {
      tenantId: resolvedMarket.tenantId,
      storeId: resolvedMarket.storeId,
      marketId: resolvedMarket.id,
      marketCode: resolvedMarket.code,
      countryCode: targetCountryCode,
      regionCode: countryConfig?.region || 'North America',
      locale: targetLocale,
      currency: resolvedMarket.defaultCurrency,
      timezone: targetCountryCode === 'IN' ? 'Asia/Kolkata' : targetCountryCode === 'DE' ? 'Europe/Berlin' : 'America/New_York',
      direction: localeConfig?.direction || 'ltr',
      taxZoneId: resolvedMarket.taxConfigurationId,
      shippingZoneId: resolvedMarket.shippingConfigurationId,
      priceListId: resolvedMarket.priceListId,
      taxDisplayMode: resolvedMarket.code === 'EU' || resolvedMarket.code === 'IN' ? 'inclusive' : 'exclusive',
    };
  }

  // --------------------------------------------------------------------------
  // Localization & Translation Engine (5-Tier Fallback Hierarchy)
  // --------------------------------------------------------------------------
  public static translate(params: {
    key: string;
    namespace: TranslationNamespace;
    locale: string;
    marketDefaultLocale?: string;
    fallbackValue?: string;
  }): { value: string; resolvedLocale: string; fallbackTier: number } {
    const { key, namespace, locale, marketDefaultLocale, fallbackValue } = params;

    // Tier 1: Exact Locale Match (e.g. fr-CA)
    const exactMatch = this.translations.find(
      (t) => t.namespace === namespace && t.key === key && t.locale === locale && t.status === 'published'
    );
    if (exactMatch) return { value: exactMatch.value, resolvedLocale: locale, fallbackTier: 1 };

    // Tier 2: Base Language Locale (e.g. 'fr' from 'fr-CA')
    const langCode = locale.split('-')[0];
    const langMatch = this.translations.find(
      (t) => t.namespace === namespace && t.key === key && t.locale.startsWith(langCode) && t.status === 'published'
    );
    if (langMatch) return { value: langMatch.value, resolvedLocale: langMatch.locale, fallbackTier: 2 };

    // Tier 3: Market Default Locale
    if (marketDefaultLocale && marketDefaultLocale !== locale) {
      const marketMatch = this.translations.find(
        (t) => t.namespace === namespace && t.key === key && t.locale === marketDefaultLocale && t.status === 'published'
      );
      if (marketMatch) return { value: marketMatch.value, resolvedLocale: marketDefaultLocale, fallbackTier: 3 };
    }

    // Tier 4: Platform Default Locale ('en-US')
    const platformMatch = this.translations.find(
      (t) => t.namespace === namespace && t.key === key && t.locale === 'en-US' && t.status === 'published'
    );
    if (platformMatch) return { value: platformMatch.value, resolvedLocale: 'en-US', fallbackTier: 4 };

    // Tier 5: Code Fallback or Raw Key
    return {
      value: fallbackValue || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      resolvedLocale: 'fallback',
      fallbackTier: 5,
    };
  }

  // --------------------------------------------------------------------------
  // Currency Conversion & Arithmetic (Integer Minor Units Safe)
  // --------------------------------------------------------------------------
  public static formatMoney(minorUnits: number, currencyCode: string, localeCode = 'en-US'): string {
    const currency = this.currencies.find((c) => c.code === currencyCode) || this.currencies[0];
    const amount = minorUnits / (currency.minorUnit || 100);

    try {
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currency.decimalPlaces,
        maximumFractionDigits: currency.decimalPlaces,
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toFixed(currency.decimalPlaces)}`;
    }
  }

  public static convertMoney(params: {
    minorUnits: number;
    fromCurrency: string;
    toCurrency: string;
    roundingRule?: 'none' | 'round_99' | 'round_95' | 'round_00' | 'ceil';
  }): { minorUnits: number; formatted: string; exchangeRate: number } {
    const { minorUnits, fromCurrency, toCurrency, roundingRule = 'none' } = params;

    if (fromCurrency === toCurrency) {
      return {
        minorUnits,
        formatted: this.formatMoney(minorUnits, toCurrency),
        exchangeRate: 1.0,
      };
    }

    const fromConfig = this.currencies.find((c) => c.code === fromCurrency) || this.currencies[0];
    const toConfig = this.currencies.find((c) => c.code === toCurrency) || this.currencies[0];

    // Normalized to base USD
    const rateToBase = fromConfig.exchangeRateToBase || 1.0;
    const rateToTarget = toConfig.exchangeRateToBase || 1.0;
    const effectiveRate = rateToTarget / rateToBase;

    // Calculation in double then converted back to integer minor units
    const baseUnits = minorUnits / (fromConfig.minorUnit || 100);
    const convertedAmount = baseUnits * effectiveRate;
    let convertedMinorUnits = Math.round(convertedAmount * (toConfig.minorUnit || 100));

    // Apply Rounding Rule
    if (roundingRule === 'round_99') {
      const whole = Math.floor(convertedMinorUnits / 100) * 100;
      convertedMinorUnits = whole + 99;
    } else if (roundingRule === 'round_95') {
      const whole = Math.floor(convertedMinorUnits / 100) * 100;
      convertedMinorUnits = whole + 95;
    } else if (roundingRule === 'round_00') {
      convertedMinorUnits = Math.ceil(convertedMinorUnits / 100) * 100;
    }

    return {
      minorUnits: convertedMinorUnits,
      formatted: this.formatMoney(convertedMinorUnits, toCurrency),
      exchangeRate: effectiveRate,
    };
  }

  // --------------------------------------------------------------------------
  // Market Diagnostics & Readiness Engine
  // --------------------------------------------------------------------------
  public static evaluateMarketReadiness(marketId: string): MarketReadinessReport {
    const market = this.markets.find((m) => m.id === marketId) || this.markets[0];
    const diagnostics: MarketHealthDiagnostic[] = [];

    // Check 1: Supported Countries
    if (market.countries.length > 0) {
      diagnostics.push({
        category: 'catalog',
        name: 'Country Coverage',
        status: 'pass',
        message: `${market.countries.length} countries configured (${market.countries.join(', ')}).`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'catalog',
        name: 'Country Coverage',
        status: 'fail',
        message: 'No countries assigned to this market.',
        impact: 'critical',
      });
    }

    // Check 2: Price List Assignment
    const priceList = this.priceLists.find((p) => p.id === market.priceListId);
    if (priceList && priceList.status === 'active') {
      diagnostics.push({
        category: 'pricing',
        name: 'Price List Configuration',
        status: 'pass',
        message: `Active price list '${priceList.name}' (${priceList.entries.length} entries).`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'pricing',
        name: 'Price List Configuration',
        status: 'warning',
        message: 'No dedicated price list; relying on currency conversion fallback.',
        impact: 'medium',
      });
    }

    // Check 3: Tax Configuration
    if (market.taxConfigurationId) {
      diagnostics.push({
        category: 'tax',
        name: 'Tax Jurisdiction Setup',
        status: 'pass',
        message: `Tax zone '${market.taxConfigurationId}' assigned.`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'tax',
        name: 'Tax Jurisdiction Setup',
        status: 'warning',
        message: 'Tax configuration not linked; automatic tax calculation disabled.',
        impact: 'high',
      });
    }

    // Check 4: Shipping Logistics
    if (market.shippingConfigurationId) {
      diagnostics.push({
        category: 'shipping',
        name: 'Fulfillment & Carrier Routing',
        status: 'pass',
        message: `Shipping zone '${market.shippingConfigurationId}' mapped.`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'shipping',
        name: 'Fulfillment & Carrier Routing',
        status: 'fail',
        message: 'No shipping methods available for market countries.',
        impact: 'critical',
      });
    }

    // Check 5: Domain & SSL
    if (market.domainConfiguration?.sslStatus === 'active') {
      diagnostics.push({
        category: 'domain',
        name: 'Domain & SSL Verification',
        status: 'pass',
        message: `Domain '${market.domainConfiguration.hostname || 'shared'}' active with SSL.`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'domain',
        name: 'Domain & SSL Verification',
        status: 'warning',
        message: 'Custom domain pending DNS verification or SSL issuance.',
        impact: 'medium',
      });
    }

    // Check 6: Translations
    const translatedCount = this.translations.filter(
      (t) => market.supportedLocales.includes(t.locale) && t.status === 'published'
    ).length;
    if (translatedCount >= 4) {
      diagnostics.push({
        category: 'localization',
        name: 'Catalog & UI Translations',
        status: 'pass',
        message: `${translatedCount} published translation keys found for market locales.`,
        impact: 'low',
      });
    } else {
      diagnostics.push({
        category: 'localization',
        name: 'Catalog & UI Translations',
        status: 'warning',
        message: 'Low translation coverage; shoppers may see fallback English strings.',
        impact: 'medium',
      });
    }

    // Calculate score
    const passCount = diagnostics.filter((d) => d.status === 'pass').length;
    const failCount = diagnostics.filter((d) => d.status === 'fail').length;
    const score = Math.round((passCount / diagnostics.length) * 100);

    const overallStatus = failCount > 0 ? 'blocked' : score >= 85 ? 'ready' : 'warning';

    return {
      marketId: market.id,
      marketCode: market.code,
      marketName: market.name,
      overallStatus,
      readinessPercentage: score,
      diagnostics,
      updatedAt: new Date().toISOString(),
    };
  }

  // --------------------------------------------------------------------------
  // Data Access & Mutators
  // --------------------------------------------------------------------------
  public static listMarkets(): Market[] {
    return this.markets;
  }

  public static getMarket(id: string): Market | undefined {
    return this.markets.find((m) => m.id === id);
  }

  public static createMarket(market: Omit<Market, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Market {
    const newMarket: Market = {
      ...market,
      id: `mkt-${Date.now().toString(36)}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.markets.unshift(newMarket);
    return newMarket;
  }

  public static updateMarket(id: string, updates: Partial<Market>): Market {
    const index = this.markets.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Market not found: ${id}`);
    const updated = {
      ...this.markets[index],
      ...updates,
      version: (this.markets[index].version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
    this.markets[index] = updated;
    return updated;
  }

  public static listCountries(): CountryConfiguration[] {
    return this.countries;
  }

  public static listLocales(): LocaleConfiguration[] {
    return this.locales;
  }

  public static listCurrencies(): CurrencyConfiguration[] {
    return this.currencies;
  }

  public static listTranslations(locale?: string, namespace?: TranslationNamespace): TranslationResource[] {
    return this.translations.filter((t) => {
      if (locale && t.locale !== locale) return false;
      if (namespace && t.namespace !== namespace) return false;
      return true;
    });
  }

  public static upsertTranslation(
    translation: Omit<TranslationResource, 'id' | 'version' | 'updatedAt'>
  ): TranslationResource {
    const existingIndex = this.translations.findIndex(
      (t) => t.locale === translation.locale && t.namespace === translation.namespace && t.key === translation.key
    );

    if (existingIndex !== -1) {
      const updated: TranslationResource = {
        ...this.translations[existingIndex],
        ...translation,
        version: (this.translations[existingIndex].version || 1) + 1,
        updatedAt: new Date().toISOString(),
      };
      this.translations[existingIndex] = updated;
      return updated;
    } else {
      const created: TranslationResource = {
        ...translation,
        id: `tr-${Date.now().toString(36)}`,
        version: 1,
        updatedAt: new Date().toISOString(),
      };
      this.translations.unshift(created);
      return created;
    }
  }

  public static listPriceLists(): PriceList[] {
    return this.priceLists;
  }
}

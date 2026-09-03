/**
 * Module 37: Commerce Test Fixtures
 * Standardized mock datasets for Multi-Market, Currencies, Tax Rules, and Shipping Zones.
 */

export const FIXTURE_MARKETS = [
  {
    id: 'market_us',
    code: 'US',
    name: 'United States Domestic',
    countries: ['US'],
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD'],
    defaultLocale: 'en-US',
    taxZoneId: 'tz_us_sales_tax',
    shippingZoneId: 'sz_north_america',
    status: 'active' as const,
  },
  {
    id: 'market_uk',
    code: 'GB',
    name: 'United Kingdom',
    countries: ['GB'],
    defaultCurrency: 'GBP',
    supportedCurrencies: ['GBP', 'EUR'],
    defaultLocale: 'en-GB',
    taxZoneId: 'tz_uk_vat',
    shippingZoneId: 'sz_europe',
    status: 'active' as const,
  },
  {
    id: 'market_in',
    code: 'IN',
    name: 'India & South Asia',
    countries: ['IN'],
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR'],
    defaultLocale: 'en-IN',
    taxZoneId: 'tz_in_gst',
    shippingZoneId: 'sz_india_domestic',
    status: 'active' as const,
  },
];

export const FIXTURE_CURRENCIES = {
  USD: { symbol: '$', decimalPlaces: 2, exchangeRateFromUSD: 1.0 },
  EUR: { symbol: '€', decimalPlaces: 2, exchangeRateFromUSD: 0.92 },
  GBP: { symbol: '£', decimalPlaces: 2, exchangeRateFromUSD: 0.79 },
  INR: { symbol: '₹', decimalPlaces: 2, exchangeRateFromUSD: 83.5 },
};

export const FIXTURE_TAX_RULES = [
  {
    id: 'tax_standard_vat',
    name: 'Standard VAT 20%',
    ratePercentage: 20.0,
    calculationMode: 'inclusive' as const, // Tax inclusive for UK/EU
    applicableCategories: ['all'],
  },
  {
    id: 'tax_us_state_sales',
    name: 'NY State Sales Tax 8.875%',
    ratePercentage: 8.875,
    calculationMode: 'exclusive' as const, // Tax exclusive for US
    applicableCategories: ['all'],
  },
];

export const FIXTURE_SHIPPING_RULES = [
  {
    id: 'ship_standard',
    name: 'Standard Atelier Delivery',
    baseRateMinor: 1500, // $15.00
    freeThresholdMinor: 25000, // Free over $250.00
    estimatedDays: '3-5 business days',
  },
  {
    id: 'ship_express',
    name: 'White-Glove Express Air',
    baseRateMinor: 4500, // $45.00
    freeThresholdMinor: 50000, // Free over $500.00
    estimatedDays: '1-2 business days',
  },
];

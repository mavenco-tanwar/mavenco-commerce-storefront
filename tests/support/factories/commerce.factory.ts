/**
 * Module 37: Commerce Domain Factories
 * Produces valid, type-safe domain entities for Unit, Integration, and Security test suites.
 */

import { TenantRegistryRecord } from '@/types/platform-control.types';
import { PimProduct } from '@/types/pim-commerce.types';
import { Storefront } from '@/types/tenant-governance.types';
import { Subscription } from '@/types/subscription-commerce.types';

export class CommerceFactory {
  public static createTenant(overrides: Partial<TenantRegistryRecord> = {}): TenantRegistryRecord {
    const slug = overrides.slug || `tenant_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      tenantId: slug,
      slug,
      name: overrides.name || `Atelier ${slug}`,
      status: 'active',
      databaseIdentifier: `tenant_${slug}`,
      planId: 'plan_growth',
      planName: 'Growth Commerce Tier',
      storesCount: 1,
      customDomainsCount: 1,
      mrrMinor: 29900,
      health: 'healthy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  public static createProduct(overrides: Partial<PimProduct> = {}): PimProduct {
    const id = overrides.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      id,
      sku: `SKU-${id.toUpperCase()}`,
      title: 'Silk Brocade Evening Gown',
      slug: `silk-brocade-${id}`,
      description: 'Handcrafted mulberry silk with zari weave',
      status: 'published',
      productType: 'physical',
      catalogs: ['master_catalog'],
      categories: ['apparel', 'dresses'],
      brandId: 'brand_lumina',
      attributes: {
        fabric: 'Mulberry Silk',
        origin: 'Varanasi',
      },
      variants: [
        {
          id: `var_${id}_s`,
          productId: id,
          sku: `SKU-${id.toUpperCase()}-S`,
          barcode: '8901234567890',
          title: 'Small / Rose Gold',
          optionValues: { size: 'S', color: 'Rose Gold' },
          priceReference: { basePrice: 29500, currency: 'USD' },
          weight: 450,
          status: 'active',
        },
        {
          id: `var_${id}_m`,
          productId: id,
          sku: `SKU-${id.toUpperCase()}-M`,
          barcode: '8901234567891',
          title: 'Medium / Rose Gold',
          optionValues: { size: 'M', color: 'Rose Gold' },
          priceReference: { basePrice: 29500, currency: 'USD' },
          weight: 470,
          status: 'active',
        },
      ],
      media: [
        {
          id: 'med_1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
          isPrimary: true,
          displayOrder: 1,
        },
      ],
      pricing: {
        basePrice: 29500,
        currency: 'USD',
      },
      completenessScore: 100,
      qualityScore: 95,
      readinessState: 'ready',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  public static createCart(overrides: Record<string, any> = {}) {
    return {
      id: `cart_${Date.now()}`,
      tenantId: 'lumina',
      currency: 'USD',
      items: [
        {
          id: 'item_1',
          productId: 'prod_101',
          variantId: 'var_101_s',
          title: 'Silk Brocade Evening Gown',
          quantity: 2,
          unitPriceMinor: 29500,
          totalPriceMinor: 59000,
        },
      ],
      subtotalMinor: 59000,
      discountMinor: 0,
      shippingMinor: 1500,
      taxMinor: 4720,
      totalMinor: 65220,
      ...overrides,
    };
  }

  public static createSubscription(overrides: Partial<Subscription> = {}): Subscription {
    const id = overrides.id || `sub_${Date.now()}`;
    return {
      id,
      tenantId: 'lumina',
      storeId: 'store_primary',
      customerId: 'cust_901',
      status: 'active',
      planId: 'plan_monthly_luxe',
      productId: 'prod_101',
      variantId: 'var_101_s',
      currency: 'USD',
      currentPrice: { basePrice: 19900, currency: 'USD' },
      quantity: 1,
      billingInterval: { unit: 'month', count: 1 },
      deliveryInterval: { unit: 'month', count: 1 },
      currentPeriodStartsAt: '2026-09-01T00:00:00.000Z',
      currentPeriodEndsAt: '2026-10-01T00:00:00.000Z',
      nextBillingDate: '2026-10-01T00:00:00.000Z',
      paymentMethodId: 'pm_card_99',
      shippingAddress: {
        firstName: 'Elena',
        lastName: 'Rostova',
        addressLine1: '742 Evergreen Terrace',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      },
      dunningAttemptCount: 0,
      failedPaymentHistory: [],
      consecutiveSuccessfulOrders: 3,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
      ...overrides,
    };
  }
}

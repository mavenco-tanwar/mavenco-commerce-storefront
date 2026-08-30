import { Product, ProductImage, ProductSize, ProductColor, Department } from '@/types/product';
import { Category } from '@/types/category';
import { Order, OrderStatus, TrackingStep, ShippingAddress, PaymentDetails } from '@/types/order';
import { UserProfile, Address } from '@/types/auth';

/**
 * Maps a CMS Product response to the Storefront Product model.
 */
export function mapCmsProductToStorefrontProduct(cms: any): Product {
  const custom = typeof cms.customFields === 'string'
    ? JSON.parse(cms.customFields)
    : cms.customFields || {};

  // Extract department from customFields or category slug
  let department: Department = custom.department || 'women';
  if (cms.category?.slug === 'kids' || cms.category?.slug?.startsWith('kids-') || cms.category?.slug?.startsWith('girls-') || cms.category?.slug?.startsWith('boys-')) {
    department = 'kids';
  }

  // Extract Images
  const rawImages = typeof cms.images === 'string' ? JSON.parse(cms.images) : cms.images || [];
  const images: ProductImage[] = rawImages.map((img: any, idx: number) => ({
    url: img.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    alt: img.altText || img.alt || cms.title,
    isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
  }));

  if (images.length === 0) {
    images.push({
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      alt: cms.title,
      isPrimary: true,
    });
  }

  // Extract Options (Size, Color)
  const rawOptions = typeof cms.options === 'string' ? JSON.parse(cms.options) : cms.options || [];
  const sizeOption = rawOptions.find((o: any) => o.name?.toLowerCase() === 'size');
  const colorOption = rawOptions.find((o: any) => o.name?.toLowerCase() === 'color');

  // Extract sizes
  const sizes: ProductSize[] = (sizeOption?.values || ['XS', 'S', 'M', 'L', 'XL']).map((s: string) => ({
    size: s,
    inStock: true,
    stockCount: 15,
  }));

  // Extract colors with hex lookup
  const colorHexMap: Record<string, string> = {
    'Blush Pink': '#E8B8B5',
    'Dusty Rose': '#C98282',
    'Rose Gold': '#B77A68',
    'Ivory Cream': '#F8F1EA',
    'Ivory White': '#FFFDFC',
    'Oatmeal Beige': '#E5DDD5',
    'Sage Mist': '#C8D5C8',
    'Powder Blue': '#D0E1FD',
    'Lavender Glow': '#E6D7F2',
    'Mint Frost': '#D6F2E6',
    'Rose Gold & Beige': '#B77A68',
    'Royal Navy & Ivory': '#1A2B49',
    'Emerald & Gold': '#1B4D3E',
    'Lilac Bloom': '#D8BFD8',
    'Mustard Honey': '#E1A95F',
    'Sky Denim': '#8CB8D8',
  };

  const colors: ProductColor[] = (colorOption?.values || ['Blush Pink', 'Rose Gold', 'Ivory']).map((c: string) => ({
    name: c,
    hex: colorHexMap[c] || '#111111',
  }));

  // Compare at price & discount calculation
  const price = Number(cms.price) || 0;
  const compareAtPrice = Number(cms.compareAtPrice) || undefined;
  const discountPercent = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : undefined;

  // Features list from description or custom fields
  const features: string[] = Array.isArray(custom.features)
    ? custom.features
    : [
        'Artisanal hand-finished craftsmanship',
        'Premium natural fabric with breathable softness',
        'Tailored modern silhouette with comfortable fit',
        'Concealed premium zipper & quality lining',
      ];

  const careInstructions: string[] = Array.isArray(custom.careInstructions)
    ? custom.careInstructions
    : custom.care
    ? [custom.care]
    : ['Dry clean or gentle hand wash in cold water', 'Do not bleach', 'Steam iron only'];

  return {
    id: cms.id,
    name: cms.title,
    slug: cms.slug,
    sku: cms.sku || `JQT-${cms.id}`,
    department,
    category: cms.category?.slug || cms.categoryId || 'dresses',
    categoryName: cms.category?.name || 'Fashion Collection',
    price,
    compareAtPrice,
    discountPercent,
    shortDescription: cms.shortDescription || cms.title,
    description: (cms.descriptionHtml || cms.shortDescription || '')
      .replace(/<[^>]*>?/gm, '')
      .trim(),
    features,
    fabric: custom.fabric || 'Pure breathable natural fabric with soft crepe lining',
    careInstructions,
    images,
    colors,
    sizes,
    rating: Number(custom.rating) || 4.8,
    reviewCount: Number(custom.reviewCount) || 24,
    isFeatured: Boolean(custom.isFeatured || cms.isFeatured),
    isNewArrival: Boolean(custom.isNewArrival),
    isBestSeller: Boolean(custom.isBestSeller),
    isSale: Boolean(discountPercent && discountPercent > 0),
    badge: custom.badge || (discountPercent ? `${discountPercent}% OFF` : undefined),
    tags: Array.isArray(cms.tags) ? cms.tags : [],
    fit: custom.fit || 'Regular fit, true to size',
    modelInfo: custom.modelInfo || 'Model is 5ft 8in wearing size S',
  };
}

/**
 * Maps a CMS Category response to the Storefront Category model.
 */
export function mapCmsCategoryToStorefrontCategory(cms: any, allCategories: any[] = []): Category {
  const subcats = allCategories
    .filter((c: any) => c.parentId === cms.id)
    .map((s: any) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      itemCount: 12,
    }));

  return {
    id: cms.id,
    name: cms.name,
    slug: cms.slug,
    department: cms.slug === 'kids' || cms.slug?.startsWith('kids-') ? 'kids' : 'women',
    description: cms.description || '',
    imageUrl: cms.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    featured: Boolean(cms.isVisible),
    subcategories: subcats,
  };
}

/**
 * Maps a CMS Order response to the Storefront Order model.
 */
export function mapCmsOrderToStorefrontOrder(cms: any): Order {
  const items = typeof cms.items === 'string' ? JSON.parse(cms.items) : cms.items || [];
  const shippingAddress = typeof cms.shippingAddress === 'string' ? JSON.parse(cms.shippingAddress) : cms.shippingAddress || {};
  const timeline = typeof cms.timeline === 'string' ? JSON.parse(cms.timeline) : cms.timeline || [];

  const orderStatus = (cms.status as OrderStatus) || 'confirmed';

  // 5-stage tracking progression
  const stageOrder: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const activeIdx = Math.max(0, stageOrder.indexOf(orderStatus));

  const trackingSteps: TrackingStep[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      description: 'Order placed & payment verified',
      isCompleted: 0 <= activeIdx,
      isCurrent: 0 === activeIdx,
      timestamp: cms.placedAt ? new Date(cms.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : undefined,
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      description: 'Studio accepted order for tailoring',
      isCompleted: 1 <= activeIdx,
      isCurrent: 1 === activeIdx,
    },
    {
      status: 'packed',
      label: 'Packed',
      description: 'Hand-pressed & wrapped in luxury box',
      isCompleted: 2 <= activeIdx,
      isCurrent: 2 === activeIdx,
    },
    {
      status: 'shipped',
      label: 'In Transit',
      description: 'Dispatched with BlueDart Air Express',
      isCompleted: 3 <= activeIdx,
      isCurrent: 3 === activeIdx,
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Delivered to recipient address',
      isCompleted: 4 <= activeIdx,
      isCurrent: 4 === activeIdx,
    },
  ];

  const paymentDetails: PaymentDetails = {
    method: (cms.payments?.[0]?.provider as any) || 'upi',
    transactionId: cms.payments?.[0]?.id || `TXN-${cms.orderNumber || Date.now()}`,
    status: 'success',
  };

  return {
    id: cms.id,
    orderNumber: cms.orderNumber || `JQT-${cms.id}`,
    createdAt: cms.placedAt || cms.createdAt || new Date().toISOString(),
    status: orderStatus,
    items: items.map((it: any) => ({
      id: it.id || `item_${Math.random()}`,
      productId: it.productId || 'prod_01',
      product: {
        id: it.productId || 'prod_01',
        name: it.title || 'JQ Trends Style',
        slug: it.slug || 'style',
        sku: it.sku || 'SKU-001',
        department: 'women',
        category: 'dresses',
        categoryName: 'Dresses',
        price: it.price || 1499,
        shortDescription: '',
        description: '',
        features: [],
        fabric: 'Georgette',
        careInstructions: [],
        images: [{ url: it.imageUrl || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop', alt: it.title || 'Product' }],
        colors: [],
        sizes: [],
        rating: 5,
        reviewCount: 1,
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        isSale: false,
        tags: [],
      },
      selectedColor: it.options?.Color || 'Blush Pink',
      selectedSize: it.options?.Size || 'M',
      quantity: it.quantity || 1,
      unitPrice: it.price || 1499,
      totalPrice: it.total || (it.price || 1499) * (it.quantity || 1),
    })),
    shippingAddress: {
      fullName: shippingAddress.fullName || 'Valued Customer',
      email: shippingAddress.email || cms.email || 'care@jqtrends.com',
      phone: shippingAddress.phone || '9876543210',
      addressLine1: shippingAddress.addressLine1 || 'Indiranagar',
      addressLine2: shippingAddress.addressLine2,
      landmark: shippingAddress.landmark,
      city: shippingAddress.city || 'Bengaluru',
      state: shippingAddress.state || 'Karnataka',
      pincode: shippingAddress.pincode || '560038',
    },
    paymentDetails,
    subtotal: cms.subtotal || 1499,
    discount: cms.discountTotal || 0,
    shippingFee: cms.shippingTotal || 0,
    tax: cms.taxTotal || 0,
    total: cms.grandTotal || cms.subtotal || 1499,
    trackingSteps,
    estimatedDeliveryDate: '2-4 Business Days',
    courierPartner: 'BlueDart Air Express',
    trackingNumber: `BLUEDART-${cms.orderNumber?.replace(/[^0-9]/g, '') || '84729104'}`,
  };
}

/**
 * Maps a CMS Customer response to the Storefront User model.
 */
export function mapCmsCustomerToStorefrontUser(cms: any): UserProfile {
  const addresses = typeof cms.addresses === 'string'
    ? JSON.parse(cms.addresses)
    : cms.addresses || [];

  return {
    id: cms.id,
    name: `${cms.firstName || ''} ${cms.lastName || ''}`.trim() || 'Valued Customer',
    email: cms.email,
    phone: cms.phone || '',
    defaultAddressId: addresses[0]?.id || 'addr_1',
    savedAddresses: addresses.map((a: any, idx: number) => ({
      id: a.id || `addr_${idx + 1}`,
      fullName: a.fullName || `${cms.firstName || ''} ${cms.lastName || ''}`.trim(),
      email: cms.email,
      phone: a.phone || cms.phone || '',
      addressLine1: a.addressLine1 || '',
      addressLine2: a.addressLine2 || '',
      landmark: a.landmark || '',
      city: a.city || 'Bengaluru',
      state: a.state || 'Karnataka',
      pincode: a.pincode || '560038',
      isDefault: Boolean(a.isDefault !== undefined ? a.isDefault : idx === 0),
    })),
    createdAt: cms.createdAt || new Date().toISOString(),
  };
}

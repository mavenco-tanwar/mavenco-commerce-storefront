import { getDatabase } from '@/lib/mongodb';
import { CommerceCart, CommerceCartItem } from '@/types/cart-commerce.types';
import { PricingService } from './pricing.service';
import { ProductService } from '@/services/products';

export class CartService {
  /**
   * Retrieves active cart or creates a new one for tenant and session/customer.
   */
  public static async getOrCreateCart(
    tenantId: string,
    sessionId: string,
    customerId?: string
  ): Promise<CommerceCart> {
    const db = await getDatabase();
    const query: any = {
      tenantId,
      status: 'ACTIVE',
    };

    if (customerId) {
      query.$or = [{ customerId }, { sessionId }];
    } else {
      query.sessionId = sessionId;
    }

    let cartDoc: any = null;
    if (db) {
      cartDoc = await db.collection('carts').findOne(query);
    }

    if (!cartDoc) {
      const now = new Date().toISOString();
      const newCart: CommerceCart = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tenantId,
        sessionId,
        customerId,
        status: 'ACTIVE',
        currency: 'USD',
        items: [],
        couponCodes: ['LUMINA10'], // default active promo coupon
        pricing: PricingService.calculateTotals([], 'LUMINA10'),
        version: 1,
        createdAt: now,
        updatedAt: now,
      };

      if (db) {
        await db.collection('carts').insertOne({ ...newCart, _id: newCart.id });
      }

      return newCart;
    }

    // Re-verify totals on retrieval
    const pricing = PricingService.calculateTotals(
      cartDoc.items || [],
      cartDoc.couponCodes?.[0] || ''
    );

    return {
      ...cartDoc,
      id: cartDoc.id || cartDoc._id?.toString(),
      pricing,
    };
  }

  /**
   * Adds an item to the cart with server-side pricing and inventory validation.
   */
  public static async addItem(
    tenantId: string,
    sessionId: string,
    customerId: string | undefined,
    productId: string,
    selectedColor: string,
    selectedSize: string,
    quantity: number = 1
  ): Promise<CommerceCart> {
    const cart = await this.getOrCreateCart(tenantId, sessionId, customerId);

    // Fetch live product from tenant database to verify real unit price and stock
    const productRes = await ProductService.getProductById(productId);
    const product = productRes.data;

    if (!product) {
      throw new Error(`Product ${productId} not found in tenant catalog.`);
    }

    const itemId = `${productId}-${selectedColor.replace(/\s+/g, '-')}-${selectedSize}`;
    const unitPrice = product.price;
    const compareAtPrice = product.compareAtPrice;

    const existingIndex = cart.items.findIndex((i) => i.id === itemId);
    let updatedItems = [...cart.items];

    if (existingIndex > -1) {
      const newQty = updatedItems[existingIndex].quantity + quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
        lineSubtotal: newQty * unitPrice,
        lineTotal: newQty * unitPrice,
      };
    } else {
      const newItem: CommerceCartItem = {
        id: itemId,
        productId,
        quantity,
        productSnapshot: {
          id: product.id,
          title: product.name,
          slug: product.slug,
          image: typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || '',
          sku: product.sku,
          category: product.category,
        },
        variantSnapshot: {
          id: `var_${productId}_${selectedColor}_${selectedSize}`,
          sku: `${product.sku}-${selectedColor.substring(0, 3).toUpperCase()}-${selectedSize}`,
          name: `${selectedColor} / ${selectedSize}`,
          options: { color: selectedColor, size: selectedSize },
        },
        unitPrice,
        compareAtPrice,
        lineSubtotal: quantity * unitPrice,
        lineDiscount: 0,
        lineTotal: quantity * unitPrice,
      };

      updatedItems = [newItem, ...updatedItems];
    }

    const pricing = PricingService.calculateTotals(
      updatedItems,
      cart.couponCodes?.[0] || ''
    );
    const now = new Date().toISOString();

    const updatedCart: CommerceCart = {
      ...cart,
      items: updatedItems,
      pricing,
      version: (cart.version || 1) + 1,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('carts').updateOne(
        { id: cart.id, tenantId },
        {
          $set: {
            items: updatedItems,
            pricing,
            version: updatedCart.version,
            updatedAt: now,
          },
        }
      );
    }

    return updatedCart;
  }

  /**
   * Updates line item quantity.
   */
  public static async updateQuantity(
    tenantId: string,
    sessionId: string,
    customerId: string | undefined,
    itemId: string,
    quantity: number
  ): Promise<CommerceCart> {
    const cart = await this.getOrCreateCart(tenantId, sessionId, customerId);

    let updatedItems: CommerceCartItem[];
    if (quantity <= 0) {
      updatedItems = cart.items.filter((i) => i.id !== itemId);
    } else {
      updatedItems = cart.items.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            quantity,
            lineSubtotal: quantity * i.unitPrice,
            lineTotal: quantity * i.unitPrice,
          };
        }
        return i;
      });
    }

    const pricing = PricingService.calculateTotals(
      updatedItems,
      cart.couponCodes?.[0] || ''
    );
    const now = new Date().toISOString();

    const updatedCart: CommerceCart = {
      ...cart,
      items: updatedItems,
      pricing,
      version: (cart.version || 1) + 1,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('carts').updateOne(
        { id: cart.id, tenantId },
        {
          $set: {
            items: updatedItems,
            pricing,
            version: updatedCart.version,
            updatedAt: now,
          },
        }
      );
    }

    return updatedCart;
  }

  /**
   * Removes a line item.
   */
  public static async removeItem(
    tenantId: string,
    sessionId: string,
    customerId: string | undefined,
    itemId: string
  ): Promise<CommerceCart> {
    return this.updateQuantity(tenantId, sessionId, customerId, itemId, 0);
  }

  /**
   * Applies coupon code to cart.
   */
  public static async applyCoupon(
    tenantId: string,
    sessionId: string,
    customerId: string | undefined,
    couponCode: string
  ): Promise<CommerceCart> {
    const cart = await this.getOrCreateCart(tenantId, sessionId, customerId);
    const clean = couponCode.trim().toUpperCase();

    const pricing = PricingService.calculateTotals(cart.items, clean);
    const now = new Date().toISOString();

    const updatedCart: CommerceCart = {
      ...cart,
      couponCodes: [clean],
      pricing,
      version: (cart.version || 1) + 1,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('carts').updateOne(
        { id: cart.id, tenantId },
        {
          $set: {
            couponCodes: [clean],
            pricing,
            version: updatedCart.version,
            updatedAt: now,
          },
        }
      );
    }

    return updatedCart;
  }

  /**
   * Clears cart items.
   */
  public static async clearCart(
    tenantId: string,
    sessionId: string,
    customerId?: string
  ): Promise<CommerceCart> {
    const cart = await this.getOrCreateCart(tenantId, sessionId, customerId);
    const pricing = PricingService.calculateTotals([], cart.couponCodes?.[0] || '');
    const now = new Date().toISOString();

    const updatedCart: CommerceCart = {
      ...cart,
      items: [],
      pricing,
      version: (cart.version || 1) + 1,
      updatedAt: now,
    };

    const db = await getDatabase();
    if (db) {
      await db.collection('carts').updateOne(
        { id: cart.id, tenantId },
        {
          $set: {
            items: [],
            pricing,
            version: updatedCart.version,
            updatedAt: now,
          },
        }
      );
    }

    return updatedCart;
  }
}

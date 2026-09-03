import { apiClient } from './client';

export interface CmsHomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  displayOrder: number;
  isVisible: boolean;
  startDate?: string;
  endDate?: string;
  settings: Record<string, any>;
}

export interface CmsHomepageResponse {
  id: string;
  storeId: string;
  version: number;
  status: 'draft' | 'published';
  sections: CmsHomepageSection[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface CmsFooterConfig {
  storeId: string;
  columns: Array<{
    title: string;
    links: Array<{ label: string; url: string }>;
  }>;
  socialLinks: Array<{ platform: string; url: string; label: string }>;
  copyrightText: string;
  description: string;
  logoUrl: string;
}

export interface CmsMenuItem {
  id: string;
  label: string;
  url: string;
  type?: string;
  isVisible: boolean;
  children?: CmsMenuItem[];
}

export interface CmsMenu {
  id: string;
  code: string;
  name: string;
  items: CmsMenuItem[];
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  blocks?: Array<{
    type: string;
    data: Record<string, any>;
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
}

export class CmsApiService {
  /**
   * Retrieves homepage layout sections from the Visual Builder database.
   */
  public static async getHomepageSections(
    isPreview: boolean = false,
    tenantSlug?: string
  ): Promise<CmsHomepageSection[]> {
    try {
      const endpoint = isPreview ? '/api/v1/content/homepage?status=draft' : '/api/v1/content/homepage';
      const headers: Record<string, string> = {};
      if (tenantSlug) {
        headers['x-tenant-slug'] = tenantSlug;
      }
      const res = await apiClient.get<CmsHomepageResponse>(endpoint, { headers });

      if (res.data && res.data.sections && Array.isArray(res.data.sections) && res.data.sections.length > 0) {
        return res.data.sections
          .filter((s) => s.isVisible !== false)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn('[CmsApiService] Could not load homepage layout from CMS:', err);
    }

    // Dynamic initial template when unconfigured
    return this.getDefaultHomepageSections();
  }

  /**
   * Safe architectural fallback template when tenant homepage is unconfigured.
   */
  public static getDefaultHomepageSections(): CmsHomepageSection[] {
    return [
      {
        id: 'sec_hero_1',
        type: 'hero',
        title: 'Artisanal Elegance & Contemporary Poise',
        subtitle: 'Handcrafted luxury silhouettes tailored for timeless moments.',
        displayOrder: 1,
        isVisible: true,
        settings: {
          badge: 'NEW SEASON COLLECTION',
          primaryCtaText: 'Shop New In',
          primaryCtaLink: '/new-arrivals',
          secondaryCtaText: 'Explore Lookbook',
          secondaryCtaLink: '/collections',
          overlayOpacity: 25,
          alignment: 'left',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
        },
      },
      {
        id: 'sec_categories_2',
        type: 'categories-grid',
        title: 'Shop by Department',
        subtitle: 'Explore curated boutique edits',
        displayOrder: 2,
        isVisible: true,
        settings: {
          layout: 'grid-3',
        },
      },
      {
        id: 'sec_featured_3',
        type: 'featured-products',
        title: 'Studio Best Sellers',
        subtitle: 'Beloved creations with enduring appeal',
        displayOrder: 3,
        isVisible: true,
        settings: {
          limit: 8,
          filter: 'bestseller',
        },
      },
      {
        id: 'sec_banner_4',
        type: 'banner',
        title: 'Limited Edition Hand-Crafted Batches',
        subtitle: 'Pure organic fabrics, skin-friendly dyes, and artisanal craftsmanship.',
        displayOrder: 4,
        isVisible: true,
        settings: {
          ctaText: 'Discover The Atelier',
          ctaLink: '/about',
        },
      },
      {
        id: 'sec_new_arrivals_5',
        type: 'new-arrivals',
        title: 'Fresh From The Studio',
        subtitle: 'Just released boutique silhouettes',
        displayOrder: 5,
        isVisible: true,
        settings: {
          limit: 4,
        },
      },
      {
        id: 'sec_sale_6',
        type: 'sale-banner',
        title: 'Seasonal Sale Event',
        subtitle: 'Enjoy up to 50% savings on select boutique pieces',
        displayOrder: 6,
        isVisible: true,
        settings: {
          badge: 'SPECIAL SALE',
          ctaText: 'Shop The Sale',
          ctaLink: '/sale',
        },
      },
      {
        id: 'sec_reviews_7',
        type: 'customer-reviews',
        title: 'Voices of Appreciation',
        subtitle: 'Cherished memories shared by our community',
        displayOrder: 7,
        isVisible: true,
        settings: {
          averageRating: 4.9,
          totalReviewsCount: '5,000+',
        },
      },
      {
        id: 'sec_newsletter_8',
        type: 'newsletter',
        title: 'Join Our Private Atelier Circle',
        subtitle: 'Receive exclusive drop alerts, private trunk shows, and styling previews.',
        displayOrder: 8,
        isVisible: true,
        settings: {
          couponPromo: 'WELCOME10',
        },
      },
    ];
  }

  /**
   * Retrieves a CMS custom page by its slug strictly from the database API.
   * Zero static business text fallback: Returns null if not in database.
   */
  public static async getPageBySlug(slug: string): Promise<CmsPage | null> {
    try {
      const res = await apiClient.get<CmsPage>(`/api/storefront/v1/pages/${encodeURIComponent(slug)}`);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      // Try content page endpoint
      try {
        const res2 = await apiClient.get<CmsPage>(`/api/v1/content/pages/slug/${encodeURIComponent(slug)}`);
        if (res2.data) {
          return res2.data;
        }
      } catch {
        // Not found in database
      }
    }

    // Zero fallback rule: Return null when not found in database
    return null;
  }

  /**
   * Retrieves footer layout configuration from the CMS database.
   */
  public static async getFooterConfig(): Promise<CmsFooterConfig | null> {
    try {
      const res = await apiClient.get<CmsFooterConfig>('/api/v1/content/footer');
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('[CmsApiService] Failed to load footer config from CMS:', err);
    }
    return null;
  }

  /**
   * Retrieves navigation menu items by menu code strictly from API.
   */
  public static async getMenu(code: string): Promise<CmsMenuItem[]> {
    try {
      const res = await apiClient.get<CmsMenu>(`/api/v1/content/menus/code/${code}`);
      if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        return res.data.items.filter((i) => i.isVisible !== false);
      }
    } catch (err) {
      // Fallback
    }

    // Minimal neutral system navigation fallback (no tenant brand names)
    if (code === 'header-menu') {
      return [
        { id: 'nav_1', label: 'Home', url: '/', isVisible: true },
        { id: 'nav_2', label: 'Collections', url: '/collections', isVisible: true },
        { id: 'nav_3', label: 'New Arrivals', url: '/new-arrivals', isVisible: true },
        { id: 'nav_4', label: 'Sale', url: '/sale', isVisible: true },
      ];
    }
    if (code === 'footer-menu-shop') {
      return [
        { id: 'f_1', label: 'All Collections', url: '/collections', isVisible: true },
        { id: 'f_2', label: 'New Arrivals', url: '/new-arrivals', isVisible: true },
        { id: 'f_3', label: 'Special Sale', url: '/sale', isVisible: true },
      ];
    }
    if (code === 'footer-menu-care') {
      return [
        { id: 'c_1', label: 'About Us', url: '/about', isVisible: true },
        { id: 'c_2', label: 'Contact Us', url: '/contact', isVisible: true },
        { id: 'c_3', label: 'FAQ', url: '/faq', isVisible: true },
        { id: 'c_4', label: 'Privacy Policy', url: '/privacy-policy', isVisible: true },
        { id: 'c_5', label: 'Terms of Service', url: '/terms-conditions', isVisible: true },
      ];
    }
    return [];
  }
}

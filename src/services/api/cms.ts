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
  createdAt?: string;
  updatedAt?: string;
}

export class CmsApiService {
  /**
   * Retrieves active or preview homepage sections from the CMS.
   */
  public static async getHomepageSections(isPreview: boolean = false): Promise<CmsHomepageSection[]> {
    try {
      const endpoint = `/api/v1/content/homepage${isPreview ? '?preview=draft' : ''}`;
      const res = await apiClient.get<CmsHomepageResponse>(endpoint);

      if (res.data?.sections && Array.isArray(res.data.sections)) {
        return res.data.sections;
      }
    } catch (err) {
      // Fallback
    }

    try {
      const { getStoredHomepageSections } = require('@/lib/cms-store');
      const stored = getStoredHomepageSections();
      if (stored && stored.length > 0) {
        return stored;
      }
    } catch {}

    // Default fallback sections
    return [
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
          desktopImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85',
          tabletImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85',
          mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
          overlayOpacity: 45,
          textAlignment: 'center',
        },
      },
      {
        id: 'sec_cat_grid_2',
        type: 'category-grid',
        title: 'Curated Departments',
        subtitle: 'Shop By Category',
        displayOrder: 2,
        isVisible: true,
        settings: {
          layout: 'grid',
          columnsDesktop: 4,
          columnsMobile: 2,
          categorySlugs: ['women', 'kids', 'dresses', 'kurtis'],
        },
      },
      {
        id: 'sec_trending_3',
        type: 'trending',
        title: 'Trending Now',
        subtitle: 'Most Coveted Silhouettes',
        displayOrder: 3,
        isVisible: true,
        settings: {
          limit: 8,
          department: 'all',
          showDepartmentFilter: true,
        },
      },
      {
        id: 'sec_womens_editorial_4',
        type: 'womens-editorial',
        title: "Women's Collection",
        subtitle: 'Effortless grace meets contemporary silhouette',
        displayOrder: 4,
        isVisible: true,
        settings: {
          tagline: "Women's Universe • Studio Edit",
        },
      },
      {
        id: 'sec_new_arrivals_5',
        type: 'new-arrivals',
        title: 'Fresh From The Studio',
        subtitle: 'Weekly Drop • Just In',
        displayOrder: 5,
        isVisible: true,
        settings: {
          limit: 4,
        },
      },
      {
        id: 'sec_kids_editorial_6',
        type: 'kids-editorial',
        title: 'Little Looks, Big Style',
        subtitle: '“Comfort meets adorable.”',
        displayOrder: 6,
        isVisible: true,
        settings: {
          tagline: 'Kids Universe • Ages 2 to 12 Years',
        },
      },
      {
        id: 'sec_best_sellers_7',
        type: 'best-sellers',
        title: 'Our Best Sellers',
        subtitle: 'Customer Favorites • High Demand',
        displayOrder: 7,
        isVisible: true,
        settings: {
          limit: 4,
        },
      },
      {
        id: 'sec_reviews_8',
        type: 'reviews',
        title: 'Loved By Over 10,000+ Women & Moms',
        subtitle: 'Stories of Elegance & Delight',
        displayOrder: 8,
        isVisible: true,
        settings: {
          averageRating: 4.9,
          totalReviewsCount: '10,000+',
        },
      },
      {
        id: 'sec_instagram_9',
        type: 'instagram-feed',
        title: '@JQTrendsOfficial',
        subtitle: 'Tag us in your photos to get featured',
        displayOrder: 9,
        isVisible: true,
        settings: {
          handle: '@JQTrendsOfficial',
        },
      },
      {
        id: 'sec_newsletter_10',
        type: 'newsletter',
        title: 'Unlock 10% Off Your First Order',
        subtitle: 'Join the JQ Trends VIP Insider Circle',
        displayOrder: 10,
        isVisible: true,
        settings: {
          couponPromo: 'JQTRENDS10',
        },
      },
    ];
  }

  /**
   * Retrieves a CMS custom page by its slug.
   */
  public static async getPageBySlug(slug: string): Promise<CmsPage | null> {
    try {
      const res = await apiClient.get<CmsPage>(`/api/v1/content/pages/slug/${slug}`);
      if (res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn(`[CmsApiService] Could not load page for slug '${slug}', checking defaults:`, err);
    }

    // Built-in luxury page fallbacks
    if (slug === 'about-us') {
      return {
        id: 'page_about_us',
        title: 'About JQ Trends',
        slug: 'about-us',
        status: 'published',
        blocks: [
          {
            type: 'hero',
            data: {
              title: 'The JQ Trends Story',
              subtitle: 'Crafting effortless grace, hand-finished silhouettes, and affordable luxury fashion for modern women and little royals.',
              badge: 'OUR HERITAGE & VISION',
              image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
            },
          },
          {
            type: 'rich-text',
            data: {
              heading: 'Where Tradition Meets Contemporary Silhouette',
              content: `
                <p class="text-base text-[#444444] leading-relaxed mb-6 font-sans">
                  Founded with a passionate vision to make runway-inspired luxury and artisanal Indian craftsmanship accessible, <strong>JQ Trends</strong> is a boutique fashion label celebrating femininity, poise, and youthful joy.
                </p>
                <p class="text-sm text-[#666666] leading-relaxed mb-6 font-sans">
                  Every garment in our Women and Kids ateliers is designed with meticulous attention to detail — from breathable pure linen co-ord sets and flowing tiered chiffon midi dresses to regal Chanderi silk kurti sets embroidered with delicate zari work.
                </p>
                <p class="text-sm text-[#666666] leading-relaxed mb-6 font-sans">
                  We believe that elegance should never compromise on comfort. That is why our fabrics are skin-friendly, hand-pressed, and tailored for every celebration — from sunlit daytime brunches to grand festive weddings.
                </p>
              `,
            },
          },
        ],
        seo: {
          title: 'About JQ Trends | Luxury Women & Kids Fashion',
          description: 'Discover the story of JQ Trends, Indian boutique label delivering hand-crafted luxury fashion for women and kids.',
        },
      };
    }

    if (slug === 'shipping-policy') {
      return {
        id: 'page_shipping',
        title: 'Shipping & Delivery Policy',
        slug: 'shipping-policy',
        status: 'published',
        blocks: [
          {
            type: 'rich-text',
            data: {
              heading: 'White-Glove Express Delivery Across India',
              content: `
                <p class="text-sm text-[#444444] leading-relaxed mb-4">We offer <strong>Free Express Shipping</strong> on all orders above ₹999 across all serviceable pin codes in India.</p>
                <h4 class="font-serif font-bold text-lg text-[#111111] mt-6 mb-2">Delivery Timelines:</h4>
                <ul class="list-disc pl-5 text-sm text-[#666666] space-y-2 mb-6">
                  <li><strong>Metro Cities (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai):</strong> 2–3 Business Days</li>
                  <li><strong>Rest of India:</strong> 3–5 Business Days</li>
                </ul>
                <p class="text-sm text-[#666666] leading-relaxed">All parcels are hand-packed in signature JQ Trends luxury keepsake boxes with protective butter-paper wrapping to ensure your boutique garments arrive in pristine runway condition.</p>
              `,
            },
          },
        ],
      };
    }

    if (slug === 'return-policy' || slug === 'returns') {
      return {
        id: 'page_returns',
        title: 'Returns & Exchanges',
        slug: 'return-policy',
        status: 'published',
        blocks: [
          {
            type: 'rich-text',
            data: {
              heading: 'Hassle-Free 7-Day Doorstep Exchange Policy',
              content: `
                <p class="text-sm text-[#444444] leading-relaxed mb-4">We want you to adore everything you order from JQ Trends. If the size or fit isn't absolutely perfect, we provide a <strong>7-Day Doorstep Exchange & Return</strong> window.</p>
                <h4 class="font-serif font-bold text-lg text-[#111111] mt-6 mb-2">How to Initiate:</h4>
                <ol class="list-decimal pl-5 text-sm text-[#666666] space-y-2 mb-6">
                  <li>Visit your Account dashboard or WhatsApp our Concierge Team at <strong>+91 98765 43210</strong>.</li>
                  <li>Our courier partner will pick up the parcel from your doorstep.</li>
                  <li>Instant replacement or store credit is issued upon quick inspection.</li>
                </ol>
              `,
            },
          },
        ],
      };
    }

    if (slug === 'contact' || slug === 'contact-us') {
      return {
        id: 'page_contact',
        title: 'Contact Us & Concierge',
        slug: 'contact',
        status: 'published',
        blocks: [
          {
            type: 'rich-text',
            data: {
              heading: 'We Are Here To Assist You',
              content: `
                <p class="text-sm text-[#444444] leading-relaxed mb-4">Our personal styling concierge and client support team is available Monday through Saturday from 10:00 AM to 7:00 PM IST.</p>
                <div class="p-6 bg-[#FAF6F2] border border-[#E8DED8] rounded-xl space-y-3 mt-6">
                  <div><strong>WhatsApp & Phone:</strong> +91 98765 43210</div>
                  <div><strong>Email:</strong> care@jqtrends.com</div>
                  <div><strong>Flagship Atelier:</strong> 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</div>
                </div>
              `,
            },
          },
        ],
      };
    }

    return null;
  }

  /**
   * Retrieves footer layout configuration from the CMS.
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
   * Retrieves navigation menu items by menu code (header-menu, footer-menu-shop, footer-menu-care)
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

    if (code === 'header-menu') {
      return [
        { id: 'nav_1', label: 'Women', url: '/women', isVisible: true },
        { id: 'nav_2', label: 'Kids', url: '/kids', isVisible: true },
        { id: 'nav_3', label: 'New In', url: '/new-arrivals', isVisible: true },
        { id: 'nav_4', label: 'Collections', url: '/collections/festive-elegance', isVisible: true },
        { id: 'nav_5', label: 'Sale', url: '/sale', isVisible: true },
      ];
    }
    if (code === 'footer-menu-shop') {
      return [
        { id: 'f_1', label: "Women's Fashion", url: '/women', isVisible: true },
        { id: 'f_2', label: 'Kids Collection', url: '/kids', isVisible: true },
        { id: 'f_3', label: 'New In Studio', url: '/new-arrivals', isVisible: true },
        { id: 'f_4', label: 'Floral Dresses', url: '/women?category=dresses', isVisible: true },
        { id: 'f_5', label: 'Chanderi Kurti Sets', url: '/women?category=kurtis', isVisible: true },
        { id: 'f_6', label: 'Linen Co-ords', url: '/women?category=co-ords', isVisible: true },
        { id: 'f_7', label: 'Special Sale (Up to 50% Off)', url: '/sale', isVisible: true },
      ];
    }
    if (code === 'footer-menu-care') {
      return [
        { id: 'c_1', label: 'About JQ Trends', url: '/about-us', isVisible: true },
        { id: 'c_2', label: 'Shipping & Delivery', url: '/shipping-policy', isVisible: true },
        { id: 'c_3', label: 'Returns & Exchanges', url: '/return-policy', isVisible: true },
        { id: 'c_4', label: 'Contact & Concierge', url: '/contact', isVisible: true },
        { id: 'c_5', label: 'Track Your Order', url: '/account', isVisible: true },
        { id: 'c_6', label: 'Privacy Notice', url: '/privacy-policy', isVisible: true },
        { id: 'c_7', label: 'Terms of Service', url: '/terms-and-conditions', isVisible: true },
      ];
    }
    return [];
  }
}

export interface FooterBlock {
  id: string;
  type: string;
  category?: string;
  name?: string;
  enabled: boolean;
  locked?: boolean;
  order: number;
  columnSpan?: number;
  content: Record<string, any>;
  styles?: Record<string, any>;
  layout?: Record<string, any>;
  responsive?: {
    desktop?: { visible?: boolean };
    tablet?: { visible?: boolean };
    mobile?: { visible?: boolean };
  };
  visibility?: {
    scheduleEnabled?: boolean;
    startDate?: string;
    endDate?: string;
  };
}

export interface FooterSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  layout: {
    containerWidth?: 'full' | 'contained' | 'narrow';
    columns?: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
    gap?: string;
  };
  styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    textColor?: string;
    headingColor?: string;
    accentColor?: string;
    borderColor?: string;
    borderTopWidth?: string;
    borderBottomWidth?: string;
  };
  responsive?: {
    desktop?: { visible?: boolean };
    tablet?: { visible?: boolean };
    mobile?: { visible?: boolean; accordion?: boolean };
  };
  blocks: FooterBlock[];
}

export interface FooterTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  headingColor: string;
  mutedTextColor: string;
  borderColor: string;
  fontFamily: string;
  headingFontFamily: string;
  fontSize: string;
  letterSpacing: string;
}

export interface FooterConfig {
  id: string;
  tenantSlug: string;
  name?: string;
  type: 'footer';
  status: 'draft' | 'published';
  version: number;
  sections: FooterSection[];
  theme: FooterTheme;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export function getDefaultFooterConfig(tenantSlug: string = 'storefront', storeName: string = 'STOREFRONT'): FooterConfig {
  const dynamicName = storeName || tenantSlug.toUpperCase();

  return {
    id: `footer_${tenantSlug}`,
    tenantSlug,
    type: 'footer',
    status: 'published',
    version: 1,
    theme: {
      primaryColor: '#111111',
      secondaryColor: '#2B2320',
      accentColor: '#B77A68',
      backgroundColor: '#111111',
      surfaceColor: '#1A1615',
      textColor: '#FAF6F2',
      headingColor: '#FFFDFC',
      mutedTextColor: '#A0958E',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      headingFontFamily: 'Playfair Display, serif',
      fontSize: '13px',
      letterSpacing: '0.02em',
    },
    sections: [
      {
        id: 'sec_footer_main',
        name: 'Navigation & Newsletter Row',
        enabled: true,
        order: 1,
        layout: {
          containerWidth: 'contained',
          columns: { desktop: 4, tablet: 2, mobile: 1 },
        },
        styles: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderBottomWidth: '1px',
        },
        responsive: {
          desktop: { visible: true },
          tablet: { visible: true },
          mobile: { visible: true, accordion: true },
        },
        blocks: [
          {
            id: 'blk_footer_logo',
            type: 'logo',
            name: 'Brand Logo',
            enabled: true,
            order: 1,
            columnSpan: 1,
            content: {
              logoType: 'text',
              text: dynamicName,
              linkUrl: '/',
              width: 180,
            },
            styles: {
              fontSize: '18px',
              fontWeight: '800',
              letterSpacing: '0.12em',
              textColor: '#FFFFFF',
            },
          },
          {
            id: 'blk_footer_menu_shop',
            type: 'menu',
            name: 'Shop Collections',
            enabled: true,
            order: 2,
            columnSpan: 1,
            content: {
              heading: 'SHOP',
              menuCode: 'footer-menu-shop',
              items: [
                { label: 'New Arrivals', href: '/new-arrivals' },
                { label: 'Women', href: '/women' },
                { label: 'Men', href: '/men' },
                { label: 'Collections', href: '/collections' },
                { label: 'Sale', href: '/sale' },
              ],
            },
          },
          {
            id: 'blk_footer_menu_care',
            type: 'menu',
            name: 'Customer Concierge',
            enabled: true,
            order: 3,
            columnSpan: 1,
            content: {
              heading: 'CUSTOMER CARE',
              menuCode: 'footer-menu-care',
              items: [
                { label: 'Contact Us', href: '/contact' },
                { label: 'Shipping & Delivery', href: '/shipping' },
                { label: 'Returns & Exchanges', href: '/returns' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Privacy & Terms', href: '/privacy' },
              ],
            },
          },
          {
            id: 'blk_footer_newsletter',
            type: 'newsletter',
            name: 'VIP Newsletter',
            enabled: true,
            order: 4,
            columnSpan: 1,
            content: {
              heading: 'NEWSLETTER',
              description: 'Subscribe for private drops, seasonal previews, and exclusive offers.',
              placeholder: 'Enter your email address...',
              buttonText: 'SUBSCRIBE',
              privacyText: 'Instant unsubscription available at any time.',
              successMessage: 'Welcome to our private circle.',
            },
            styles: {
              buttonBgColor: '#E11D48',
              buttonTextColor: '#FFFFFF',
            },
          },
        ],
      },
      {
        id: 'sec_footer_social',
        name: 'Social & Payment Badges',
        enabled: true,
        order: 2,
        layout: {
          containerWidth: 'contained',
          columns: { desktop: 2, tablet: 2, mobile: 1 },
        },
        styles: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderBottomWidth: '1px',
        },
        blocks: [
          {
            id: 'blk_footer_social',
            type: 'social_icons',
            name: 'Social Profiles',
            enabled: true,
            order: 1,
            columnSpan: 1,
            content: {
              heading: 'CONNECT WITH US',
              platforms: [
                { name: 'Instagram', url: 'https://instagram.com', enabled: true },
                { name: 'Facebook', url: 'https://facebook.com', enabled: true },
                { name: 'WhatsApp', url: 'https://whatsapp.com', enabled: true },
                { name: 'Pinterest', url: 'https://pinterest.com', enabled: true },
              ],
            },
          },
          {
            id: 'blk_footer_payments',
            type: 'payment_icons',
            name: 'Payment Methods',
            enabled: true,
            order: 2,
            columnSpan: 1,
            content: {
              methods: [
                { name: 'Visa', enabled: true },
                { name: 'Mastercard', enabled: true },
                { name: 'Amex', enabled: true },
                { name: 'Apple Pay', enabled: true },
                { name: 'Google Pay', enabled: true },
                { name: 'UPI', enabled: true },
              ],
            },
          },
        ],
      },
      {
        id: 'sec_footer_bottom',
        name: 'Copyright & Legal Notice',
        enabled: true,
        order: 3,
        layout: {
          containerWidth: 'contained',
          columns: { desktop: 1, tablet: 1, mobile: 1 },
        },
        styles: {
          backgroundColor: 'transparent',
        },
        blocks: [
          {
            id: 'blk_footer_copyright',
            type: 'copyright',
            name: 'Copyright Line',
            enabled: true,
            order: 1,
            columnSpan: 1,
            content: {
              template: '© {{year}} {{store.name}}. All rights reserved.',
              storeName: dynamicName,
            },
            styles: {
              textColor: '#64748B',
              fontSize: '11px',
              textAlign: 'center',
            },
          },
        ],
      },
    ],
  };
}

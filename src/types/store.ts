export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'pinterest' | 'whatsapp' | 'youtube';
  url: string;
  label: string;
}

export interface AnnouncementMessage {
  id: string;
  text: string;
  highlightText?: string;
  link?: string;
}

export interface StorePolicy {
  freeShippingThreshold: number;
  returnWindowDays: number;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  businessAddress: string;
}

export interface StoreThemeConfig {
  primaryColor: string;
  accentColor: string;
  creamColor: string;
  blushColor: string;
  roseGoldColor: string;
  fontSerif: string;
  fontSans: string;
}

export interface StoreConfig {
  storeId: string;
  storeName: string;
  tagline: string;
  subTitle: string;
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  favicon: string;
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  theme: StoreThemeConfig;
  policies: StorePolicy;
  announcements: AnnouncementMessage[];
  socialLinks: SocialLink[];
  brandPromises: {
    title: string;
    description: string;
    icon: string;
  }[];
}

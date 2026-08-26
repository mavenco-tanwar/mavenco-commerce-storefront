import { StoreConfig } from '@/types/store';

export const defaultStoreConfig: StoreConfig = {
  storeId: 'jq-trends-main',
  storeName: 'JQ TRENDS',
  tagline: 'Style that speaks you',
  subTitle: 'Women & Kids Clothing',
  logo: {
    src: '/images/logo.svg',
    alt: 'JQ TRENDS - Style that speaks you',
    width: 220,
    height: 52,
  },
  favicon: '/favicon.ico',
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN',
  },
  theme: {
    primaryColor: '#111111',
    accentColor: '#B77A68',
    creamColor: '#F8F1EA',
    blushColor: '#E8B8B5',
    roseGoldColor: '#B77A68',
    fontSerif: 'Playfair Display, serif',
    fontSans: 'Plus Jakarta Sans, sans-serif',
  },
  policies: {
    freeShippingThreshold: 999,
    returnWindowDays: 7,
    supportEmail: 'care@jqtrends.com',
    supportPhone: '+91 98765 43210',
    whatsappNumber: '+919876543210',
    businessAddress: 'JQ Trends Studio, Plot 42, Fashion Hub Avenue, Indiranagar, Bengaluru, KA - 560038',
  },
  announcements: [
    {
      id: 'a1',
      text: 'Free Shipping on all orders above',
      highlightText: '₹999',
      link: '/new-arrivals',
    },
    {
      id: 'a2',
      text: 'Use Code',
      highlightText: 'JQTRENDS10',
      link: '/sale',
    },
    {
      id: 'a3',
      text: 'New Season Collection Live Now •',
      highlightText: 'Explore Fresh Arrivals',
      link: '/new-arrivals',
    },
  ],
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/jqtrends', label: '@jqtrends' },
    { platform: 'facebook', url: 'https://facebook.com/jqtrends', label: 'JQ Trends Official' },
    { platform: 'pinterest', url: 'https://pinterest.com/jqtrends', label: 'JQ Trends Fashion' },
    { platform: 'whatsapp', url: 'https://wa.me/919876543210', label: '+91 98765 43210' },
  ],
  brandPromises: [
    {
      title: 'Trendy Collections',
      description: 'Handpicked, fashion-forward silhouettes updated every week.',
      icon: 'Sparkles',
    },
    {
      title: 'Premium Quality',
      description: 'Breathable, skin-friendly fabrics crafted with utmost attention to detail.',
      icon: 'Award',
    },
    {
      title: 'Affordable Luxury',
      description: 'Runway-inspired luxury aesthetics at direct-to-consumer prices.',
      icon: 'Tag',
    },
    {
      title: 'Express Delivery & 7-Day Returns',
      description: 'Speedy dispatch across India with hassle-free exchange & doorstep pickups.',
      icon: 'Truck',
    },
  ],
};

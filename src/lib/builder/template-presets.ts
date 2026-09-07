import { PageBuilderContent, PageTemplate } from '@/types/builder.types';

export const SYSTEM_TEMPLATES: PageTemplate[] = [
  {
    id: 'tmpl_fashion_boutique',
    name: 'Haute Fashion Atelier',
    category: 'Fashion',
    description: 'Editorial lookbook for luxury pret, silk collections, and bespoke festive fashion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    content: {
      version: 1,
      settings: {
        background: '#FFFDFC',
        backgroundColor: '#FFFDFC',
        textColor: '#111111',
      },
      children: [
        {
          id: 'sec_hero_fashion',
          type: 'section',
          label: 'Hero Lookbook Banner',
          props: { tag: 'section', containerWidth: 'full' },
          styles: {
            desktop: { paddingTop: '0px', paddingBottom: '0px' },
            tablet: {},
            mobile: {},
          },
          children: [
            {
              id: 'slider_hero_1',
              type: 'image-slider',
              label: 'Hero Runway Carousel',
              props: {
                slides: [
                  {
                    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
                    title: 'Autumn Festive Couture',
                    subtitle: 'Handcrafted with Zari Silk',
                    ctaText: 'Shop New Arrivals',
                    ctaLink: '/women',
                  },
                ],
              },
              styles: {
                desktop: { minHeight: '520px', borderRadius: '0px' },
                tablet: { minHeight: '400px' },
                mobile: { minHeight: '300px' },
              },
            },
          ],
        },
        {
          id: 'sec_features_fashion',
          type: 'section',
          label: 'Atelier Pillars',
          props: { tag: 'section', containerWidth: 'boxed' },
          styles: {
            desktop: { paddingTop: '60px', paddingBottom: '60px' },
            tablet: {},
            mobile: {},
          },
          children: [
            {
              id: 'head_curated',
              type: 'heading',
              props: { text: 'The Curator’s Selection', tag: 'h2' },
              styles: {
                desktop: { textAlign: 'center', fontSize: '32px', marginBottom: '12px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'sub_curated',
              type: 'text',
              props: { text: 'Timeless silhouettes hand-cut by our master craftsmen.' },
              styles: {
                desktop: { textAlign: 'center', color: '#777777', marginBottom: '40px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'grid_fashion_prods',
              type: 'product-grid',
              label: 'Catalog Feed',
              props: { limit: 4, columns: 4 },
              styles: { desktop: {}, tablet: {}, mobile: {} },
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl_modern_furniture',
    name: 'Nordic Interior Living',
    category: 'Furniture',
    description: 'Minimalist sustainable home décor, handcrafted timber, and ceramic art.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    content: {
      version: 1,
      settings: {
        background: '#FAF6EE',
        backgroundColor: '#FAF6EE',
        textColor: '#1B4332',
      },
      children: [
        {
          id: 'sec_furn_hero',
          type: 'section',
          props: { containerWidth: 'boxed' },
          styles: {
            desktop: { paddingTop: '80px', paddingBottom: '80px' },
            tablet: {},
            mobile: {},
          },
          children: [
            {
              id: 'furn_heading',
              type: 'heading',
              props: { text: 'Sanctuary Within Your Space', tag: 'h1' },
              styles: {
                desktop: { fontSize: '44px', color: '#1B4332', marginBottom: '16px' },
                tablet: { fontSize: '34px' },
                mobile: { fontSize: '28px' },
              },
            },
            {
              id: 'furn_text',
              type: 'text',
              props: { text: 'Organic curves and certified sustainable timber designed for modern calm.' },
              styles: {
                desktop: { fontSize: '18px', color: '#405B4E', marginBottom: '28px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'furn_btn',
              type: 'button',
              props: { text: 'Explore Furniture', link: '/collections' },
              styles: {
                desktop: { backgroundColor: '#1B4332', color: '#FFFFFF', paddingLeft: '32px', paddingRight: '32px' },
                tablet: {},
                mobile: {},
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl_activewear',
    name: 'Apex Athletic Performance',
    category: 'Electronics',
    description: 'High-octane championship engineered apparel and technical sportswear.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    content: {
      version: 1,
      settings: {
        background: '#090D16',
        backgroundColor: '#090D16',
        textColor: '#F8FAFC',
      },
      children: [
        {
          id: 'sec_apex_hero',
          type: 'section',
          props: { containerWidth: 'boxed' },
          styles: {
            desktop: { paddingTop: '90px', paddingBottom: '90px' },
            tablet: {},
            mobile: {},
          },
          children: [
            {
              id: 'apex_title',
              type: 'heading',
              props: { text: 'Engineered For Pure Velocity', tag: 'h1' },
              styles: {
                desktop: { fontSize: '48px', color: '#00F5D4', fontWeight: '800', marginBottom: '16px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'apex_text',
              type: 'text',
              props: { text: 'Aerodynamic compression wear tested in elite high-altitude training.' },
              styles: {
                desktop: { fontSize: '16px', color: '#94A3B8', marginBottom: '32px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'apex_btn',
              type: 'button',
              props: { text: 'Gear Up Now', link: '/women' },
              styles: {
                desktop: { backgroundColor: '#00F5D4', color: '#090D16', fontWeight: '700' },
                tablet: {},
                mobile: {},
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl_luxury_jewelry',
    name: 'Royal Heritage Jewelry',
    category: 'Jewelry',
    description: 'Fine 18K solid gold, conflict-free diamond solitaires, and heirloom gemstones.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    content: {
      version: 1,
      settings: {
        background: '#111111',
        backgroundColor: '#111111',
        textColor: '#FFFDFC',
      },
      children: [
        {
          id: 'sec_jewel_hero',
          type: 'section',
          props: { containerWidth: 'boxed' },
          styles: {
            desktop: { paddingTop: '100px', paddingBottom: '100px', textAlign: 'center' },
            tablet: {},
            mobile: {},
          },
          children: [
            {
              id: 'jewel_title',
              type: 'heading',
              props: { text: 'Radiance Across Generations', tag: 'h1' },
              styles: {
                desktop: { fontSize: '42px', color: '#D4AF37', textAlign: 'center', marginBottom: '16px' },
                tablet: {},
                mobile: {},
              },
            },
            {
              id: 'jewel_text',
              type: 'text',
              props: { text: 'Master goldsmiths setting conflict-free diamonds with timeless precision.' },
              styles: {
                desktop: { color: '#CCCCCC', textAlign: 'center', marginBottom: '32px' },
                tablet: {},
                mobile: {},
              },
            },
          ],
        },
      ],
    },
  },
];

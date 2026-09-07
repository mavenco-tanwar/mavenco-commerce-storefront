import {
  ElementCategory,
  ElementDefinition,
  ElementRegistry,
  PageBuilderElement,
} from '@/types/builder.types';

export const ELEMENT_DEFINITIONS: ElementDefinition[] = [
  // ── 1. LAYOUT ELEMENTS ──
  {
    type: 'section',
    label: 'Section',
    icon: 'Layout',
    category: 'Layout',
    isContainer: true,
    allowedChildren: true,
    defaultProps: {
      tag: 'section',
      fullWidth: false,
      containerWidth: 'boxed', // 'boxed' | 'full'
    },
    defaultStyles: {
      desktop: {
        paddingTop: '60px',
        paddingBottom: '60px',
        paddingLeft: '24px',
        paddingRight: '24px',
        backgroundColor: 'transparent',
      },
      tablet: {
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      mobile: {
        paddingTop: '28px',
        paddingBottom: '28px',
        paddingLeft: '12px',
        paddingRight: '12px',
      },
    },
  },
  {
    type: 'container',
    label: 'Container',
    icon: 'Box',
    category: 'Layout',
    isContainer: true,
    allowedChildren: true,
    defaultProps: {
      direction: 'column', // 'column' | 'row'
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      wrap: 'nowrap',
    },
    defaultStyles: {
      desktop: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
      },
      tablet: {
        gap: '16px',
      },
      mobile: {
        gap: '12px',
      },
    },
  },
  {
    type: 'column',
    label: 'Column',
    icon: 'Columns',
    category: 'Layout',
    isContainer: true,
    allowedChildren: true,
    defaultProps: {
      widthFraction: 1, // e.g. 1/2, 1/3, 1/4
    },
    defaultStyles: {
      desktop: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      },
      tablet: {
        flex: '1',
      },
      mobile: {
        flex: '100%',
        width: '100%',
      },
    },
  },
  {
    type: 'inner-section',
    label: 'Inner Section',
    icon: 'Split',
    category: 'Layout',
    isContainer: true,
    allowedChildren: ['column', 'container'],
    defaultProps: {
      columnsCount: 2,
    },
    defaultStyles: {
      desktop: {
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        width: '100%',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
      tablet: {
        gap: '16px',
      },
      mobile: {
        flexDirection: 'column',
        gap: '16px',
      },
    },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    category: 'Layout',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {},
    defaultStyles: {
      desktop: {
        height: '40px',
        width: '100%',
      },
      tablet: {
        height: '30px',
      },
      mobile: {
        height: '20px',
      },
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'Minus',
    category: 'Layout',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      style: 'solid', // 'solid' | 'dashed' | 'dotted'
      color: '#E8DED8',
      thickness: '1px',
      text: '',
    },
    defaultStyles: {
      desktop: {
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
      },
      tablet: {
        marginTop: '16px',
        marginBottom: '16px',
      },
      mobile: {
        marginTop: '12px',
        marginBottom: '12px',
      },
    },
  },

  // ── 2. BASIC ELEMENTS ──
  {
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      text: 'Artisanal Silhouette Collection',
      tag: 'h2', // 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      link: '',
    },
    defaultStyles: {
      desktop: {
        fontSize: '36px',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'var(--theme-color-heading, #111111)',
        textAlign: 'left',
        margin: '0',
      },
      tablet: {
        fontSize: '30px',
      },
      mobile: {
        fontSize: '24px',
      },
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'AlignLeft',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      text: 'Handcrafted luxury with timeless silhouettes, crafted from ethically sourced fabrics designed to elevate every moment.',
    },
    defaultStyles: {
      desktop: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.6',
        color: 'var(--theme-color-text-secondary, #57534E)',
        textAlign: 'left',
        margin: '0',
      },
      tablet: {
        fontSize: '15px',
      },
      mobile: {
        fontSize: '14px',
      },
    },
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    icon: 'FileText',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      html: '<p>Discover curated editorial collections crafted for the modern connoisseur. Every seam reflects meticulous attention to design excellence.</p>',
    },
    defaultStyles: {
      desktop: {
        fontSize: '16px',
        lineHeight: '1.7',
        color: 'var(--theme-color-text, #111111)',
      },
      tablet: {
        fontSize: '15px',
      },
      mobile: {
        fontSize: '14px',
      },
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'RectangleHorizontal',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      text: 'Explore Collection',
      link: '/women',
      variant: 'primary', // 'primary' | 'secondary' | 'outline' | 'luxury-gold'
      iconName: 'ArrowRight',
      iconPosition: 'right', // 'left' | 'right'
    },
    defaultStyles: {
      desktop: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '28px',
        paddingRight: '28px',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '6px',
        backgroundColor: 'var(--theme-color-primary, #111111)',
        color: '#FFFFFF',
        cursor: 'pointer',
        border: 'none',
        textDecoration: 'none',
      },
      tablet: {
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      mobile: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px',
      },
    },
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: 'Sparkles',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      iconName: 'Sparkles',
      size: 28,
      color: 'var(--theme-color-accent, #B77A68)',
      link: '',
    },
    defaultStyles: {
      desktop: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'Image',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop',
      alt: 'Luxury Editorial Banner',
      aspectRatio: '16/9', // '16/9' | '4/3' | '1/1' | 'auto'
      objectFit: 'cover',
      link: '',
      rounded: '8px',
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'video',
    label: 'Video',
    icon: 'Video',
    category: 'Basic',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      autoplay: false,
      loop: false,
      muted: true,
      controls: true,
      aspectRatio: '16/9',
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      },
      tablet: {},
      mobile: {},
    },
  },

  // ── 3. MEDIA ELEMENTS ──
  {
    type: 'image-gallery',
    label: 'Image Gallery',
    icon: 'Grid3X3',
    category: 'Media',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      columns: 3,
      gap: 16,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
          alt: 'Lookbook Item 1',
          caption: 'Autumn Silk Drape',
        },
        {
          url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop',
          alt: 'Lookbook Item 2',
          caption: 'Festive Velvet Edit',
        },
        {
          url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop',
          alt: 'Lookbook Item 3',
          caption: 'Summer Soirée Co-ord',
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'image-slider',
    label: 'Image Slider',
    icon: 'SlidersHorizontal',
    category: 'Media',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      autoplay: true,
      intervalSec: 5,
      slides: [
        {
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
          title: 'Royal Heritage Silk',
          subtitle: 'Pure gold thread hand embroidery',
          ctaText: 'Shop New Arrivals',
          ctaLink: '/women',
        },
        {
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop',
          title: 'Mindful Sanctuary living',
          subtitle: 'Hand-thrown ceramics & linen throws',
          ctaText: 'Explore Home',
          ctaLink: '/collections',
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        minHeight: '480px',
        borderRadius: '12px',
        overflow: 'hidden',
      },
      tablet: {
        minHeight: '380px',
      },
      mobile: {
        minHeight: '280px',
      },
    },
  },
  {
    type: 'icon-box',
    label: 'Icon Box',
    icon: 'ShieldCheck',
    category: 'Media',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      iconName: 'ShieldCheck',
      title: 'Authenticity Guaranteed',
      description: 'Certified 100% genuine artisan crafts with traceability certificates.',
      link: '',
    },
    defaultStyles: {
      desktop: {
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#FAF6F2',
        textAlign: 'center',
        border: '1px solid #E8DED8',
      },
      tablet: {
        padding: '20px',
      },
      mobile: {
        padding: '16px',
      },
    },
  },

  // ── 4. CONTENT ELEMENTS ──
  {
    type: 'accordion',
    label: 'Accordion',
    icon: 'ListCollapse',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      items: [
        {
          title: 'What fabrics do you craft your garments from?',
          content: 'We use handloom Chanderi, Mulberry silk, organic combed cotton, and Belgian linen sourced directly from certified heritage clusters.',
        },
        {
          title: 'What is your international shipping timeline?',
          content: 'Express global delivery typically arrives within 3-5 business days with end-to-end temperature-controlled packaging.',
        },
        {
          title: 'Can I request bespoke custom sizing?',
          content: 'Yes, our master atelier provides bespoke sizing consultations. Select "Custom Tailoring" at checkout.',
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'tabs',
    label: 'Tabs',
    icon: 'Folders',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      tabs: [
        { label: 'Craftsmanship', content: 'Each piece takes between 14 to 48 hours of artisanal needlework.' },
        { label: 'Materials & Care', content: 'Dry clean only. Store in muslin cloth bags to preserve natural silk luster.' },
        { label: 'Ethical Sourcing', content: 'Fair-trade certified with 100% revenue reinvested into artisan welfare.' },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    icon: 'MessageSquareQuote',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      items: [
        {
          quote: 'The craftsmanship on the silk chanderi set is unmatched. I received compliments all evening!',
          author: 'Meera Singhania',
          role: 'Architect & Designer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
          rating: 5,
        },
        {
          quote: 'Seamless delivery to London in under 4 days. Packaged like a treasure.',
          author: 'Jonathan Sterling',
          role: 'Luxury Retail Director',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
          rating: 5,
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'pricing-table',
    label: 'Pricing Table',
    icon: 'CreditCard',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      tiers: [
        {
          name: 'Atelier Circle',
          price: '$99',
          period: '/ year',
          description: 'For discerning collectors seeking seasonal curations.',
          features: ['Complimentary Global Shipping', 'Early 48-hr Drop Access', 'Bespoke Hemming'],
          ctaText: 'Join Circle',
          highlighted: false,
        },
        {
          name: 'Haute VIP',
          price: '$299',
          period: '/ year',
          description: 'Unrestricted couture experience with dedicated stylists.',
          features: ['All Atelier Privileges', 'Private Stylist Consultation', 'Invitations to Paris Gala', 'Lifetime Guarantee'],
          ctaText: 'Unlock Haute VIP',
          highlighted: true,
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: 'HelpCircle',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our products, sizing, and guarantees.',
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    icon: 'Mail',
    category: 'Content',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      title: 'Get In Touch',
      submitButtonText: 'Send Message',
      showPhoneField: true,
    },
    defaultStyles: {
      desktop: {
        padding: '32px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E8DED8',
        maxWidth: '640px',
        margin: '0 auto',
      },
      tablet: {
        padding: '24px',
      },
      mobile: {
        padding: '16px',
      },
    },
  },

  // ── 5. E-COMMERCE ELEMENTS ──
  {
    type: 'product-grid',
    label: 'Product Grid',
    icon: 'Grid',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      categorySlug: '',
      department: '',
      limit: 8,
      columns: 4,
      sortBy: 'newest', // 'newest' | 'price-asc' | 'price-desc'
      showFilterBar: false,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-card',
    label: 'Product Card',
    icon: 'ShoppingBag',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      productId: '',
      showQuickAdd: true,
      showRating: true,
    },
    defaultStyles: {
      desktop: {
        maxWidth: '320px',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-image',
    label: 'Product Image',
    icon: 'Image',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      dynamicBinding: '{{ product.image }}',
      showThumbnailNav: true,
      zoomOnHover: true,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        borderRadius: '8px',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-title',
    label: 'Product Title',
    icon: 'Heading1',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      dynamicBinding: '{{ product.name }}',
      fallbackText: 'Signature Haute Silhouette Gown',
      tag: 'h1',
    },
    defaultStyles: {
      desktop: {
        fontSize: '32px',
        fontWeight: '700',
        color: 'var(--theme-color-heading, #111111)',
      },
      tablet: {
        fontSize: '26px',
      },
      mobile: {
        fontSize: '22px',
      },
    },
  },
  {
    type: 'product-price',
    label: 'Product Price',
    icon: 'DollarSign',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      dynamicBinding: '{{ product.price }}',
      compareAtBinding: '{{ product.compareAtPrice }}',
      fallbackPrice: '$285.00',
      fallbackComparePrice: '$340.00',
      showDiscountBadge: true,
    },
    defaultStyles: {
      desktop: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--theme-color-accent, #B77A68)',
      },
      tablet: {
        fontSize: '22px',
      },
      mobile: {
        fontSize: '20px',
      },
    },
  },
  {
    type: 'product-description',
    label: 'Product Description',
    icon: 'FileText',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      dynamicBinding: '{{ product.description }}',
      fallbackText: 'Crafted from pure mulberry silk with zari weave along the pallu and hem.',
    },
    defaultStyles: {
      desktop: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#57534E',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-rating',
    label: 'Product Rating',
    icon: 'Star',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      dynamicBinding: '{{ product.rating }}',
      fallbackRating: 4.9,
      fallbackReviewCount: 42,
    },
    defaultStyles: {
      desktop: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'add-to-cart',
    label: 'Add To Cart',
    icon: 'ShoppingCart',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      buttonText: 'Add to Cart',
      showQuantity: true,
      showVariantPicker: true,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        paddingTop: '14px',
        paddingBottom: '14px',
        backgroundColor: 'var(--theme-color-primary, #111111)',
        color: '#FFFFFF',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '8px',
        cursor: 'pointer',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'category-grid',
    label: 'Category Grid',
    icon: 'LayoutGrid',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      columns: 3,
      categories: [
        {
          name: 'Women Couture',
          slug: 'women',
          imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
          itemCount: 48,
        },
        {
          name: 'Kids Royal Edit',
          slug: 'kids',
          imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop',
          itemCount: 24,
        },
        {
          name: 'Festive Pret',
          slug: 'new-arrivals',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop',
          itemCount: 36,
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'category-card',
    label: 'Category Card',
    icon: 'Folder',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      name: 'Artisan Kurtis',
      slug: 'kurtis',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
      badge: 'Trending Now',
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        minHeight: '260px',
        borderRadius: '12px',
        overflow: 'hidden',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-slider',
    label: 'Product Slider',
    icon: 'Sliders',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      title: 'Trending Haute Pieces',
      subtitle: 'Most coveted silhouettes this week',
      category: 'women',
      limit: 6,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'featured-products',
    label: 'Featured Products',
    icon: 'Sparkles',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      headline: 'Curator’s Choice',
      badge: 'Limited Edition Atelier Run',
      count: 4,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'related-products',
    label: 'Related Products',
    icon: 'GitFork',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      title: 'Complete The Ensemble',
      count: 4,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-search',
    label: 'Product Search',
    icon: 'Search',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      placeholder: 'Search our catalog of fine couture...',
      showSuggestions: true,
    },
    defaultStyles: {
      desktop: {
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'product-filter',
    label: 'Product Filter',
    icon: 'Filter',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      filterTypes: ['category', 'price', 'size', 'color'],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'cart-summary',
    label: 'Cart Summary',
    icon: 'ShoppingBag',
    category: 'Ecommerce',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      showCheckoutButton: true,
      freeShippingThreshold: 150,
    },
    defaultStyles: {
      desktop: {
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#FAF6F2',
        border: '1px solid #E8DED8',
      },
      tablet: {},
      mobile: {},
    },
  },

  // ── 6. NAVIGATION ELEMENTS ──
  {
    type: 'header',
    label: 'Header',
    icon: 'PanelTop',
    category: 'Navigation',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      logoText: 'Lumina Atelier',
      logoUrl: '',
      showSearch: true,
      showCart: true,
      showAccount: true,
      isSticky: true,
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        backgroundColor: 'rgba(255, 253, 252, 0.95)',
        borderBottom: '1px solid #E8DED8',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'navigation-menu',
    label: 'Navigation Menu',
    icon: 'Menu',
    category: 'Navigation',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      items: [
        { label: 'Women', url: '/women' },
        { label: 'Kids', url: '/kids' },
        { label: 'New Arrivals', url: '/new-arrivals' },
        { label: 'Lookbook', url: '/collections' },
        { label: 'Our Atelier', url: '/about' },
      ],
      align: 'center',
    },
    defaultStyles: {
      desktop: {
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
      },
      tablet: {
        gap: '16px',
      },
      mobile: {
        flexDirection: 'column',
      },
    },
  },
  {
    type: 'breadcrumb',
    label: 'Breadcrumb',
    icon: 'ChevronRight',
    category: 'Navigation',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      separator: 'ChevronRight',
      showHome: true,
    },
    defaultStyles: {
      desktop: {
        fontSize: '13px',
        color: '#777777',
      },
      tablet: {},
      mobile: {},
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: 'PanelBottom',
    category: 'Navigation',
    isContainer: false,
    allowedChildren: false,
    defaultProps: {
      brandName: 'Lumina Atelier',
      tagline: 'Artisanal Haute Pret & Mindful Luxury',
      copyright: '© 2026 Lumina Atelier. All rights reserved.',
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'Women Silhouettes', url: '/women' },
            { label: 'Kids Royals', url: '/kids' },
            { label: 'Seasonal Lookbooks', url: '/collections' },
          ],
        },
        {
          title: 'Atelier Care',
          links: [
            { label: 'Custom Tailoring', url: '/contact' },
            { label: 'Shipping & Returns', url: '/faq' },
            { label: 'Traceability Certificate', url: '/about' },
          ],
        },
      ],
    },
    defaultStyles: {
      desktop: {
        width: '100%',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        paddingTop: '64px',
        paddingBottom: '40px',
      },
      tablet: {
        paddingTop: '48px',
        paddingBottom: '32px',
      },
      mobile: {
        paddingTop: '36px',
        paddingBottom: '24px',
      },
    },
  },
];

const registryMap: Map<string, ElementDefinition> = new Map(
  ELEMENT_DEFINITIONS.map((def) => [def.type, def])
);

/**
 * Register or override an element definition in the registry.
 */
export function registerElement(def: ElementDefinition): void {
  registryMap.set(def.type, def);
}

/**
 * Get the element definition for a specific type.
 */
export function getElementDefinition(type: string): ElementDefinition | undefined {
  return registryMap.get(type);
}

/**
 * Get all element definitions in the registry.
 */
export function getAllElementDefinitions(): ElementDefinition[] {
  return Array.from(registryMap.values());
}

/**
 * Group element definitions by category.
 */
export function getElementsByCategory(): Record<ElementCategory, ElementDefinition[]> {
  const categories: Record<ElementCategory, ElementDefinition[]> = {
    Layout: [],
    Basic: [],
    Media: [],
    Content: [],
    Ecommerce: [],
    Navigation: [],
  };

  for (const def of Array.from(registryMap.values())) {
    if (categories[def.category]) {
      categories[def.category].push(def);
    }
  }

  return categories;
}

/**
 * Validates whether parentType accepts childType.
 */
export function canAcceptChild(parentType: string, childType: string): boolean {
  const parentDef = getElementDefinition(parentType);
  if (!parentDef || !parentDef.isContainer) {
    return false;
  }

  if (parentDef.allowedChildren === true) {
    return true;
  }

  if (Array.isArray(parentDef.allowedChildren)) {
    return parentDef.allowedChildren.includes(childType);
  }

  return false;
}

/**
 * Generates a default element instance ready to be placed on the canvas.
 */
export function createDefaultElement(type: string, customProps?: Record<string, any>): PageBuilderElement {
  const def = getElementDefinition(type);
  if (!def) {
    throw new Error(`Unknown element type: "${type}"`);
  }

  const id = `el_${type}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    type,
    label: def.label,
    props: {
      ...JSON.parse(JSON.stringify(def.defaultProps)),
      ...(customProps || {}),
    },
    styles: JSON.parse(JSON.stringify(def.defaultStyles)),
    advanced: {
      customClass: '',
      hideOnDesktop: false,
      hideOnTablet: false,
      hideOnMobile: false,
    },
    children: def.isContainer ? [] : undefined,
  };
}

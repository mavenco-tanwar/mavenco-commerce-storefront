/**
 * Visual Page Builder Core Type Definitions
 * Schema supporting:
 * - Unique IDs
 * - Parent / child element tree
 * - Responsive styles (desktop, tablet, mobile)
 * - Advanced attributes (visibility, custom classes, custom attributes)
 * - Dynamic data bindings (e.g. {{ product.title }})
 * - Reusable components and templates
 * - Versioning and immutable snapshots
 */

export type ResponsiveDevice = 'desktop' | 'tablet' | 'mobile';

export type ElementCategory =
  | 'Layout'
  | 'Basic'
  | 'Media'
  | 'Content'
  | 'Ecommerce'
  | 'Navigation';

export interface ResponsiveStyles {
  desktop?: Record<string, any>;
  tablet?: Record<string, any>;
  mobile?: Record<string, any>;
}

export interface ElementAdvancedSettings {
  customClass?: string;
  customId?: string;
  customCss?: string;
  zIndex?: number;
  opacity?: number;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
  attributes?: Record<string, string>;
  animation?: {
    type?: string;
    durationMs?: number;
    delayMs?: number;
  };
}

export interface PageBuilderElement {
  id: string;
  type: string;
  label?: string;
  props: Record<string, any>;
  styles: ResponsiveStyles;
  advanced?: ElementAdvancedSettings;
  children?: PageBuilderElement[];
  isLocked?: boolean;
}

export interface PageGlobalSettings {
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  maxWidth?: string;
  padding?: string;
  fontFamily?: string;
  textColor?: string;
  customCss?: string;
}

export interface PageBuilderContent {
  version: number;
  settings: PageGlobalSettings;
  children: PageBuilderElement[];
}

export interface PageSeoSettings {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  keywords?: string[];
}

export interface PageBuilderDocument {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  type:
    | 'page'
    | 'homepage'
    | 'product-template'
    | 'category-template'
    | 'header'
    | 'footer'
    | 'custom';
  status: 'draft' | 'published' | 'archived';
  version: number;
  content: PageBuilderContent;
  publishedVersion?: number;
  publishedContent?: PageBuilderContent;
  seo?: PageSeoSettings;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PageVersionSnapshot {
  id: string;
  pageId: string;
  tenantId: string;
  version: number;
  title: string;
  content: PageBuilderContent;
  seo?: PageSeoSettings;
  author?: string;
  changelog?: string;
  createdAt: string;
}

export interface ReusableComponent {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  elementTree: PageBuilderElement;
  createdAt: string;
  updatedAt: string;
}

export interface PageTemplate {
  id: string;
  tenantId?: string; // If undefined, it's a global platform preset template
  name: string;
  category:
    | 'Ecommerce'
    | 'Fashion'
    | 'Furniture'
    | 'Electronics'
    | 'Jewelry'
    | 'Grocery'
    | 'Restaurant'
    | 'Business'
    | 'Landing Pages';
  description?: string;
  thumbnailUrl?: string;
  content: PageBuilderContent;
  isSystem?: boolean;
  createdAt: string;
}

export interface ElementDefinition {
  type: string;
  label: string;
  icon: string;
  category: ElementCategory;
  defaultProps: Record<string, any>;
  defaultStyles: ResponsiveStyles;
  allowedChildren?: string[] | boolean; // true = allows any child, false/undefined = no children, string[] = allowed types
  isContainer?: boolean;
}

export interface ElementRegistry {
  [type: string]: ElementDefinition;
}

export interface DynamicDataVariable {
  key: string;
  label: string;
  category: 'product' | 'category' | 'store' | 'user';
  exampleValue: string;
}

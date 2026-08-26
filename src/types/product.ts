export type Department = 'women' | 'kids' | 'unisex';

export type CategorySlug = 
  | 'dresses' 
  | 'tops' 
  | 'kurtis' 
  | 'co-ords' 
  | 'ethnic-wear' 
  | 'western-wear' 
  | 'bottoms' 
  | 'accessories'
  | 'girls' 
  | 'boys' 
  | 'casual-wear';

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface ProductSize {
  size: string; // 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '2-3Y' | '3-4Y' | '5-6Y' | '7-8Y' | '9-10Y' | '11-12Y'
  inStock: boolean;
  stockCount: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  department: Department;
  category: CategorySlug;
  categoryName: string;
  price: number;
  compareAtPrice: number;
  discountPercent: number;
  shortDescription: string;
  description: string;
  features: string[];
  fabric: string;
  careInstructions: string[];
  images: ProductImage[];
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  badge?: 'Trending' | 'Best Seller' | 'New' | 'Sale' | 'Studio Exclusive';
  tags: string[];
  fit?: string;
  modelInfo?: string;
}

export interface FilterState {
  departments: Department[];
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  minRating: number | null;
  onlyInStock: boolean;
  onSaleOnly: boolean;
  isNewOnly: boolean;
}

export type SortOption = 
  | 'recommended' 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc' 
  | 'popular';

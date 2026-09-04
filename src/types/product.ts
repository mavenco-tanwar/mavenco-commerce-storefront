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
  | 'casual-wear'
  | string;

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface ProductSize {
  size: string;
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
  compareAtPrice?: number;
  discountPercent?: number;
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
  badge?: string;
  tags: string[];
  fit?: string;
  modelInfo?: string;
  status?: 'published' | 'draft' | 'archived' | string;
}

export type SortOption = 'recommended' | 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'rating-desc' | 'popular';

export interface FilterState {
  departments?: Department[];
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  minRating?: number | null;
  onlyInStock?: boolean;
  isSale?: boolean;
  onSaleOnly?: boolean;
  isNewArrival?: boolean;
  isNewOnly?: boolean;
  isBestSeller?: boolean;
}

export interface ProductQueryParams {
  department?: Department;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
  status?: string;
  tenant?: string;
}

export interface ProductListResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

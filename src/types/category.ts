import { Department } from './product';

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  department: Department;
  description: string;
  imageUrl: string;
  subcategories: Subcategory[];
  featured?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  badge?: string;
  productIds?: string[];
}

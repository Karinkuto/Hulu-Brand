export interface Product {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  variants: ProductVariant[];
  createdAt: Date;
  // ... other properties
}

export interface ProductVariant {
  sku: string;
  size: string;
  stock: number;
  price: number;
  color?: string;
  material?: string;
  images: string[];
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  // ... other properties
}

// ... any other types or interfaces

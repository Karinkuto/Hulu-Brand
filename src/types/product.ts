export interface Product {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  category: string;
  status: "active" | "inactive";
  variants: ProductVariant[];
  basePrice: number;
  featured?: boolean;
  brand?: string;
  slug?: string;
}

export interface ProductVariant {
  sku: string;
  size: string;
  stock: number;
  price: number;
  color?: string;
  material?: string;
  images: string[];
}

// ... any other types or interfaces

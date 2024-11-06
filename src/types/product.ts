export interface Product {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  status: "active" | "inactive";
  variants: ProductVariant[];
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

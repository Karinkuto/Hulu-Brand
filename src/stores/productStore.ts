// @ts-nocheck
import create from "zustand";

interface Variant {
  sku: string;
  size: string;
  stock: number;
  price: number;
  color?: string;
  material?: string;
  discount?: number;
  discountType?: "percentage" | "fixed";
  images: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  status: "active" | "inactive";
  variants: Variant[];
  discountStartDate?: Date;
  discountEndDate?: Date;
}

interface Sale {
  productId: string;
  variantSku: string;
  quantity: number;
  date: Date;
}

interface OrderItem {
  productId: string;
  variantSku: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  date: Date;
<<<<<<< HEAD
  status: "completed" | "processing" | "shipped" | "cancelled";
=======
  status: 'completed' | 'processing' | 'shipped' | 'cancelled';
>>>>>>> 79c024ba4803911fa97409be7d238505eac61268
  total: number;
  items: OrderItem[];
}

interface Filters {
  categories: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  priceRange: [number | null, number | null];
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  sales: Sale[];
  orders: Order[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (productId: string, variantSku: string, quantity: number) => void;
  getTrendingProducts: () => Product[];
  applyDiscount: (
    productId: string,
    discount: number,
    discountType: "percentage" | "fixed",
    discountStartDate?: Date,
    discountEndDate?: Date,
    variantSku?: string
  ) => void;
  getOrders: () => Order[];
  addOrder: (order: Order) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:1337/api/products?populate=*", {
    method: "GET",
    headers: {
      Authorization: `Bearer db771fcfc553cac5cf7372848bc167426fb5867dfc74e646651081224a41a80f5521863b170f1efa072e873022784a33ce0a6a3f6aeee01c66ea735542bc3160a8f106f7a3463ce6cdd4b5b8c9edc787671897c68924ba8e6798b52b5497d854f05ffbd6cd08e478876521a6b76106bb9016b0329d5ea764aeaa1073ddf2cca2`,
      "Content-Type": "application/json",
    },
  });
  const products = await response.json();
  
  return products['data'].map((p: any) => ({
    id: p.id.toString(),
    name: p?.name,
    description: p.description?.[0]?.children?.[0]?.text,
    coverImage: `http://localhost:1337/${p?.image?.[0]?.url}`,
    category: p.category,
    status: p.status,
    price: p.price,
    variants: p.variants?.data?.map((v: any) => ({
      id: v.id.toString(),
      size: v.size,
      material: v.material,
      color: v.color,
      price: v.price,
      quantity: v.quantity,
    })),
  }));
};

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    description: "A comfortable and versatile t-shirt for everyday wear.",
    coverImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "tops",
    status: "active",
    variants: [
      {
        sku: "CT-S-WHT",
        size: "S",
        stock: 50,
        price: 19.99,
        color: "White",
        material: "Cotton",
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
      {
        sku: "CT-M-BLK",
        size: "M",
        stock: 75,
        price: 19.99,
        color: "Black",
        material: "Cotton",
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with a comfortable stretch.",
    coverImage:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "bottoms",
    status: "active",
    variants: [
      {
        sku: "SFJ-30-BLU",
        size: "30",
        stock: 40,
        price: 49.99,
        color: "Blue",
        material: "Denim",
        images: [
          "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
      {
        sku: "SFJ-32-BLK",
        size: "32",
        stock: 55,
        price: 49.99,
        color: "Black",
        material: "Denim",
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    description: "A light and breezy floral dress perfect for summer days.",
    coverImage:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "dresses",
    status: "active",
    variants: [
      {
        sku: "FSD-S-FLR",
        size: "S",
        stock: 30,
        price: 39.99,
        color: "Floral",
        material: "Chiffon",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
      {
        sku: "FSD-M-FLR",
        size: "M",
        stock: 45,
        price: 39.99,
        color: "Floral",
        material: "Chiffon",
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Leather Jacket",
    description: "A classic leather jacket for a timeless look.",
    coverImage:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "outerwear",
    status: "active",
    variants: [
      {
        sku: "LJ-S-BLK",
        size: "S",
        stock: 20,
        price: 199.99,
        color: "Black",
        material: "Leather",
        images: [
          "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
      {
        sku: "LJ-M-BRN",
        size: "M",
        stock: 30,
        price: 199.99,
        color: "Brown",
        material: "Leather",
        images: [
          "https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Running Shoes",
    description: "Lightweight and comfortable shoes for your daily run.",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "footwear",
    status: "active",
    variants: [
      {
        sku: "RS-8-GRY",
        size: "8",
        stock: 40,
        price: 89.99,
        color: "Gray",
        material: "Synthetic",
        images: [
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
      {
        sku: "RS-9-BLK",
        size: "9",
        stock: 50,
        price: 89.99,
        color: "Black",
        material: "Synthetic",
        images: [
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Polo Shirt",
    description: "Classic polo shirt for a smart casual look.",
    coverImage:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "tops",
    status: "active",
    variants: [
      {
        sku: "PS-M-NVY",
        size: "M",
        stock: 60,
        price: 29.99,
        color: "Navy",
        material: "Cotton",
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "7",
    name: "Cargo Pants",
    description: "Durable cargo pants with multiple pockets.",
    coverImage:
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "bottoms",
    status: "active",
    variants: [
      {
        sku: "CP-32-KHK",
        size: "32",
        stock: 45,
        price: 59.99,
        color: "Khaki",
        material: "Cotton",
        images: [
          "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "8",
    name: "Wool Sweater",
    description: "Warm and cozy wool sweater for cold days.",
    coverImage:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "tops",
    status: "active",
    variants: [
      {
        sku: "WS-L-GRY",
        size: "L",
        stock: 30,
        price: 79.99,
        color: "Gray",
        material: "Wool",
        images: [
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "9",
    name: "Silk Scarf",
    description: "Elegant silk scarf to complement any outfit.",
    coverImage:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "accessories",
    status: "active",
    variants: [
      {
        sku: "SS-OS-RED",
        size: "One Size",
        stock: 50,
        price: 29.99,
        color: "Red",
        material: "Silk",
        images: [
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "10",
    name: "Denim Jacket",
    description: "Classic denim jacket for a casual look.",
    coverImage:
      "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "outerwear",
    status: "active",
    variants: [
      {
        sku: "DJ-M-BLU",
        size: "M",
        stock: 0, // Out of stock scenario
        price: 69.99,
        color: "Blue",
        material: "Denim",
        images: [
          "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Summer Hat",
    description: "Stylish summer hat for sun protection.",
    coverImage:
      "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
    category: "accessories",
    status: "inactive", // Inactive product scenario
    variants: [
      {
        sku: "SH-OS-BEG",
        size: "One Size",
        stock: 100,
        price: 24.99,
        color: "Beige",
        material: "Straw",
        images: [
          "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
        ],
      },
    ],
  },
];

const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    date: new Date("2023-06-01"),
    status: "completed",
    total: 89.97,
    items: [
      { productId: "1", variantSku: "CT-S-WHT", quantity: 2, price: 19.99 },
      { productId: "2", variantSku: "SFJ-30-BLU", quantity: 1, price: 49.99 },
    ],
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    date: new Date("2023-06-02"),
    status: "processing",
    total: 199.99,
    items: [
      { productId: "4", variantSku: "LJ-S-BLK", quantity: 1, price: 199.99 },
    ],
  },
  {
    id: "ORD-003",
    customerId: "CUST-003",
    date: new Date("2023-06-03"),
    status: "shipped",
    total: 129.97,
    items: [
      { productId: "3", variantSku: "FSD-S-FLR", quantity: 1, price: 39.99 },
      { productId: "5", variantSku: "RS-8-GRY", quantity: 1, price: 89.98 },
    ],
  },
  {
    id: "ORD-004",
    customerId: "CUST-001",
    date: new Date("2023-06-05"),
    status: "processing",
    total: 109.98,
    items: [
      { productId: "8", variantSku: "WS-L-GRY", quantity: 1, price: 79.99 },
      { productId: "9", variantSku: "SS-OS-RED", quantity: 1, price: 29.99 },
    ],
  },
  {
    id: "ORD-005",
    customerId: "CUST-004",
    date: new Date("2023-06-06"),
    status: "cancelled",
    total: 69.99,
    items: [
      { productId: "10", variantSku: "DJ-M-BLU", quantity: 1, price: 69.99 },
    ],
  },
];

const initialProducts: Product[] = dummyProducts;
const initialOrders: Order[] = dummyOrders;

export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,
  featuredProducts: initialProducts.slice(0, 4),
  trendingProducts: initialProducts.slice(0, 4),
  sales: [],
  orders: initialOrders,
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  addProduct: (product) => {
    console.log("Adding product:", product);
    set((state) => {
      const newState = {
        products: [
          ...state.products,
          {
            ...product,
            category: product.category || "Uncategorized",
            coverImage: product.coverImage || "",
            variants: product.variants.map((v) => ({
              ...v,
              stock: parseInt(v.stock.toString(), 10) || 0,
              price: parseFloat(v.price.toString()) || 0,
            })),
          },
        ],
      };
      console.log("New state:", newState);
      return newState;
    });
    console.log("State after update:", useProductStore.getState().products);
  },
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  addSale: (productId, variantSku, quantity) => {
    set((state) => ({
      sales: [
        ...state.sales,
        { productId, variantSku, quantity, date: new Date() },
      ],
    }));
  },
  getTrendingProducts: () => {
    const state = get();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // If there are sales, use them to determine trending products
    if (state.sales.length > 0) {
      const recentSales = state.sales.filter((sale) => sale.date >= lastMonth);
      const productSales = recentSales.reduce((acc, sale) => {
        acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([productId]) => state.products.find((p) => p.id === productId)!)
        .filter(Boolean);
    } else {
      // If no sales data, return a random selection of products
      return state.products.sort(() => 0.5 - Math.random()).slice(0, 8);
    }
  },
  applyDiscount: (
    productId,
    discount,
    discountType,
    discountStartDate,
    discountEndDate,
    variantSku
  ) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...(variantSku ? {} : { discount, discountType }),
              discountStartDate,
              discountEndDate,
              variants: product.variants.map((variant) =>
                variantSku && variant.sku === variantSku
                  ? { ...variant, discount, discountType }
                  : variant
              ),
            }
          : product
      ),
    }));
  },
  getOrders: () => get().orders,
  addOrder: (order: Order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  filters: {
    categories: [],
    colors: [],
    sizes: [],
    materials: [],
    priceRange: [null, null],
  },
  setFilters: (filters) => set({ filters }),
<<<<<<< HEAD
  resetFilters: () =>
    set({
      filters: {
        categories: [],
        colors: [],
        sizes: [],
        materials: [],
        priceRange: [null, null],
      },
    }),
}));
=======
  resetFilters: () => set({ filters: { categories: [], colors: [], sizes: [], materials: [], priceRange: [null, null] } }),
}));
>>>>>>> 79c024ba4803911fa97409be7d238505eac61268

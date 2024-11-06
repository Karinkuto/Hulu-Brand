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
  basePrice: number;
  images: string[];
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
  status: "completed" | "processing" | "shipped" | "cancelled";
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
  isLoading: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<Product[]>;
  fetchOrders: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (productId: string, variantSku: string, quantity: number) => Promise<void>;
  getTrendingProducts: () => Promise<void>;
  applyDiscount: (
    productId: string,
    discount: number,
    discountType: "percentage" | "fixed",
    discountStartDate?: Date,
    discountEndDate?: Date,
    _variantSku?: string
  ) => Promise<void>;
  getOrders: () => Order[];
  addOrder: (order: Order) => Promise<void>;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  description: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  category: string;
  basePrice: number;
  brand: string;
  featured: boolean;
  slug: string;
  images: Array<{
    id: number;
    url: string;
    formats: {
      thumbnail: { url: string };
      small: { url: string };
      medium: { url: string };
    };
  }>;
  variants: Array<{
    id: number;
    size: string;
    material: string;
    color: string;
    price: number;
    quantity: number;
  }>;
}

interface StrapiVariant {
  id: number;
  attributes: {
    size: string;
    material: string;
    color: string;
    price: number;
    quantity: number;
  };
}

export type { Product, Variant, Order, Sale, Filters };

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  sales: [],
  orders: [],
  searchTerm: "",
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/products?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN.trim()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error('Response status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const products = data.data.map((p: StrapiProduct) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description?.[0]?.children?.[0]?.text || '',
        coverImage: p.images?.[0]?.url 
          ? `${import.meta.env.VITE_STRAPI_MEDIA_URL}${p.images[0].url}`
          : "/placeholder-image.jpg",
        images: p.images?.slice(1).map(img => img.url) || [],
        category: p.category,
        status: 'active',
        basePrice: p.basePrice || 0,
        featured: p.featured || false,
        variants: p.variants?.map(v => ({
          sku: v.id?.toString() || '',
          size: v.size || '',
          material: v.material || '',
          color: v.color || '',
          price: v.price || p.basePrice,
          stock: v.quantity || 0,
          images: [],
        })) || [{
          sku: p.id.toString(),
          size: 'Default',
          price: p.basePrice,
          stock: 1,
          images: p.images?.map(img => `${import.meta.env.VITE_STRAPI_MEDIA_URL}${img.url}`) || [],
        }],
      }));

      console.log('Processed products:', products);

      set({ 
        products,
        featuredProducts: products.filter(p => p.featured).slice(0, 4),
        isLoading: false 
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/orders?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      set({ orders: data.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/products`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: product }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh products after adding
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/products/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: updates }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh products after updating
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh products after deleting
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addSale: async (productId, variantSku, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/sales`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { productId, variantSku, quantity } }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh sales after adding
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getTrendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      if (state.sales.length > 0) {
        const recentSales = state.sales.filter((sale) => sale.date >= lastMonth);
        const productSales = recentSales.reduce((acc, sale) => {
          acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
          return acc;
        }, {} as Record<string, number>);

        const trendingProducts = Object.entries(productSales)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([productId]) => state.products.find((p) => p.id === productId)!)
          .filter(Boolean);

        set({ trendingProducts, isLoading: false });
      } else {
        set({ trendingProducts: state.products.sort(() => 0.5 - Math.random()).slice(0, 8), isLoading: false });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  applyDiscount: async (
    productId,
    discount,
    discountType,
    discountStartDate,
    discountEndDate,
    _variantSku
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/products/${productId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { discount, discountType, discountStartDate, discountEndDate } }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh products after applying discount
      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getOrders: () => get().orders,

  addOrder: async (order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_STRAPI_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: order }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Refresh orders after adding
      await get().fetchOrders();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  filters: {
    categories: [],
    colors: [],
    sizes: [],
    materials: [],
    priceRange: [null, null],
  },

  setFilters: (filters) => set({ filters }),

  resetFilters: () => set({
    filters: {
      categories: [],
      colors: [],
      sizes: [],
      materials: [],
      priceRange: [null, null],
    },
  }),
}));

// Add these exports for direct function access
export const fetchProducts = () => useProductStore.getState().fetchProducts();
export const fetchOrders = () => useProductStore.getState().fetchOrders();
export const addProduct = (product: Product) => useProductStore.getState().addProduct(product);
export const updateProduct = (id: string, updates: Partial<Product>) => 
  useProductStore.getState().updateProduct(id, updates);
export const deleteProduct = (id: string) => useProductStore.getState().deleteProduct(id);
export const addSale = (productId: string, variantSku: string, quantity: number) => 
  useProductStore.getState().addSale(productId, variantSku, quantity);
export const getTrendingProducts = () => useProductStore.getState().getTrendingProducts();
export const getOrders = () => useProductStore.getState().getOrders();
export const addOrder = (order: Order) => useProductStore.getState().addOrder(order);

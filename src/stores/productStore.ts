import create from "zustand";

interface Variant {
  sku: string;
  size: string;
  stock: number;
  price: number;
  color?: string;
  material?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  variants: Variant[];
  discount?: number;
}

interface Sale {
  productId: string;
  variantSku: string;
  quantity: number;
  date: Date;
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  sales: Sale[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (productId: string, variantSku: string, quantity: number) => void;
  getTrendingProducts: () => Product[];
  applyDiscount: (productId: string, discount: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  sales: [],
  addProduct: (product) => {
    console.log("Adding product:", product);
    set((state) => {
      const newState = {
        products: [
          ...state.products,
          {
            ...product,
            category: product.category || "Uncategorized",
            image: product.image || "", // Ensure this can be an empty string
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
  },
  applyDiscount: (productId, discount) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, discount } : product
      ),
    }));
  },
}));

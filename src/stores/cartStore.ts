import create from "zustand";
import { Product, Variant } from "../types/product";

interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, variant, quantity) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.variant.sku === variant.sku
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.variant.sku === variant.sku
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, variant, quantity }] };
    });
  },
  removeItem: (sku) => {
    set((state) => ({
      items: state.items.filter((item) => item.variant.sku !== sku),
    }));
  },
  updateQuantity: (sku, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.variant.sku === sku ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  total: () => {
    return get().items.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  },
}));

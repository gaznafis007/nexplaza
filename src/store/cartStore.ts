import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_STORAGE_KEY } from "@/lib/constants";
import { getDisplayPrice } from "@/lib/price";
import { getProductImageUrl } from "@/lib/image";
import type { AddToCartPayload, CartItem } from "@/types/cart";

type CartStoreState = {
  items: CartItem[];
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (variantCode: string) => void;
  updateQty: (variantCode: string, qty: number) => void;
  clearCart: () => void;
};

function buildCartItem(payload: AddToCartPayload, qty: number): CartItem {
  const { product, variant } = payload;

  return {
    productUid: product.uid,
    productName: product.enName,
    imageUrl: getProductImageUrl(product.images),
    variantCode: variant.posItemCode,
    mrpPrice: variant.mrpPrice,
    sellingPrice: getDisplayPrice(variant),
    qty,
    maxQty: variant.quantity,
  };
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: ({ product, variant, qty = 1 }) => {
        if (variant.quantity <= 0) {
          throw new Error("This variant is out of stock");
        }

        const existing = get().items.find(
          (item) => item.variantCode === variant.posItemCode,
        );

        if (existing) {
          const nextQty = Math.min(existing.qty + qty, variant.quantity);
          set({
            items: get().items.map((item) =>
              item.variantCode === variant.posItemCode
                ? { ...item, qty: nextQty, maxQty: variant.quantity }
                : item,
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            buildCartItem({ product, variant, qty }, Math.min(qty, variant.quantity)),
          ],
        });
      },
      removeItem: (variantCode) => {
        set({
          items: get().items.filter((item) => item.variantCode !== variantCode),
        });
      },
      updateQty: (variantCode, qty) => {
        if (qty <= 0) {
          get().removeItem(variantCode);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantCode === variantCode
              ? { ...item, qty: Math.min(qty, item.maxQty) }
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
    },
  ),
);

export function selectCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.sellingPrice * item.qty, 0);
}

export function selectCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

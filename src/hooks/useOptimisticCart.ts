"use client";

import { useOptimistic, useTransition } from "react";
import { useCart } from "@/hooks/useCart";
import { getDisplayPrice } from "@/lib/price";
import type { AddToCartPayload, CartItem, CartOptimisticAction } from "@/types/cart";

function cartOptimisticReducer(
  state: CartItem[],
  action: CartOptimisticAction,
): CartItem[] {
  if (action.type === "add") {
    const existing = state.find(
      (item) => item.variantCode === action.item.variantCode,
    );
    if (existing) {
      return state.map((item) =>
        item.variantCode === action.item.variantCode
          ? { ...item, qty: item.qty + action.item.qty }
          : item,
      );
    }
    return [...state, action.item];
  }

  if (action.type === "updateQty") {
    if (action.qty <= 0) {
      return state.filter((item) => item.variantCode !== action.variantCode);
    }
    return state.map((item) =>
      item.variantCode === action.variantCode
        ? { ...item, qty: action.qty }
        : item,
    );
  }

  return state.filter((item) => item.variantCode !== action.variantCode);
}

export function useOptimisticCart() {
  const { items, addItem, removeItem, updateQty, total, count } = useCart();
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, dispatchOptimistic] = useOptimistic(
    items,
    cartOptimisticReducer,
  );

  const optimisticTotal = optimisticItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.qty,
    0,
  );
  const optimisticCount = optimisticItems.reduce(
    (sum, item) => sum + item.qty,
    0,
  );

  const addToCart = (payload: AddToCartPayload) => {
    const { product, variant, qty = 1 } = payload;
    const optimisticItem: CartItem = {
      productUid: product.uid,
      productName: product.enName,
      imageUrl: product.images[0]?.url ?? null,
      variantCode: variant.posItemCode,
      mrpPrice: variant.mrpPrice,
      sellingPrice: getDisplayPrice(variant),
      qty,
      maxQty: variant.quantity,
    };

    startTransition(() => {
      dispatchOptimistic({ type: "add", item: optimisticItem });
      try {
        addItem(payload);
      } catch {
        // Optimistic state reverts when transition completes without store update.
      }
    });
  };

  const updateCartQty = (variantCode: string, qty: number) => {
    startTransition(() => {
      dispatchOptimistic({ type: "updateQty", variantCode, qty });
      updateQty(variantCode, qty);
    });
  };

  const removeFromCart = (variantCode: string) => {
    startTransition(() => {
      dispatchOptimistic({ type: "remove", variantCode });
      removeItem(variantCode);
    });
  };

  return {
    items: optimisticItems,
    storeItems: items,
    total: isPending ? optimisticTotal : total,
    count: isPending ? optimisticCount : count,
    addToCart,
    updateCartQty,
    removeFromCart,
    isPending,
  };
}

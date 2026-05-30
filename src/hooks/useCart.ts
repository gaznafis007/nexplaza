import { useCartStore, selectCartCount, selectCartTotal } from "@/store/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);

  return {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    total: selectCartTotal(items),
    count: selectCartCount(items),
  };
}

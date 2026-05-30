"use client";

import { ShoppingBag, X } from "lucide-react";
import { CartItemRow } from "@/components/cart/CartItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { useOptimisticCart } from "@/hooks/useOptimisticCart";
import { formatPrice } from "@/lib/price";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, count } = useOptimisticCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close cart overlay"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl ring-1 ring-border/80">
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <h2 className="text-sm font-medium tracking-tight">
              Bag ({count})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-background hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <EmptyState
              title="Your bag is empty"
              description="Browse the catalog and add items you like."
            />
          ) : (
            items.map((item) => (
              <CartItemRow key={item.variantCode} item={item} />
            ))
          )}
        </div>

        <div className="border-t border-border/80 px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted">Subtotal</span>
            <span className="text-base font-semibold tabular-nums tracking-tight">
              {formatPrice(total)}
            </span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            className="h-10 w-full rounded-lg bg-foreground text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Review bag
          </button>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useOptimisticCart } from "@/hooks/useOptimisticCart";
import { formatPrice } from "@/lib/price";
import { PLACEHOLDER_IMAGE } from "@/lib/image";
import type { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateCartQty, removeFromCart } = useOptimisticCart();

  return (
    <div className="flex gap-4 border-b border-border/80 py-4 last:border-b-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border/80">
        <Image
          src={item.imageUrl ?? PLACEHOLDER_IMAGE}
          alt={item.productName}
          fill
          sizes="64px"
          className="object-cover"
          unoptimized={!item.imageUrl}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {item.productName}
            </p>
            <p className="text-xs text-muted">{item.variantCode}</p>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.variantCode)}
            className="shrink-0 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-foreground"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium tabular-nums text-foreground">
            {formatPrice(item.sellingPrice)}
          </p>

          <div className="flex items-center gap-1 rounded-lg ring-1 ring-border/80">
            <button
              type="button"
              onClick={() => updateCartQty(item.variantCode, item.qty - 1)}
              className="rounded-l-lg p-1.5 text-muted transition hover:bg-background hover:text-foreground"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="min-w-6 text-center text-xs font-medium tabular-nums">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => updateCartQty(item.variantCode, item.qty + 1)}
              disabled={item.qty >= item.maxQty}
              className="rounded-r-lg p-1.5 text-muted transition hover:bg-background hover:text-foreground disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

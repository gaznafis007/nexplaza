"use client";

import { ShoppingBag } from "lucide-react";
import { useOptimisticCart } from "@/hooks/useOptimisticCart";

type CartBadgeProps = {
  onClick: () => void;
};

export function CartBadge({ onClick }: CartBadgeProps) {
  const { count } = useOptimisticCart();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-lg p-2 text-muted transition hover:bg-background hover:text-foreground"
      aria-label={`Open bag with ${count} items`}
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
          {count}
        </span>
      ) : null}
    </button>
  );
}

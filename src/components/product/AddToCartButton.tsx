"use client";

import { useOptimistic, useTransition } from "react";
import { useOptimisticCart } from "@/hooks/useOptimisticCart";
import type { AddToCartPayload } from "@/types/cart";

type AddToCartButtonProps = {
  payload: AddToCartPayload;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
};

export function AddToCartButton({
  payload,
  disabled = false,
  className = "",
  compact = false,
}: AddToCartButtonProps) {
  const { addToCart } = useOptimisticCart();
  const [isPending, startTransition] = useTransition();
  const [optimisticAdded, setOptimisticAdded] = useOptimistic(
    false,
    (_current, next: boolean) => next,
  );

  const isOutOfStock = payload.variant.quantity <= 0;
  const isDisabled = disabled || isOutOfStock || isPending;

  const handleClick = () => {
    startTransition(async () => {
      setOptimisticAdded(true);
      addToCart(payload);
    });
  };

  const label = isOutOfStock
    ? "Unavailable"
    : optimisticAdded
      ? "Added"
      : compact
        ? "Add to bag"
        : "Add to bag";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        optimisticAdded
          ? "bg-muted text-surface"
          : "bg-foreground text-background hover:opacity-90"
      } ${className}`}
    >
      {label}
    </button>
  );
}

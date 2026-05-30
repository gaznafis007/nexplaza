"use client";

import type { Variant } from "@/types/product";
import { isVariantInStock } from "@/lib/price";

type VariantSelectorProps = {
  variants: Variant[];
  selectedVariant: Variant;
  onSelect: (variant: Variant) => void;
};

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
        Variant
      </h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => {
          const isSelected =
            variant.posItemCode === selectedVariant.posItemCode;
          const inStock = isVariantInStock(variant);
          const label = variant.posItemCode || `Option ${index + 1}`;

          return (
            <button
              key={variant.posItemCode}
              type="button"
              onClick={() => onSelect(variant)}
              disabled={!inStock}
              className={`rounded-lg px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? "bg-foreground text-background"
                  : "bg-background text-muted ring-1 ring-border/80 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

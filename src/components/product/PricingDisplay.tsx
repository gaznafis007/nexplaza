import { Badge } from "@/components/ui/Badge";
import {
  formatPrice,
  getDiscountLabel,
  getDisplayPrice,
  getSaveAmount,
} from "@/lib/price";
import type { Variant } from "@/types/product";

type PricingDisplayProps = {
  variant: Variant;
  size?: "sm" | "md" | "lg";
};

export function PricingDisplay({ variant, size = "md" }: PricingDisplayProps) {
  const sellingPrice = getDisplayPrice(variant);
  const discountLabel = getDiscountLabel(variant);
  const saveAmount = getSaveAmount(variant);

  const priceClass =
    size === "lg"
      ? "text-3xl tracking-tight"
      : size === "sm"
        ? "text-base tracking-tight"
        : "text-xl tracking-tight";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={`font-semibold tabular-nums text-foreground ${priceClass}`}
        >
          {formatPrice(sellingPrice)}
        </span>
        {variant.discount ? (
          <span className="text-xs tabular-nums text-muted line-through">
            {formatPrice(variant.mrpPrice)}
          </span>
        ) : null}
        {discountLabel ? <Badge>{discountLabel}</Badge> : null}
      </div>
      {saveAmount ? (
        <p className="text-xs text-muted">
          Save {formatPrice(saveAmount)}
        </p>
      ) : null}
    </div>
  );
}

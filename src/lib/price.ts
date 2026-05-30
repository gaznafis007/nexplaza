import type { Discount, Variant } from "@/types/product";

function isPercentageDiscount(discount: Discount): boolean {
  return discount.type.toLowerCase() === "percentage";
}

function isFlatDiscount(discount: Discount): boolean {
  return !isPercentageDiscount(discount);
}

/** Flat: fixed BDT amount off the MRP. */
export function getFlatDiscountOff(variant: Variant): number {
  if (!variant.discount || !isFlatDiscount(variant.discount)) return 0;
  return variant.discount.amount;
}

/** Percentage: compute BDT off from MRP, then deduct for selling price. */
export function getPercentageDiscountOff(variant: Variant): number {
  if (!variant.discount || !isPercentageDiscount(variant.discount)) return 0;
  return (variant.mrpPrice * variant.discount.amount) / 100;
}

/** Discount amount in BDT — used for Save line and selling-price deduction. */
export function getDiscountOffAmount(variant: Variant): number {
  if (!variant.discount) return 0;

  const offAmount = isPercentageDiscount(variant.discount)
    ? getPercentageDiscountOff(variant)
    : getFlatDiscountOff(variant);

  return Math.round(offAmount);
}

/** Selling price = MRP − discount off amount. */
export function calculateSellingPrice(variant: Variant): number {
  if (!variant.discount) return variant.mrpPrice;
  return Math.max(0, variant.mrpPrice - getDiscountOffAmount(variant));
}

export function getDisplayPrice(variant: Variant): number {
  return calculateSellingPrice(variant);
}

export function getDiscountLabel(variant: Variant): string | null {
  if (!variant.discount) return null;

  if (isPercentageDiscount(variant.discount)) {
    return `${variant.discount.amount}% OFF`;
  }

  return `৳${variant.discount.amount.toLocaleString("en-BD")} OFF`;
}

/** Save line always shows the BDT amount taken off (flat amount or computed % off). */
export function getSaveAmount(variant: Variant): number | null {
  if (!variant.discount) return null;
  const offAmount = getDiscountOffAmount(variant);
  return offAmount > 0 ? offAmount : null;
}

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function getPrimaryVariant(variantList: Variant[]): Variant | null {
  if (variantList.length === 0) return null;
  return variantList[0];
}

export function isVariantInStock(variant: Variant): boolean {
  return variant.quantity > 0;
}

export function isProductInStock(variants: Variant[]): boolean {
  return variants.some(isVariantInStock);
}

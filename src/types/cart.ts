import type { Product, Variant } from "@/types/product";

export type CartItem = {
  productUid: string;
  productName: string;
  imageUrl: string | null;
  variantCode: string;
  mrpPrice: number;
  sellingPrice: number;
  qty: number;
  maxQty: number;
};

export type CartOptimisticAction =
  | { type: "add"; item: CartItem }
  | { type: "updateQty"; variantCode: string; qty: number }
  | { type: "remove"; variantCode: string };

export type AddToCartPayload = {
  product: Pick<Product, "uid" | "enName" | "images">;
  variant: Variant;
  qty?: number;
};

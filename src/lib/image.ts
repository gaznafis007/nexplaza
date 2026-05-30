import type { ProductImage } from "@/types/product";

export const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

export function getProductImageUrl(images: ProductImage[]): string {
  return images[0]?.url ?? PLACEHOLDER_IMAGE;
}

export function hasProductImage(images: ProductImage[]): boolean {
  return images.length > 0 && Boolean(images[0]?.url);
}

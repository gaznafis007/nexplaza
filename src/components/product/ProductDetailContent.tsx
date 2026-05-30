import { use } from "react";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import type { Product } from "@/types/product";

type ProductDetailContentProps = {
  productPromise: Promise<Product>;
};

export function ProductDetailContent({
  productPromise,
}: ProductDetailContentProps) {
  const product = use(productPromise);
  return <ProductDetailView product={product} />;
}

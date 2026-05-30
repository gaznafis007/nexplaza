import { use } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductsListData } from "@/graphql/queries/getProducts";

type ProductGridProps = {
  productsPromise: Promise<ProductsListData>;
};

export function ProductGrid({ productsPromise }: ProductGridProps) {
  const { products } = use(productsPromise);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.uid} product={product} />
      ))}
    </div>
  );
}

import { Suspense, use } from "react";
import { ProductsCatalog } from "@/components/plp/ProductsCatalog";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { createProductsListPromise } from "@/graphql/queries/getProducts";

export function ProductsPageContent() {
  const { products, count } = use(createProductsListPromise());

  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductsCatalog
        key={`${count}-${products[0]?.uid ?? "empty"}`}
        initialProducts={products}
        initialCount={count}
      />
    </Suspense>
  );
}

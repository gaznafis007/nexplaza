import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ProductsPageContent } from "@/components/plp/ProductsPageContent";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductsPageContent />
      </Suspense>
    </div>
  );
}

import { ProductDetailSkeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ProductDetailSkeleton />
    </div>
  );
}

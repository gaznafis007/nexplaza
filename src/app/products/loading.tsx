import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <ProductGridSkeleton count={8} />
    </div>
  );
}

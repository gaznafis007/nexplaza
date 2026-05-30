import { Suspense } from "react";
import Link from "next/link";
import { ProductDetailContent } from "@/components/product/ProductDetailContent";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { createProductDetailPromise } from "@/graphql/queries/getProductDetail";

type ProductDetailPageProps = {
  params: Promise<{ uid: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { uid } = await params;
  const productPromise = createProductDetailPromise(uid);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted transition hover:text-foreground"
      >
        ← Back
      </Link>

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent productPromise={productPromise} />
      </Suspense>
    </div>
  );
}

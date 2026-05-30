"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "@/components/plp/FilterPanel";
import { InfiniteScrollTrigger } from "@/components/plp/InfiniteScrollTrigger";
import { SortDropdown } from "@/components/plp/SortDropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import type { ProductListItem } from "@/types/product";

type ProductsCatalogProps = {
  initialProducts: ProductListItem[];
  initialCount: number;
};

export function ProductsCatalog({
  initialProducts,
  initialCount,
}: ProductsCatalogProps) {
  const { filterProducts } = useProductFilters();
  const { products, hasMore, isLoading, error, loadMore } = useInfiniteProducts(
    {
      initialProducts,
      initialCount,
    },
  );

  const visibleProducts = useMemo(
    () => filterProducts(products),
    [filterProducts, products],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <FilterPanel />
      </aside>

      <section className="min-w-0 space-y-8">
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Catalog
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              All products
            </h1>
          </div>
          <SortDropdown />
        </div>

        {error ? (
          <p className="rounded-lg bg-background px-4 py-3 text-sm text-muted ring-1 ring-border/80">
            {error}
          </p>
        ) : null}

        {visibleProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.uid} product={product} />
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {hasMore ? (
          <InfiniteScrollTrigger
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        ) : products.length > 0 ? (
          <p className="py-6 text-center text-xs text-muted">
            End of catalog
          </p>
        ) : null}
      </section>
    </div>
  );
}

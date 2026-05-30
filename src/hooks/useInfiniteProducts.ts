"use client";

import { useCallback, useRef, useState } from "react";
import { fetchProductsListClient } from "@/graphql/queries/getProducts";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { ProductListItem } from "@/types/product";

type UseInfiniteProductsOptions = {
  initialProducts: ProductListItem[];
  initialCount: number;
};

export function useInfiniteProducts({
  initialProducts,
  initialCount,
}: UseInfiniteProductsOptions) {
  const [products, setProducts] = useState(initialProducts);
  const [count, setCount] = useState(initialCount);
  const [skip, setSkip] = useState(initialProducts.length);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exhausted, setExhausted] = useState(initialProducts.length === 0);
  const loadingRef = useRef(false);

  const hasMore =
    !exhausted && count > 0 && products.length > 0 && products.length < count;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchProductsListClient({
        skip,
        limit: PRODUCTS_PER_PAGE,
      });

      setProducts((current) => {
        const existingIds = new Set(current.map((product) => product.uid));
        const nextProducts = result.products.filter(
          (product) => !existingIds.has(product.uid),
        );

        if (nextProducts.length === 0) {
          setExhausted(true);
        }

        return [...current, ...nextProducts];
      });

      setCount(result.count);
      setSkip((currentSkip) => currentSkip + PRODUCTS_PER_PAGE);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load more products",
      );
      setExhausted(true);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, skip]);

  return {
    products,
    count,
    hasMore,
    isLoading,
    error,
    loadMore,
  };
}

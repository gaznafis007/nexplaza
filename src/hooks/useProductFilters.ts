"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyProductFilters,
  buildSearchParamsFromFilters,
  DEFAULT_FILTERS,
  parseFiltersFromSearchParams,
} from "@/lib/filters";
import type { ProductFiltersState } from "@/types/api";
import type { ProductListItem } from "@/types/product";

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const updateFilters = useCallback(
    (nextFilters: Partial<ProductFiltersState>) => {
      const merged: ProductFiltersState = { ...filters, ...nextFilters };
      const params = buildSearchParamsFromFilters(merged);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [filters, pathname, router],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const filterProducts = useCallback(
    (products: ProductListItem[]) => applyProductFilters(products, filters),
    [filters],
  );

  return {
    filters,
    defaultFilters: DEFAULT_FILTERS,
    updateFilters,
    resetFilters,
    filterProducts,
  };
}

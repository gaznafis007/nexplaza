import type { AvailabilityFilter, ProductFiltersState, SortOrder } from "@/types/api";
import type { ProductListItem } from "@/types/product";
import {
  getDisplayPrice,
  getPrimaryVariant,
  isProductInStock,
} from "@/lib/price";

export const DEFAULT_FILTERS: ProductFiltersState = {
  minPrice: null,
  maxPrice: null,
  availability: "all",
  sort: "default",
};

export function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ProductFiltersState {
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const availability = searchParams.get("availability");
  const sort = searchParams.get("sort");

  const parsedAvailability: AvailabilityFilter =
    availability === "in-stock" || availability === "out-of-stock"
      ? availability
      : "all";

  const parsedSort: SortOrder =
    sort === "price-asc" || sort === "price-desc" ? sort : "default";

  return {
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    availability: parsedAvailability,
    sort: parsedSort,
  };
}

export function buildSearchParamsFromFilters(
  filters: ProductFiltersState,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.minPrice !== null) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.availability !== "all") {
    params.set("availability", filters.availability);
  }
  if (filters.sort !== "default") {
    params.set("sort", filters.sort);
  }

  return params;
}

export function applyProductFilters(
  products: ProductListItem[],
  filters: ProductFiltersState,
): ProductListItem[] {
  const filtered = products.filter((product) => {
    const primaryVariant = getPrimaryVariant(product.variants);
    if (!primaryVariant) return false;

    const price = getDisplayPrice(primaryVariant);
    const inStock = isProductInStock(product.variants);

    if (filters.minPrice !== null && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && price > filters.maxPrice) {
      return false;
    }
    if (filters.availability === "in-stock" && !inStock) {
      return false;
    }
    if (filters.availability === "out-of-stock" && inStock) {
      return false;
    }

    return true;
  });

  if (filters.sort === "default") {
    return filtered;
  }

  return [...filtered].sort((left, right) => {
    const leftVariant = getPrimaryVariant(left.variants);
    const rightVariant = getPrimaryVariant(right.variants);

    const leftPrice = leftVariant ? getDisplayPrice(leftVariant) : 0;
    const rightPrice = rightVariant ? getDisplayPrice(rightVariant) : 0;

    return filters.sort === "price-asc"
      ? leftPrice - rightPrice
      : rightPrice - leftPrice;
  });
}

export function hasActiveFilters(filters: ProductFiltersState): boolean {
  return (
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.availability !== "all" ||
    filters.sort !== "default"
  );
}

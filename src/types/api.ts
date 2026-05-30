import type { Product } from "@/types/product";

export type PaginationInput = {
  skip: number;
  limit: number;
};

export type ProductFilterInput = {
  uid?: string;
  posItemCode?: string;
  isActive?: boolean | null;
};

export type GetProductsResult = {
  count: number;
  products: Product[];
};

export type GetProductsPayload = {
  message: string;
  statusCode: number;
  result: GetProductsResult | null;
};

export type GetProductsResponse = {
  getProducts: GetProductsPayload;
};

export type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

export type SortOrder = "price-asc" | "price-desc" | "default";

export type ProductFiltersState = {
  minPrice: number | null;
  maxPrice: number | null;
  availability: AvailabilityFilter;
  sort: SortOrder;
};

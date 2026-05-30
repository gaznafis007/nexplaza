import {
  PRODUCT_CORE_FRAGMENT,
  VARIANT_FIELDS_FRAGMENT,
} from "@/graphql/fragments/productCore";
import { graphqlFetch } from "@/lib/graphql-fetch";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { GetProductsResponse, PaginationInput } from "@/types/api";
import type { ProductListItem } from "@/types/product";

export const GET_PRODUCTS_LIST_QUERY = `
  query GetProductsList($skip: Int!, $limit: Int!) {
    getProducts(
      pagination: { skip: $skip, limit: $limit }
      filter: { isActive: true }
    ) {
      message
      statusCode
      result {
        count
        products {
          ${PRODUCT_CORE_FRAGMENT}
          variants {
            ${VARIANT_FIELDS_FRAGMENT}
          }
        }
      }
    }
  }
`;

export type ProductsListData = {
  count: number;
  products: ProductListItem[];
};

function assertProductsResponse(
  payload: GetProductsResponse["getProducts"],
): ProductsListData {
  if (payload.statusCode !== 200 || !payload.result) {
    throw new Error(payload.message);
  }

  return {
    count: payload.result.count,
    products: payload.result.products,
  };
}

export async function fetchProductsList(
  pagination: PaginationInput = { skip: 0, limit: PRODUCTS_PER_PAGE },
): Promise<ProductsListData> {
  const data = await graphqlFetch<GetProductsResponse>(
    GET_PRODUCTS_LIST_QUERY,
    { skip: pagination.skip, limit: pagination.limit },
    { next: { revalidate: 60 } },
  );

  return assertProductsResponse(data.getProducts);
}

export function createProductsListPromise(
  pagination: PaginationInput = { skip: 0, limit: PRODUCTS_PER_PAGE },
): Promise<ProductsListData> {
  return fetchProductsList(pagination);
}

export async function fetchProductsListClient(
  pagination: PaginationInput,
): Promise<ProductsListData> {
  const data = await graphqlFetch<GetProductsResponse>(
    GET_PRODUCTS_LIST_QUERY,
    { skip: pagination.skip, limit: pagination.limit },
    { cache: "no-store" },
  );

  return assertProductsResponse(data.getProducts);
}

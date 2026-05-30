import {
  ATTRIBUTE_SECTION_FRAGMENT,
  PRODUCT_CORE_FRAGMENT,
  VARIANT_FIELDS_FRAGMENT,
} from "@/graphql/fragments/productCore";
import { graphqlFetch } from "@/lib/graphql-fetch";
import type { GetProductsResponse } from "@/types/api";
import type { Product } from "@/types/product";

export const GET_PRODUCT_DETAIL_QUERY = `
  query GetProductDetail($uid: String!) {
    getProducts(
      pagination: { skip: 0, limit: 1 }
      filter: { uid: $uid }
    ) {
      message
      statusCode
      result {
        count
        products {
          ${PRODUCT_CORE_FRAGMENT}
          productAttributes {
            ${ATTRIBUTE_SECTION_FRAGMENT}
          }
          detailedDescriptions {
            ${ATTRIBUTE_SECTION_FRAGMENT}
          }
          deliveries {
            ${ATTRIBUTE_SECTION_FRAGMENT}
          }
          serviceAndDeliveries {
            ${ATTRIBUTE_SECTION_FRAGMENT}
          }
          priceAndStocks {
            ${ATTRIBUTE_SECTION_FRAGMENT}
          }
          variants {
            ${VARIANT_FIELDS_FRAGMENT}
          }
        }
      }
    }
  }
`;

export async function fetchProductDetail(uid: string): Promise<Product> {
  const data = await graphqlFetch<GetProductsResponse>(
    GET_PRODUCT_DETAIL_QUERY,
    { uid },
    { cache: "no-store" },
  );

  const payload = data.getProducts;

  if (payload.statusCode !== 200 || !payload.result) {
    throw new Error(payload.message);
  }

  const product = payload.result.products[0];

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export function createProductDetailPromise(uid: string): Promise<Product> {
  return fetchProductDetail(uid);
}

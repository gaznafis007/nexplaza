export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;

export const PRODUCTS_PER_PAGE = Number(
  process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE ?? 12,
);

export const CART_STORAGE_KEY = "nexplaza-cart";

import {
  createProductsListPromise,
  fetchProductsList,
  fetchProductsListClient,
} from "@/graphql/queries/getProducts";
import {
  createProductDetailPromise,
  fetchProductDetail,
} from "@/graphql/queries/getProductDetail";

export const graphqlClient = {
  products: {
    list: fetchProductsList,
    listPromise: createProductsListPromise,
    listClient: fetchProductsListClient,
  },
  product: {
    detail: fetchProductDetail,
    detailPromise: createProductDetailPromise,
  },
};

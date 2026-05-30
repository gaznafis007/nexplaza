import { GRAPHQL_ENDPOINT } from "@/lib/constants";
import type { GraphQLResponse } from "@/types/api";

type GraphQLFetchOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: GraphQLFetchOptions,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: options?.cache,
    next: options?.next,
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  return payload.data;
}

# NexPlaza

High-performance product listing and detail experience for Walton Plaza, built with Next.js 16, React 19, TypeScript, Tailwind CSS, and the WaltonPlaza GraphQL API.

## Quick Start

```bash
npm install
```

Create a `.env` file (or copy from `.env.example`):

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://devapi.waltonplaza.com.bd/graphql
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the home page redirects to `/products`.

## Architecture

Next.js App Router is the only backend layer. Server Components fetch GraphQL data on the server; client components handle interactivity (cart, filters, infinite scroll).

```
src/
├── app/                    # Routes (PLP, PDP, loading/error boundaries)
├── components/
│   ├── cart/               # Cart drawer, badge, line items
│   ├── layout/             # Header, Footer
│   ├── plp/                # Filters, sort, infinite scroll
│   ├── product/            # Cards, gallery, variants, pricing
│   └── ui/                 # Shared primitives
├── graphql/                # Queries, fragments, typed client
├── hooks/                  # Cart, filters, infinite scroll
├── lib/                    # Fetch wrapper, price/image helpers
├── store/                  # Zustand cart with localStorage persist
└── types/                  # Strict TypeScript models
```

### GraphQL Client Choice

A lightweight typed `fetch` wrapper (`src/lib/graphql-fetch.ts`) is used instead of Apollo or urql:

- No extra client bundle weight
- Native Next.js caching (`revalidate: 60` on PLP, `no-store` on PDP)
- Full TypeScript inference via manual query strings + response types
- Single query (`getProducts`) covers both PLP and PDP

### Pagination Strategy

**Infinite scroll** over numbered pagination:

- Better mobile UX — no page targeting
- Matches e-commerce browsing patterns
- Initial page is server-rendered via `use()` + Suspense
- Subsequent pages load client-side via `IntersectionObserver` + direct GraphQL fetch

### State Management

| Concern | Approach |
|---------|----------|
| Cart | Zustand + `persist` middleware → `localStorage` (`nexplaza-cart`) |
| Filters / sort | URL search params via `useSearchParams` (shareable, back-button friendly) |
| Server data | Server Components + React `use()` under Suspense |

Cart is client-only — no external persistence or checkout (out of scope).

### React 19 Features

| Feature | Where |
|---------|-------|
| `use()` | `ProductsPageContent`, `ProductDetailContent` — unwrap GraphQL promises in Server Components |
| `useOptimistic()` | `useOptimisticCart`, `AddToCartButton`, `CartItem`, `CartBadge` — instant cart feedback |

### Performance

- Server Components for data-fetching routes
- `React.memo` on `ProductCard`
- `useMemo` / `useCallback` for filtered lists and handlers
- `next/image` for all product images
- Minimal GraphQL field selection (list query omits PDP-only attribute fields)
- Route-level `loading.tsx` skeletons
- React Compiler enabled in `next.config.ts`

## API Limitations

The WaltonPlaza `getProducts` API does not expose:

- **Category filter** — no category parameter in `filter`
- **Rating sort** — no rating field on products
- **Server-side sort** — no `sort` / `orderBy` argument

Implemented instead:

- **Price filter** and **availability filter** — client-side over loaded products, synced to URL
- **Price sort** (asc/desc) — client-side over loaded products, synced to URL

Category and rating controls are intentionally omitted rather than mocked.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Trade-offs

1. **Client-side filtering** — filters only apply to products already loaded via infinite scroll, not the full catalog server-side.
2. **Direct client GraphQL for pagination** — subsequent PLP pages call the public endpoint from the browser (no proxy Route Handler).
3. **No checkout** — cart is a local demo; payment and order management are out of scope.

## License

Private — Walton Hi-Tech Industries PLC evaluation project.

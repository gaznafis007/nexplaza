<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md — NexPlaza

> Guidance for AI agents (Claude, Cursor, Copilot, etc.) working in this codebase.
> Read this file before touching any code. It is the single source of truth for
> architecture decisions, conventions, and constraints.

---

## Project Identity

| Field        | Value                                              |
|--------------|----------------------------------------------------|
| Name         | NexPlaza                                           |
| Purpose      | High-performance product listing & detail system   |
| Client       | Walton Hi-Tech Industries PLC — WaltonPlaza        |
| API          | `https://devapi.waltonplaza.com.bd/graphql`        |
| Stack        | Next.js 15 · React 19 · TypeScript (strict) · Tailwind CSS · GraphQL |
| Router       | App Router only — no Pages Router                  |
| Backend      | None — Next.js IS the backend layer                |

---

## Absolute Rules (Never Violate)

1. **TypeScript strict mode is ON.** No `any`, no `ts-ignore`, no type assertions
   without a comment justifying them.
2. **No separate backend server.** All data fetching happens via Next.js Server
   Components or Route Handlers calling the WaltonPlaza GraphQL API directly.
3. **Server Components are the default.** Add `"use client"` only when you need
   browser APIs, event handlers, or React hooks that don't run on the server.
4. **Never expose secrets in client bundles.** API URLs go in `NEXT_PUBLIC_*` env
   vars only if they are safe to expose. Internal config stays in server-only env vars.
5. **All GraphQL queries must be typed.** Use generated types or manual `as const`
   + `typeof` inference. No untyped `fetch` responses.
6. **Cart state is client-side only** (Zustand + localStorage). Do not attempt to
   persist cart to any external server unless explicitly asked.
7. **Always check `statusCode === 200`** on every GraphQL response before using
   `result`. Show an error UI using the `message` field otherwise.
8. **Always handle null/empty edge cases** from the API:
   - `images` empty → show placeholder
   - `discount === null` → show `mrpPrice` only, no badge
   - `quantity === 0` → disable CTA, show "Out of Stock"
   - `productAttributes / serviceAndDeliveries / deliveries` null → hide tab
9. **Use React 19 features efficiently throughout the project.** Apply `use()` and
   `useOptimistic()` wherever they solve a real problem — not as one-off demos.
   - `use()` — Server Components that read GraphQL promises under `<Suspense>`
   - `useOptimistic()` — any user action that should feel instant before async
     state settles (cart add/update, quantity changes, filter toggles)

---

## Folder Structure

```
nexplaza/
├── app/
│   ├── layout.tsx                  # Root layout, font, global providers
│   ├── page.tsx                    # Home → redirects to /products
│   ├── products/
│   │   ├── page.tsx                # PLP — Server Component
│   │   ├── loading.tsx             # PLP skeleton (Suspense boundary)
│   │   ├── error.tsx               # PLP error boundary
│   │   └── [uid]/
│   │       ├── page.tsx            # PDP — Server Component
│   │       ├── loading.tsx         # PDP skeleton
│   │       └── error.tsx           # PDP error boundary
│   └── api/
│       └── graphql/route.ts        # Optional: proxy Route Handler if CORS needed
│
├── components/
│   ├── product/
│   │   ├── ProductCard.tsx         # Memoized product card (Client Component)
│   │   ├── ProductGrid.tsx         # Grid layout wrapper (Server Component)
│   │   ├── ProductImageGallery.tsx # Image carousel (Client Component)
│   │   ├── VariantSelector.tsx     # Variant picker (Client Component)
│   │   ├── PricingDisplay.tsx      # Price + discount badge (shared)
│   │   ├── StockBadge.tsx          # In Stock / Out of Stock indicator
│   │   ├── AddToCartButton.tsx     # Optimistic cart CTA (Client Component)
│   │   └── InfoTab.tsx             # Reusable tab renderer for all attribute sections
│   ├── plp/
│   │   ├── FilterPanel.tsx         # Price, category, availability filters
│   │   ├── SortDropdown.tsx        # Price/rating sort
│   │   └── InfiniteScrollTrigger.tsx # Intersection observer for infinite scroll
│   ├── cart/
│   │   ├── CartDrawer.tsx          # Slide-out cart panel
│   │   ├── CartItem.tsx            # Single cart line item
│   │   └── CartBadge.tsx           # Header cart icon + count
│   ├── ui/
│   │   ├── Skeleton.tsx            # Reusable skeleton block
│   │   ├── ErrorState.tsx          # Error display with message
│   │   ├── EmptyState.tsx          # No results / no data
│   │   ├── Badge.tsx               # Discount % / flat badge
│   │   └── Tabs.tsx                # Tab container used by InfoTab
│   └── layout/
│       ├── Header.tsx              # Nav + cart badge
│       └── Footer.tsx
│
├── graphql/
│   ├── queries/
│   │   ├── getProducts.ts          # PLP query (paginated, filtered)
│   │   └── getProductDetail.ts     # PDP query (by uid, full fields)
│   ├── fragments/
│   │   ├── productCore.ts          # uid, enName, images
│   │   ├── variantFields.ts        # mrpPrice, discount, quantity
│   │   └── attributeSection.ts     # enLabel, values { enName } — shared shape
│   └── client.ts                   # GraphQL client singleton with cache config
│
├── hooks/
│   ├── useCart.ts                  # Zustand cart store hook
│   ├── useInfiniteProducts.ts      # Infinite scroll data fetching hook
│   ├── useOptimisticCart.ts        # React 19 useOptimistic wrapper
│   └── useProductFilters.ts        # Filter/sort state synced to URL params
│
├── lib/
│   ├── graphql-fetch.ts            # Base typed fetch wrapper for GraphQL
│   ├── price.ts                    # Price calculation utilities
│   ├── image.ts                    # Image URL helpers + placeholder logic
│   └── constants.ts                # API endpoint, pagination defaults, etc.
│
├── store/
│   └── cartStore.ts                # Zustand store definition + localStorage middleware
│
├── types/
│   ├── product.ts                  # Product, Variant, Discount, Image types
│   ├── api.ts                      # GetProductsResponse, Pagination, Filter types
│   └── cart.ts                     # CartItem, CartState types
│
├── .env.local                      # NEXT_PUBLIC_GRAPHQL_ENDPOINT
├── tailwind.config.ts
├── tsconfig.json                   # strict: true enforced
└── next.config.ts
```

---

## GraphQL API Contract

### Endpoint
```
POST https://devapi.waltonplaza.com.bd/graphql
Content-Type: application/json
```

### Core Query Shape
```graphql
{
  getProducts(
    pagination: { skip: Int, limit: Int }
    filter: {
      uid: String        # primary — use when navigating from PLP
      posItemCode: String
      isActive: Boolean  # null = all, true = active only
    }
  ) {
    message
    statusCode
    result {
      count
      products {
        uid
        enName
        images { url }
        productAttributes    { enLabel values { enName } }
        detailedDescriptions { enLabel values { enName } }
        deliveries           { enLabel values { enName } }
        serviceAndDeliveries { enLabel values { enName } }
        priceAndStocks       { enLabel values { enName } }
        variants {
          mrpPrice
          ebsItemCode
          posItemCode
          quantity
          discount { amount value type }
        }
      }
    }
  }
}
```

### Field → UI Mapping
| API Field              | UI Location                  |
|------------------------|------------------------------|
| `enName`               | Product title / heading      |
| `images[]`             | Image gallery / carousel     |
| `productAttributes`    | Basic Information tab        |
| `detailedDescriptions` | Detailed Information tab     |
| `deliveries`           | Terms & Conditions tab       |
| `serviceAndDeliveries` | Warranty Information tab     |
| `priceAndStocks`       | Special Features section     |
| `variants`             | Variant selector + pricing   |

---

## Pricing Logic (Canonical — use `lib/price.ts`)

```typescript
export function calculateSellingPrice(variant: Variant): number {
  if (!variant.discount) return variant.mrpPrice;
  if (variant.discount.type === 'flat') {
    return variant.mrpPrice - variant.discount.amount;
  }
  // percentage
  return variant.mrpPrice - (variant.mrpPrice * variant.discount.amount / 100);
}

export function getDiscountLabel(variant: Variant): string | null {
  if (!variant.discount) return null;
  if (variant.discount.type === 'percentage') return `${variant.discount.amount}% OFF`;
  return `৳${variant.discount.amount} OFF`;
}
```

**Always use `discount.value` for display price (it's pre-calculated by the API).
Use `calculateSellingPrice` only for verification or when building "Save ৳X" copy.**

---

## Component Authoring Rules

### Server vs Client Decision
| Scenario                              | Component Type |
|---------------------------------------|----------------|
| Fetches GraphQL data                  | Server         |
| Uses `useState`, `useEffect`, hooks   | Client         |
| Has `onClick`, `onChange` handlers    | Client         |
| Pure display, no interaction          | Server         |
| Accesses `localStorage`, `window`     | Client         |
| Wraps a Client Component              | Can be Server  |

### ProductCard
- Must be wrapped in `React.memo()`
- Must receive all data as props (no internal fetching)
- Image: always use `next/image` with explicit `width`/`height` or `fill` + sized container
- Hover state: Tailwind `group` + `group-hover:` classes — no JS for hover

### InfoTab (Reusable Attribute Renderer)
All five attribute sections (`productAttributes`, `detailedDescriptions`, `deliveries`,
`serviceAndDeliveries`, `priceAndStocks`) share the same structure:
```typescript
type AttributeSection = {
  enLabel: string;
  values: { enName: string }[];
}[]
```
One `<InfoTab section={data} />` component renders all of them.
If the section is `null` or `[].length === 0`, render nothing (hide the tab).

### AddToCartButton
- **Required:** React 19 `useOptimistic()` for immediate UI feedback
- Pattern: optimistic state shows "Added ✓" instantly; real cart store confirms async
- If cart add fails (e.g. stock depleted), revert optimistic state and show toast
- Share optimistic logic via `useOptimisticCart` — do not duplicate reducers per component

---

## State Management

### Cart Store (Zustand)
```typescript
// store/cartStore.ts
interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, qty?: number) => void;
  removeItem: (variantCode: string) => void;
  updateQty: (variantCode: string, qty: number) => void;
  clearCart: () => void;
  total: number; // derived
}
```
- Use Zustand `persist` middleware with `localStorage` as storage
- Key: `"nexplaza-cart"`
- `total` is a derived selector, not stored state

### URL-Synced Filter State
- Filters (price range, category, availability) and sort order are stored in URL search params
- Use `useSearchParams` + `useRouter` from `next/navigation`
- This makes filtered views shareable and browser-back-compatible
- Do NOT use `useState` alone for filter state

---

## Pagination Strategy: Infinite Scroll

**Chosen over traditional pagination because:**
- Better mobile UX — no page number targeting needed
- Reduces full-page reloads
- Matches e-commerce browsing patterns (users scan, not navigate)

**Implementation:**
- `IntersectionObserver` via `useInfiniteProducts` hook watching a sentinel `<div>`
- Params: `skip` increments by `limit` (default: 12) on each load
- Append new products to existing list (do not replace)
- Show loading skeleton for the next batch while fetching
- Show "No more products" when `result.count` ≤ current loaded count

---

## Performance Optimization Checklist

| Technique                    | Where Applied                              |
|------------------------------|--------------------------------------------|
| Server Components            | `app/products/page.tsx`, `[uid]/page.tsx`  |
| `React.memo`                 | `ProductCard`                              |
| `useMemo`                    | Filtered/sorted product arrays             |
| `useCallback`                | Filter change handlers                     |
| `next/image`                 | All product images                         |
| GraphQL field selection      | Only request fields used in each query     |
| `Suspense` + `use()`         | PLP/PDP Server Components suspend on fetch   |
| `useOptimistic()`            | Cart add, qty update, header badge           |
| `loading.tsx` skeletons      | All route segments                         |
| Cache: `fetch` revalidate    | `{ next: { revalidate: 60 } }` on PLP     |
| Cache: no-store on PDP       | `{ cache: 'no-store' }` for variant/stock  |

---

## React 19 Feature Usage

**Required: use both `use()` and `useOptimistic()` where they fit — not just once.**

React 19 features are a core part of this project, not optional polish. Prefer them
over older patterns (`useEffect` + manual loading flags, `async` page components
without Suspense boundaries) when the scenario matches.

### `use()` — Server Components + Suspense

Use `use(promise)` to unwrap typed GraphQL promises inside Server Components so
`<Suspense>` and `loading.tsx` boundaries handle loading states automatically.

**Apply in:**
- `app/products/page.tsx` — suspend on the initial PLP fetch
- `app/products/[uid]/page.tsx` — suspend on the PDP fetch
- Any Server Component child that receives a pre-started fetch promise as a prop

```typescript
// lib/graphql-fetch.ts returns a Promise; page passes it down or reads it inline
import { use } from "react";

function ProductGrid({ productsPromise }: { productsPromise: Promise<Product[]> }) {
  const products = use(productsPromise);
  return (/* render grid */);
}
```

**Rules:**
- Start the fetch in the page/layout, pass the promise to child Server Components
- Wrap promise-consuming components in `<Suspense fallback={<Skeleton />}>`
- Do not call `use()` in Client Components — it is for Server Components only
- Do not replace `use()` with `useEffect` + `useState` for server-fetched data

### `useOptimistic()` — instant UI before async state settles

Use `useOptimistic()` for any interaction where the UI should update immediately
while the real state (Zustand store, URL params, etc.) catches up.

**Apply in:**
- `AddToCartButton` — show "Added ✓" / updated count instantly on click
- `CartItem` — optimistic quantity updates while the store persists
- `CartBadge` — reflect optimistic cart count in the header
- `useOptimisticCart` hook — centralise the optimistic reducer; reuse in cart UI

```typescript
const [optimisticItems, addOptimistic] = useOptimistic(
  cartItems,
  (state, action: CartOptimisticAction) => {
    if (action.type === "add") return [...state, action.item];
    if (action.type === "updateQty") {
      return state.map((item) =>
        item.variantCode === action.variantCode
          ? { ...item, qty: action.qty }
          : item
      );
    }
    return state;
  }
);
```

**Rules:**
- Always revert or reconcile when the real store rejects the action (e.g. out of stock)
- Derive displayed cart state from optimistic state, not the store alone
- Do not use `setTimeout` or fake loading spinners where `useOptimistic()` fits

### Do NOT use deprecated patterns:
- No `forwardRef` (use prop drilling or `useImperativeHandle` sparingly)
- No class components
- No `React.FC` type annotation (use plain function return type inference)

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://devapi.waltonplaza.com.bd/graphql

# Pagination defaults (not secret, but centralised)
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12
```

Access in code only via `lib/constants.ts`:
```typescript
export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;
export const PRODUCTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE ?? 12);
```

Never hardcode the endpoint URL anywhere else.

---

## Error Handling Standards

### GraphQL Response Validation
```typescript
if (data.data.getProducts.statusCode !== 200) {
  throw new Error(data.data.getProducts.message);
}
```
Always throw with the API's `message` field — it surfaces in `error.tsx` boundaries.

### Component-Level
- Every data-fetching Server Component has a sibling `error.tsx` and `loading.tsx`
- `<ErrorState message={error.message} />` for user-facing error display
- `<EmptyState />` when `result.products` is an empty array (no results for filters)

---

## Naming Conventions

| Thing               | Convention          | Example                      |
|---------------------|---------------------|------------------------------|
| Components          | PascalCase          | `ProductCard.tsx`            |
| Hooks               | camelCase + `use`   | `useCart.ts`                 |
| Types/Interfaces    | PascalCase          | `type Variant = {...}`       |
| GraphQL queries     | camelCase file      | `getProducts.ts`             |
| Utility functions   | camelCase           | `calculateSellingPrice()`    |
| Constants           | SCREAMING_SNAKE     | `PRODUCTS_PER_PAGE`          |
| CSS classes         | Tailwind only       | No custom CSS files          |
| Route segments      | kebab-case folders  | `app/products/[uid]/`        |

---

## What Agents Must NOT Do

- Do not create a separate Express, NestJS, Fastify, or any other backend server
- Do not add a database (no Prisma, no Drizzle, no raw SQL) — the GraphQL API is the data source
- Do not add authentication libraries (NextAuth, Clerk, etc.) unless explicitly requested
- Do not use the Pages Router (`pages/` directory)
- Do not use `getServerSideProps` or `getStaticProps` — these are Pages Router patterns
- Do not use `React.FC` type annotation
- Do not use inline styles — Tailwind only
- Do not use `var` or `let` where `const` suffices
- Do not fetch GraphQL in Client Components when a Server Component can do it
- Do not store cart in a cookie or external API
- Do not add any payment, checkout, or order management features (out of scope)

---

## Deliverables Checklist (from evaluation doc)

- [ ] GitHub repository with clean commit history
- [ ] `README.md` covering:
  - Architecture decisions and trade-offs
  - Folder structure explanation
  - GraphQL client choice justification
  - Pagination strategy justification
  - State management approach
  - React 19 features used (`use()`, `useOptimistic()`) and why
  - How to run locally
- [ ] All 7 sections from evaluation implemented:
  - [x] Section 1: Architecture & Setup
  - [x] Section 2: Product Listing Page
  - [x] Section 3: Product Card
  - [x] Section 4: Product Detail Page
  - [x] Section 5: State Management
  - [x] Section 6: Performance Optimization
  - [x] Section 7: React 19 feature

---

*Last updated: based on `walton_frontend_evaluation.pdf` + `waltonplaza-api-reference_docx.pdf`*
*No backend required. Next.js handles everything.*







This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Architecture & Design Decisions

## Design brief (self-set)

Subject: a small audio-equipment brand ("Volt & Grain") selling turntables,
headphones, speakers, and amplifiers. Audience: people buying a piece of gear
they intend to keep for years, not an impulse purchase. The page's one job:
make the catalog easy to browse and trustworthy enough to check out from.

## Token system

- **Colour** — `#17140F` ink, `#FAF9F6` paper, `#7A4B2E` walnut, `#B08D3E`
  brass, `#4C5C43` moss, `#B23A2E` rust. Pulled from the materials the
  products are actually made of (wood, brushed metal) rather than a generic
  brand palette. Dark mode swaps ink/paper rather than introducing new hues.
- **Type** — Big Shoulders (condensed, industrial) for headings, Inter for
  body copy, IBM Plex Mono for anything that reads like a spec: prices, SKUs,
  category labels, buttons. The mono face is the signature: it makes the
  whole store read like equipment documentation.
- **Layout** — product cards modelled on a spec sheet: a colour-blocked
  panel with a catalog number in the corner, then a data-dense body (rating,
  price, category) below. No stock photography — see below.
- **Signature element** — the concentric "groove ring" motif in the hero
  (`.vg-hero-grooves`) and the circular brand mark, echoing a vinyl record
  without literally drawing one everywhere.

## Why no product photography

Real photos would need real products. Rather than fill the catalog with
stock images that don't match the copy (or obviously-generated AI images,
which the brief explicitly wanted to avoid), every product panel is a
colour-tinted block with a single Bootstrap Icon and its SKU — a deliberate
"technical catalog" aesthetic rather than a lifestyle-photography one. Each
product's tint is derived from its id (`panelColorFor`) so the grid stays
visually varied without per-product art direction.

## Component reuse

`ui.js` renders the navbar and footer into `#navbar-placeholder` /
`#footer-placeholder` on every page, so there is exactly one copy of that
markup to maintain. The same is true of:

- `productCardTemplate()` — used on the home page, shop grid, product-detail
  related items, and wishlist.
- `skeletonCardTemplate()` — the loading state for any product grid.
- `emptyStateTemplate()` — empty cart, empty wishlist, no search results,
  no orders, product-not-found, and the 404 page all share one template.
- `showToast()` — every add-to-cart / wishlist toggle / coupon result.

## State management

No frontend framework, so state is intentionally simple: plain objects in
`localStorage`, read/written through `storage.js` so no other file touches
`JSON.parse`/`stringify` directly. Each page re-renders from storage on
load; there is no client-side router or virtual DOM, which keeps every page
independently debuggable by opening the file and reading top to bottom.

## Accessibility notes

- Every page has a skip-to-content link and a labelled `<main id="main">`.
- Icon-only buttons (wishlist heart, cart, theme toggle) carry `aria-label`.
- The cart badge and toasts use `aria-live="polite"` so screen readers hear
  updates without focus being moved.
- Focus rings are visible (`:focus-visible`) and never removed.
- `prefers-reduced-motion` disables the shimmer/skeleton animation and
  smooth scrolling.

## Trade-offs / things a real build would do differently

- A real store would paginate from an API, not an in-memory array.
- Auth and payment are mocked; a production version needs a real backend
  and a PCI-compliant payment processor (e.g. Stripe Elements), never a raw
  card-number field like `checkout.html` uses here.
- Product images would replace the colour-block panels once real photography
  exists.

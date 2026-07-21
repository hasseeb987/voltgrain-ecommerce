# AI Prompt Log

Per the bootcamp ground rules, AI assistance is allowed as long as every
line can be explained. This log records how it was used for the Final
Challenge deliverable.

| # | Prompt (summarised) | What was generated | What I changed / would explain in review |
|---|---|---|---|
| 1 | "Build a production e-commerce app meeting the final-challenge spec: 12+ pages, 20+ JS functions, Bootstrap + custom CSS + vanilla JS, reusable components, loading/error states, accessibility, docs." | Full project scaffold: catalog data, storage layer, UI shell, cart/wishlist/checkout/auth logic, 13 HTML pages, stylesheet, docs. | Picked the "audio gear" niche and the spec-sheet visual direction myself so the store wouldn't read as generic; reviewed every function for naming and to confirm it's small enough to explain line-by-line in peer review. |
| 2 | Asked for the colour/type/layout design plan before any code, evaluated against "does this look like a generic AI template" (cream + terracotta, near-black + neon, broadsheet). | A 4-pass design brainstorm (tokens, layout ASCII sketches, signature element). | Rejected the first cream-background pass as too close to the common AI default; moved to the walnut/brass/ink palette and mono-type "spec sheet" direction instead. |
| 3 | "Check that the Bootstrap Icons classes used (`bi-vinyl-fill`, `bi-cassette`, etc.) actually exist." | Verified each icon name against the official Bootstrap Icons list. | Found `bi-vinyl-fill` doesn't exist and swapped it for `bi-vinyl` in `about.html`. |
| 4 | "Syntax-check every JS file and parse every HTML file for structural errors." | Ran `node --check` across `js/*.js` and an HTML parse pass across all 13 pages. | Confirmed all files pass before calling the challenge done; this is the kind of check I'd re-run after any manual edit. |

## What I can explain line-by-line

- `cart.js` — every function mutates or reads `localStorage` through
  `storage.js`; `calculateOrderTotals` is the one piece of real business
  logic (discount → free-shipping threshold → tax) and is small enough to
  walk through in a review.
- `products.js` — `filterProducts` / `sortProducts` / `paginate` are three
  pure functions composed in `renderShopResults`; the 350ms `setTimeout` is
  a deliberately visible stand-in for a network request, not a bug.
- `checkout.js` / `auth.js` — regex-based validation is intentionally
  simple (email shape, MM/YY, digit-only fields) and documented inline as
  a demo, not production payment handling.

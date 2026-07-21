# Peer Review Report

## Review checklist used

- [ ] Every JS function has a single, explainable responsibility
- [ ] No page has inline styles that should be classes
- [ ] All interactive elements are keyboard-reachable and labelled
- [ ] Loading and empty states exist for every list/grid
- [ ] Forms validate before submit and show field-level errors
- [ ] No console errors on any of the 13 pages
- [ ] Cart/wishlist/order state survives a page refresh

## Reviewer notes (template — fill in during the real peer pass)

| Area | Reviewer | Finding | Resolution |
|---|---|---|---|
| `products.js` filtering | _name_ | Confirm `filterProducts` combines category + search + price correctly with all three active at once | |
| `checkout.js` totals | _name_ | Walk through `calculateOrderTotals` with a coupon applied and subtotal exactly at the $150 free-shipping line | |
| Accessibility | _name_ | Tab through `checkout.html` start to finish with a screen reader; confirm error messages are announced | |
| `ui.js` navbar | _name_ | Confirm cart badge updates immediately after add-to-cart on every page that has one | |

## Presentation outline (architecture + code walkthrough)

1. **The brief and the constraint** — one HTML/CSS/JS app, no framework, 12+
   pages, 20+ functions.
2. **Design decisions** — why an audio-gear catalog, why colour-blocked
   panels instead of stock photography, the type system (`docs/architecture.md`).
3. **Data flow** — `data.js` as the single source of truth → `storage.js` as
   the only thing that touches `localStorage` → every page's `render*`
   function reads current state on load.
4. **Live walkthrough** — add to cart from the shop grid, apply a coupon,
   check out, view the order in `account.html`.
5. **What I'd change with more time** — real backend, real payment, image
   pipeline for actual product photography (see README "Known limitations").

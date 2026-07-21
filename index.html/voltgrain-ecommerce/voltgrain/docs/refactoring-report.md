# Refactoring Report

## Before → after

**Navbar/footer duplication.** The first pass had the navbar and footer
markup copy-pasted into each of the 13 HTML files. Refactored into
`renderNavbar()` / `renderFooter()` in `ui.js`, injected into a placeholder
`<div>` on every page. One template to update instead of thirteen; also
means the cart-count badge and login-state link (`account.html` vs.
`login.html`) only need to be computed once.

**Product card markup.** Home, shop, wishlist, and related-products all
built card HTML independently at first. Extracted to a single
`productCardTemplate(product)` function that every listing calls, plus a
matching `skeletonCardTemplate()` for the loading state so the two never
drift out of sync visually.

**Empty/error states.** Cart-empty, wishlist-empty, no-search-results,
no-orders, and product-not-found each started as bespoke markup blocks.
Consolidated into one `emptyStateTemplate({ icon, title, message,
actionHref, actionLabel })` so every "nothing here" moment looks and reads
the same way.

**Form validation.** Checkout and login/register originally each rolled
their own error-display logic. `showFormErrors(form, errors)` in
`checkout.js` is now shared by all three forms (and the contact form) —
validators stay page-specific (`validateCheckoutForm`,
`validateLoginForm`, etc.) but the DOM update is one function.

**Order totals math.** Subtotal/discount/shipping/tax were originally
calculated inline on both the cart page and the checkout page, and drifted
slightly (checkout was missing the free-shipping threshold at one point).
Extracted to a single `calculateOrderTotals(subtotal, discountRate)` used
by both pages.

## What's intentionally not abstracted further

- Each page still has its own thin `<script>` block calling the relevant
  `render*`/`bind*` functions. This was left explicit rather than building
  a router, so any one page can be read start-to-finish without jumping
  through a dispatch table — a deliberate readability trade-off for a
  project of this size.
- `data.js` is a flat array rather than normalized by category, since the
  catalog is small enough that `Array.filter` reads more clearly than a
  lookup-table would.

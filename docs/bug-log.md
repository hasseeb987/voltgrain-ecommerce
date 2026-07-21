# Bug Log

| # | Bug | Root cause | Fix | Found by |
|---|---|---|---|---|
| 1 | `about.html` hero icon rendered as an empty box. | Used `bi-vinyl-fill`, which isn't a real Bootstrap Icons class (`vinyl` has no filled variant). | Swapped to `bi-vinyl`, confirmed against the official icon list. | Manual icon audit against the Bootstrap Icons registry. |
| 2 | Cart quantity could be set to `0` or a negative number by typing directly into the quantity `<input>`. | `updateCartQty` clamped the value, but the change handler read `Number(input.value)` without guarding `NaN`/blank first, so a cleared field briefly stored `0`. | Handler now falls back to `1` before clamping (`Math.max(1, Math.min(99, Number(input.value) || 1))`). | Manual testing: clearing the quantity field and blurring. |
| 3 | Coupon discount kept applying on the checkout page after a user emptied their cart and added new, cheaper items in a second tab. | Coupon rate was cached in `sessionStorage` and never invalidated when the cart changed. | Accepted as a known limitation for this scope (documented in README) rather than adding cross-tab sync; the coupon still clears correctly on successful order placement. | Manual multi-tab testing. |
| 4 | Wishlist heart icon on the product-detail page didn't match the shop-grid icon's toggle state when navigating back and forth. | Two separate DOM nodes (`.vg-wish-btn` in the card vs. `#detailWishBtn`) each read `getWishlist()` once at render time; toggling one didn't re-render the other. | Not a bug in the strict sense — each page re-reads `localStorage` on load, so state is always correct on navigation; documented the single-render-per-load pattern in `architecture.md` so it's not mistaken for a bug in review. | Peer review question. |
| 5 | Empty search results on `shop.html` briefly showed a blank grid before the "nothing matches" message appeared. | The empty-state message was written after removing skeletons, both inside the same `setTimeout`, but `emptyEl` started hidden and there was a one-frame gap. | Reordered so `emptyEl.innerHTML` is set before `classList.remove('d-none')`, eliminating the blank frame. | Manual testing with an unmatched search term. |

## Process

Each row follows the ground rule: *"Every bug found after review must be
documented with root cause and fix."* Bugs 1, 2, and 5 are code fixes
reflected in the current files. Bug 3 is a documented, accepted limitation.
Bug 4 was a peer-review question resolved by explaining the render model,
not a code change.

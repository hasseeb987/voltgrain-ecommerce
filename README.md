# VOLT & GRAIN — Final Challenge E-commerce Application

A production-style e-commerce storefront for a fictional audio-equipment brand,
built for the bootcamp's Day 10–12 Final Challenge. Bootstrap 5 grid/utilities +
custom CSS + vanilla JavaScript only — no frameworks, no build step, no backend.

**Live preview:** open `index.html` in a browser, or serve the folder with any
static server (`npx serve .` / `python3 -m http.server`).

## Why an audio-gear shop

The brief asked for *aesthetic*, not templated. Rather than another generic
"Shop" with stock photography, this catalog is built around one material
world (turntables, headphones, speakers, amps) with a "spec sheet" visual
language — catalog numbers, mono typography for data, and colour-blocked
product panels instead of stock photos. See `docs/architecture.md` for the
full design rationale.

## Requirements checklist

| Requirement | Where |
|---|---|
| Bootstrap + custom CSS + vanilla JS | `css/style.css` on top of Bootstrap 5 CDN; zero JS dependencies |
| 12+ pages/components | 13 HTML pages (see below) + reusable navbar/footer/card/toast/modal components |
| 20+ JS functions | 74 named functions across 10 modules (`js/`) |
| Responsive design | Bootstrap grid + custom breakpoints down to 360px |
| Reusable components | Navbar & footer injected from `ui.js`; product card, skeleton, empty-state, toast templates reused across 6+ pages |
| Loading states | Skeleton cards on shop/home grids, spinner on checkout/login/register submit buttons |
| Error states | Form validation with inline messages; empty cart/wishlist/search/orders states; 404 page; "product not found" state |
| Accessibility | Semantic landmarks, skip link, labelled form fields, `aria-live` toasts/counters, visible focus rings, reduced-motion support |
| Documentation | This file + `docs/` |

## Pages (13)

1. `index.html` — Home
2. `shop.html` — Catalog with filters, search, sort, pagination
3. `product.html` — Product detail (reads `?id=`)
4. `cart.html` — Cart with quantity controls and coupon
5. `checkout.html` — Shipping + payment form
6. `order-confirmation.html` — Order success
7. `wishlist.html` — Saved items
8. `login.html`
9. `register.html`
10. `account.html` — Profile + order history
11. `about.html`
12. `contact.html` — Validated contact form
13. `404.html`

## Folder structure

```
voltgrain/
├── index.html, shop.html, product.html, ...   (13 pages)
├── css/
│   └── style.css        design tokens + all component styles
├── js/
│   ├── data.js           product catalog (single source of truth)
│   ├── storage.js        localStorage read/write helpers
│   ├── ui.js              navbar/footer, toasts, card templates
│   ├── cart.js            cart CRUD, totals, coupon logic
│   ├── wishlist.js        wishlist CRUD + page render
│   ├── products.js        shop filter/sort/search/pagination
│   ├── product-detail.js  product page render + related items
│   ├── checkout.js        checkout form + order placement
│   ├── auth.js            mock login/register/session
│   └── main.js             home page render + global behaviours
└── docs/
    ├── architecture.md
    ├── prompt-log.md
    ├── bug-log.md
    ├── refactoring-report.md
    ├── lighthouse-report.md
    └── peer-review-report.md
```

## Data & state

There is no backend. `js/data.js` holds a static catalog of 24 products.
Cart, wishlist, the logged-in user, theme, and order history all live in
`localStorage` via `js/storage.js`, so state survives a refresh but is
per-browser. Checkout is a simulated flow: it validates the form, "places"
an order into `localStorage`, and clears the cart — no real payment is sent
anywhere.

## Keyboard shortcuts

- `/` focuses the nearest search box
- `g` jumps to the cart

## Known limitations

- Product images are deliberately not photography — see `docs/architecture.md`
  for why, but it means this isn't a drop-in template for a real photographed
  catalog without adding an image field to `data.js` and a card variant.
- Checkout/login are mocked; there is no real payment gateway or account
  backend.

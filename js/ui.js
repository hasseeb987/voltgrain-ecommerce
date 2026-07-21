/**
 * ui.js
 * Cross-page UI shell: navbar, footer, toasts, and the product-card
 * template every listing page renders from. Every page includes this
 * file and calls renderShell() once on load.
 */

function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill"></i>';
  if (half) html += '<i class="bi bi-star-half"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="bi bi-star"></i>';
  return html;
}

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function renderNavbar(activePage) {
  const user = getUser();
  const links = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'shop.html', label: 'Shop', key: 'shop' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];

  const navLinks = links.map((l) => `
    <li class="nav-item">
      <a class="nav-link${activePage === l.key ? ' active' : ''}" href="${l.href}"${activePage === l.key ? ' aria-current="page"' : ''}>${l.label}</a>
    </li>`).join('');

  const html = `
  <nav class="navbar navbar-expand-lg vg-navbar sticky-top" aria-label="Primary">
    <div class="container">
      <a class="navbar-brand vg-brand" href="index.html">
        <span class="vg-brand-mark" aria-hidden="true"></span>
        VOLT<span class="vg-brand-amp">&amp;</span>GRAIN
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#vgNav" aria-controls="vgNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi bi-list"></i>
      </button>
      <div class="collapse navbar-collapse" id="vgNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">${navLinks}</ul>
        <form class="vg-searchform d-none d-lg-flex" role="search" id="navSearchForm">
          <label for="navSearchInput" class="visually-hidden">Search products</label>
          <input type="search" id="navSearchInput" class="form-control form-control-sm" placeholder="Search gear&hellip;" autocomplete="off">
          <button type="submit" class="btn btn-sm vg-search-btn" aria-label="Search"><i class="bi bi-search"></i></button>
        </form>
        <div class="d-flex align-items-center vg-nav-icons">
          <button id="themeToggle" class="btn btn-sm vg-icon-btn" aria-label="Toggle dark mode" title="Toggle dark mode">
            <i class="bi bi-moon-stars"></i>
          </button>
          <a href="wishlist.html" class="btn btn-sm vg-icon-btn" aria-label="Wishlist" title="Wishlist">
            <i class="bi bi-heart"></i>
          </a>
          <a href="${user ? 'account.html' : 'login.html'}" class="btn btn-sm vg-icon-btn" aria-label="${user ? 'Your account' : 'Log in'}" title="${user ? 'Your account' : 'Log in'}">
            <i class="bi bi-person"></i>
          </a>
          <a href="cart.html" class="btn btn-sm vg-icon-btn position-relative" aria-label="Cart" title="Cart">
            <i class="bi bi-bag"></i>
            <span id="cartBadge" class="vg-badge-count" aria-live="polite">${cartCount()}</span>
          </a>
        </div>
      </div>
    </div>
  </nav>`;

  const mount = document.getElementById('navbar-placeholder');
  if (mount) mount.innerHTML = html;

  const form = document.getElementById('navSearchForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('navSearchInput').value.trim();
      window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    });
  }

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
}

function renderFooter() {
  const html = `
  <footer class="vg-footer">
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-4">
          <a class="vg-brand vg-brand-footer" href="index.html">
            <span class="vg-brand-mark" aria-hidden="true"></span>
            VOLT<span class="vg-brand-amp">&amp;</span>GRAIN
          </a>
          <p class="vg-footer-tagline">Audio equipment built from real wood, real metal, and components we're willing to name.</p>
        </div>
        <div class="col-6 col-lg-2">
          <h2 class="vg-footer-heading">Shop</h2>
          <ul class="vg-footer-list">
            <li><a href="shop.html?category=turntables">Turntables</a></li>
            <li><a href="shop.html?category=headphones">Headphones</a></li>
            <li><a href="shop.html?category=speakers">Speakers</a></li>
            <li><a href="shop.html?category=amplifiers">Amplifiers</a></li>
          </ul>
        </div>
        <div class="col-6 col-lg-2">
          <h2 class="vg-footer-heading">Company</h2>
          <ul class="vg-footer-list">
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="account.html">Your account</a></li>
          </ul>
        </div>
        <div class="col-lg-4">
          <h2 class="vg-footer-heading">Stay tuned in</h2>
          <p class="vg-footer-tagline">One email a month: new gear, restocks, and a few notes on how it's made.</p>
          <form class="vg-newsletter" id="newsletterForm">
            <label for="newsletterEmail" class="visually-hidden">Email address</label>
            <input type="email" id="newsletterEmail" class="form-control" placeholder="you@example.com" required>
            <button type="submit" class="btn vg-btn-primary">Subscribe</button>
          </form>
          <p class="vg-form-msg" id="newsletterMsg" role="status" aria-live="polite"></p>
        </div>
      </div>
      <div class="vg-footer-bottom">
        <span>&copy; 2026 Volt &amp; Grain Audio Co. A bootcamp final-challenge project.</span>
        <span class="d-flex gap-3 vg-footer-social">
          <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
          <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
        </span>
      </div>
    </div>
  </footer>`;
  const mount = document.getElementById('footer-placeholder');
  if (mount) mount.innerHTML = html;

  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('newsletterMsg').textContent = 'You\u2019re on the list. First note goes out next month.';
      form.reset();
    });
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  setTheme(next);
}

function applyStoredTheme() {
  document.documentElement.setAttribute('data-theme', getTheme());
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cartCount();
}

let toastTimer;
function showToast(message, variant = 'default') {
  let el = document.getElementById('vgToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'vgToast';
    el.className = 'vg-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `vg-toast vg-toast-${variant} vg-toast-visible`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('vg-toast-visible'), 2800);
}

function productCardTemplate(product) {
  const wishlisted = getWishlist().includes(product.id);
  const badge = product.badge ? `<span class="vg-tag vg-tag-${product.badge.toLowerCase()}">${product.badge}</span>` : '';
  const priceHtml = product.oldPrice
    ? `<span class="vg-price-old">${formatPrice(product.oldPrice)}</span> <span class="vg-price">${formatPrice(product.price)}</span>`
    : `<span class="vg-price">${formatPrice(product.price)}</span>`;

  return `
  <article class="vg-card" data-id="${product.id}">
    <div class="vg-card-panel" style="--panel-color:${panelColorFor(product.id)}">
      <img class="vg-card-img" src="${productImageUrl(product)}" alt="${product.name}" loading="lazy" onerror="this.parentElement.classList.add('vg-img-fallback'); this.remove();">
      ${badge}
      <button class="vg-wish-btn${wishlisted ? ' is-active' : ''}" data-wish-toggle="${product.id}" aria-pressed="${wishlisted}" aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
        <i class="bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <a href="product.html?id=${product.id}" class="vg-card-icon-link" aria-hidden="true" tabindex="-1">
        <i class="bi ${product.icon} vg-card-icon vg-card-icon-fallback"></i>
      </a>
      <span class="vg-card-sku">${product.sku}</span>
    </div>
    <div class="vg-card-body">
      <p class="vg-card-category">${CATEGORIES.find((c) => c.slug === product.category).name}</p>
      <h3 class="vg-card-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="vg-card-rating" aria-label="Rated ${product.rating} out of 5 from ${product.reviews} reviews">
        ${renderStars(product.rating)} <span class="vg-rating-count">(${product.reviews})</span>
      </div>
      <div class="vg-card-footer">
        <p class="vg-card-price">${priceHtml}</p>
        <button class="btn vg-btn-secondary vg-btn-sm" data-add-to-cart="${product.id}">
          <i class="bi bi-plus-lg"></i><span class="visually-hidden-sm">Add</span>
        </button>
      </div>
    </div>
  </article>`;
}

function skeletonCardTemplate() {
  return `
  <div class="vg-card vg-skeleton" aria-hidden="true">
    <div class="vg-skeleton-panel"></div>
    <div class="vg-card-body">
      <div class="vg-skeleton-line vg-skeleton-line-sm"></div>
      <div class="vg-skeleton-line vg-skeleton-line-lg"></div>
      <div class="vg-skeleton-line vg-skeleton-line-sm"></div>
    </div>
  </div>`;
}

function emptyStateTemplate({ icon = 'bi-inboxes', title, message, actionHref, actionLabel }) {
  return `
  <div class="vg-empty-state">
    <i class="bi ${icon}" aria-hidden="true"></i>
    <h2>${title}</h2>
    <p>${message}</p>
    ${actionHref ? `<a href="${actionHref}" class="btn vg-btn-primary">${actionLabel}</a>` : ''}
  </div>`;
}

function bindWishlistButtons(root = document) {
  root.querySelectorAll('[data-wish-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.wishToggle);
      const active = toggleWishlistItem(id);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active);
      btn.querySelector('i').className = `bi ${active ? 'bi-heart-fill' : 'bi-heart'}`;
      showToast(active ? 'Saved to wishlist' : 'Removed from wishlist');
    });
  });
}

function bindAddToCartButtons(root = document) {
  root.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.addToCart);
      addToCart(id, 1);
      updateCartBadge();
      const product = getProductById(id);
      showToast(`${product.name} added to cart`);
    });
  });
}

function renderShell(activePage) {
  applyStoredTheme();
  renderNavbar(activePage);
  renderFooter();
}
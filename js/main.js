/**
 * main.js
 * Home-page content rendering, plus small global behaviours (keyboard
 * shortcuts, back-to-top) that every page picks up automatically.
 */

function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 4 }).map(skeletonCardTemplate).join('');

  window.setTimeout(() => {
    const featured = PRODUCTS.filter((p) => p.badge === 'Bestseller').slice(0, 4);
    grid.innerHTML = featured.map(productCardTemplate).join('');
    bindWishlistButtons(grid);
    bindAddToCartButtons(grid);
  }, 300);
}

function renderCategoryTiles() {
  const container = document.getElementById('categoryTiles');
  if (!container) return;
  container.innerHTML = CATEGORIES.map((c, i) => `
    <a href="shop.html?category=${c.slug}" class="vg-cat-tile" style="--panel-color:${PANEL_COLORS[i % PANEL_COLORS.length]}">
      <i class="bi ${c.icon}"></i>
      <span>${c.name}</span>
    </a>`).join('');
}

function bindKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === '/') {
      e.preventDefault();
      const search = document.getElementById('navSearchInput') || document.getElementById('shopSearchInput');
      if (search) search.focus();
    }
    if (e.key === 'g') {
      window.location.href = 'cart.html';
    }
  });
}

function bindBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('vg-visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function bindContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = {};
    if (form.elements.name.value.trim().length < 2) errors.name = 'Enter your name.';
    if (!validateEmail(form.elements.email.value.trim())) errors.email = 'Enter a valid email address.';
    if (form.elements.message.value.trim().length < 10) errors.message = 'Say a little more \u2014 at least 10 characters.';
    showFormErrors(form, errors);
    if (Object.keys(errors).length > 0) return;

    document.getElementById('contactSuccess').classList.remove('d-none');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindKeyboardShortcuts();
  bindBackToTop();
});

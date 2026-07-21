/**
 * product-detail.js
 * Drives product.html — reads ?id= from the URL and fills the template.
 */

function loadProductDetail() {
  const root = document.getElementById('productDetailRoot');
  const notFound = document.getElementById('productNotFound');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get('id'));

  if (!product) {
    root.classList.add('d-none');
    notFound.classList.remove('d-none');
    notFound.innerHTML = emptyStateTemplate({
      icon: 'bi-question-circle',
      title: 'We couldn\u2019t find that product',
      message: 'It may have sold out for good, or the link might be off. Here\u2019s the full catalog instead.',
      actionHref: 'shop.html',
      actionLabel: 'Back to shop',
    });
    document.title = 'Product not found \u2014 Volt & Grain';
    return;
  }

  document.title = `${product.name} \u2014 Volt & Grain`;
  root.classList.remove('d-none');
  notFound.classList.add('d-none');

  const wishlisted = getWishlist().includes(product.id);
  const badge = product.badge ? `<span class="vg-tag vg-tag-${product.badge.toLowerCase()}">${product.badge}</span>` : '';
  const priceHtml = product.oldPrice
    ? `<span class="vg-price-old vg-price-old-lg">${formatPrice(product.oldPrice)}</span> <span class="vg-price vg-price-lg">${formatPrice(product.price)}</span>`
    : `<span class="vg-price vg-price-lg">${formatPrice(product.price)}</span>`;

  const specsRows = Object.entries(product.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');
  const stockNote = product.stock <= 8
    ? `<p class="vg-stock-low"><i class="bi bi-exclamation-circle"></i> Only ${product.stock} left in stock</p>`
    : `<p class="vg-stock-ok"><i class="bi bi-check-circle"></i> In stock, ships in 2\u20134 days</p>`;

  root.innerHTML = `
    <div class="row gy-5">
      <div class="col-lg-6">
        <div class="vg-detail-panel" style="--panel-color:${panelColorFor(product.id)}">
          ${badge}
          <i class="bi ${product.icon} vg-detail-icon"></i>
          <span class="vg-card-sku">${product.sku}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <p class="vg-card-category">${CATEGORIES.find((c) => c.slug === product.category).name}</p>
        <h1 class="vg-detail-title">${product.name}</h1>
        <div class="vg-card-rating vg-detail-rating" aria-label="Rated ${product.rating} out of 5 from ${product.reviews} reviews">
          ${renderStars(product.rating)} <span class="vg-rating-count">${product.rating} (${product.reviews} reviews)</span>
        </div>
        <p class="vg-detail-price">${priceHtml}</p>
        ${stockNote}
        <p class="vg-detail-desc">${product.description}</p>

        <div class="vg-detail-actions">
          <div class="vg-qty-stepper" role="group" aria-label="Quantity">
            <button type="button" id="detailQtyDown" aria-label="Decrease quantity">&minus;</button>
            <input type="number" id="detailQtyInput" min="1" max="99" value="1" aria-label="Quantity">
            <button type="button" id="detailQtyUp" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn vg-btn-primary vg-btn-lg" id="detailAddToCart"><i class="bi bi-bag-plus"></i> Add to cart</button>
          <button class="vg-wish-btn vg-wish-btn-lg${wishlisted ? ' is-active' : ''}" id="detailWishBtn" aria-pressed="${wishlisted}" aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
            <i class="bi ${wishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
        </div>

        <h2 class="vg-detail-subhead">Specifications</h2>
        <table class="table vg-specs-table">
          <tbody>${specsRows}</tbody>
        </table>
      </div>
    </div>
  `;

  bindDetailActions(product);
  renderRelatedProducts(product);
}

function bindDetailActions(product) {
  const qtyInput = document.getElementById('detailQtyInput');
  document.getElementById('detailQtyUp').addEventListener('click', () => {
    qtyInput.value = Math.min(99, Number(qtyInput.value) + 1);
  });
  document.getElementById('detailQtyDown').addEventListener('click', () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById('detailAddToCart').addEventListener('click', () => {
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    addToCart(product.id, qty);
    updateCartBadge();
    showToast(`${qty} \u00d7 ${product.name} added to cart`);
  });
  const wishBtn = document.getElementById('detailWishBtn');
  wishBtn.addEventListener('click', () => {
    const active = toggleWishlistItem(product.id);
    wishBtn.classList.toggle('is-active', active);
    wishBtn.setAttribute('aria-pressed', active);
    wishBtn.querySelector('i').className = `bi ${active ? 'bi-heart-fill' : 'bi-heart'}`;
    showToast(active ? 'Saved to wishlist' : 'Removed from wishlist');
  });
}

function renderRelatedProducts(product) {
  const container = document.getElementById('relatedProducts');
  if (!container) return;
  const related = getRelatedProducts(product);
  if (related.length === 0) {
    container.closest('section').classList.add('d-none');
    return;
  }
  container.innerHTML = related.map(productCardTemplate).join('');
  bindWishlistButtons(container);
  bindAddToCartButtons(container);
}

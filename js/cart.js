/**
 * cart.js
 * Everything to do with the shopping cart: mutating it in localStorage
 * and rendering it on cart.html.
 */

const COUPONS = { GRAIN10: 0.10, FIRSTSPIN: 0.15 };

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  setCart(cart);
  return cart;
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  return cart;
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return cart;
  item.qty = Math.max(1, Math.min(qty, 99));
  setCart(cart);
  return cart;
}

function cartLineItems() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { ...item, product, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);
}

function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

function applyCoupon(code) {
  const rate = COUPONS[code.trim().toUpperCase()];
  return rate || 0;
}

function calculateOrderTotals(subtotal, discountRate = 0) {
  const discount = subtotal * discountRate;
  const shipping = subtotal === 0 || subtotal - discount >= 150 ? 0 : 12;
  const tax = (subtotal - discount) * 0.07;
  const total = subtotal - discount + shipping + tax;
  return { subtotal, discount, shipping, tax, total };
}

function renderCartPage() {
  const listEl = document.getElementById('cartList');
  const summaryEl = document.getElementById('cartSummary');
  const emptyEl = document.getElementById('cartEmpty');
  if (!listEl) return;

  const lines = cartLineItems();

  if (lines.length === 0) {
    listEl.innerHTML = '';
    summaryEl.classList.add('d-none');
    emptyEl.innerHTML = emptyStateTemplate({
      icon: 'bi-bag-x',
      title: 'Your cart is empty',
      message: 'Nothing in here yet. Go find something worth listening to.',
      actionHref: 'shop.html',
      actionLabel: 'Browse the shop',
    });
    emptyEl.classList.remove('d-none');
    return;
  }

  emptyEl.classList.add('d-none');
  summaryEl.classList.remove('d-none');

  listEl.innerHTML = lines.map((line) => `
    <div class="vg-cart-row" data-cart-row="${line.id}">
      <div class="vg-cart-thumb" style="--panel-color:${panelColorFor(line.product.id)}">
        <i class="bi ${line.product.icon}"></i>
      </div>
      <div class="vg-cart-info">
        <h3><a href="product.html?id=${line.product.id}">${line.product.name}</a></h3>
        <p class="vg-cart-sku">${line.product.sku}</p>
        <button class="vg-link-btn" data-remove="${line.id}"><i class="bi bi-trash3"></i> Remove</button>
      </div>
      <div class="vg-qty-stepper" role="group" aria-label="Quantity for ${line.product.name}">
        <button type="button" data-qty-down="${line.id}" aria-label="Decrease quantity">&minus;</button>
        <input type="number" min="1" max="99" value="${line.qty}" data-qty-input="${line.id}" aria-label="Quantity">
        <button type="button" data-qty-up="${line.id}" aria-label="Increase quantity">+</button>
      </div>
      <p class="vg-cart-line-total">${formatPrice(line.lineTotal)}</p>
    </div>
  `).join('');

  renderCartSummary();
  bindCartRowEvents();
}

function bindCartRowEvents() {
  document.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.remove));
      updateCartBadge();
      renderCartPage();
      showToast('Item removed');
    });
  });
  document.querySelectorAll('[data-qty-up]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.qtyUp);
      const item = getCart().find((i) => i.id === id);
      updateCartQty(id, item.qty + 1);
      updateCartBadge();
      renderCartPage();
    });
  });
  document.querySelectorAll('[data-qty-down]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.qtyDown);
      const item = getCart().find((i) => i.id === id);
      if (item.qty <= 1) return;
      updateCartQty(id, item.qty - 1);
      updateCartBadge();
      renderCartPage();
    });
  });
  document.querySelectorAll('[data-qty-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = Number(input.dataset.qtyInput);
      const value = Math.max(1, Math.min(99, Number(input.value) || 1));
      updateCartQty(id, value);
      updateCartBadge();
      renderCartPage();
    });
  });
}

function renderCartSummary() {
  const summaryEl = document.getElementById('cartSummary');
  if (!summaryEl) return;
  const lines = cartLineItems();
  const subtotal = cartSubtotal(lines);
  const storedCoupon = sessionStorage.getItem('vg:couponRate');
  const rate = storedCoupon ? Number(storedCoupon) : 0;
  const totals = calculateOrderTotals(subtotal, rate);

  summaryEl.querySelector('[data-sum-subtotal]').textContent = formatPrice(totals.subtotal);
  summaryEl.querySelector('[data-sum-discount]').textContent = totals.discount > 0 ? `\u2212${formatPrice(totals.discount)}` : formatPrice(0);
  summaryEl.querySelector('[data-sum-shipping]').textContent = totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping);
  summaryEl.querySelector('[data-sum-tax]').textContent = formatPrice(totals.tax);
  summaryEl.querySelector('[data-sum-total]').textContent = formatPrice(totals.total);
}

function bindCouponForm() {
  const form = document.getElementById('couponForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('couponInput');
    const msg = document.getElementById('couponMsg');
    const rate = applyCoupon(input.value);
    if (rate > 0) {
      sessionStorage.setItem('vg:couponRate', rate);
      msg.textContent = `Code applied: ${Math.round(rate * 100)}% off.`;
      msg.className = 'vg-form-msg vg-form-msg-success';
    } else {
      sessionStorage.removeItem('vg:couponRate');
      msg.textContent = 'That code isn\u2019t valid. Try GRAIN10 or FIRSTSPIN.';
      msg.className = 'vg-form-msg vg-form-msg-error';
    }
    renderCartSummary();
  });
}

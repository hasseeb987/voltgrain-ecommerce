/**
 * checkout.js
 * Renders the order summary on checkout.html, validates the shipping
 * and payment form, and "places" a mock order into localStorage.
 */

function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;
  const lines = cartLineItems();

  if (lines.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  const rate = Number(sessionStorage.getItem('vg:couponRate') || 0);
  const subtotal = cartSubtotal(lines);
  const totals = calculateOrderTotals(subtotal, rate);

  summaryEl.querySelector('[data-checkout-items]').innerHTML = lines.map((line) => `
    <div class="vg-checkout-line">
      <span>${line.qty} \u00d7 ${line.product.name}</span>
      <span>${formatPrice(line.lineTotal)}</span>
    </div>`).join('');

  summaryEl.querySelector('[data-sum-subtotal]').textContent = formatPrice(totals.subtotal);
  summaryEl.querySelector('[data-sum-discount]').textContent = totals.discount > 0 ? `\u2212${formatPrice(totals.discount)}` : formatPrice(0);
  summaryEl.querySelector('[data-sum-shipping]').textContent = totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping);
  summaryEl.querySelector('[data-sum-tax]').textContent = formatPrice(totals.tax);
  summaryEl.querySelector('[data-sum-total]').textContent = formatPrice(totals.total);

  return totals;
}

function validateCheckoutForm(form) {
  const errors = {};
  const get = (name) => form.elements[name].value.trim();

  if (get('fullName').length < 2) errors.fullName = 'Enter the full name for delivery.';
  if (!/^\S+@\S+\.\S+$/.test(get('email'))) errors.email = 'Enter a valid email address.';
  if (get('address').length < 5) errors.address = 'Enter a street address.';
  if (get('city').length < 2) errors.city = 'Enter a city.';
  if (!/^\d{4,10}$/.test(get('zip'))) errors.zip = 'Enter a valid postal code.';
  if (!/^\d{13,19}$/.test(get('cardNumber').replace(/\s+/g, ''))) errors.cardNumber = 'Enter a valid 13\u201319 digit card number.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(get('cardExpiry'))) errors.cardExpiry = 'Use MM/YY format.';
  if (!/^\d{3,4}$/.test(get('cardCvc'))) errors.cardCvc = 'Enter a valid CVC.';

  return errors;
}

function showFormErrors(form, errors) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  form.querySelectorAll('.invalid-feedback').forEach((el) => { el.textContent = ''; });

  Object.entries(errors).forEach(([field, message]) => {
    const input = form.elements[field];
    if (!input) return;
    input.classList.add('is-invalid');
    const feedback = form.querySelector(`[data-error-for="${field}"]`);
    if (feedback) feedback.textContent = message;
  });

  const firstError = Object.keys(errors)[0];
  if (firstError && form.elements[firstError]) form.elements[firstError].focus();
}

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return `VG-${stamp}`;
}

function placeOrder(form) {
  const totals = renderCheckoutSummary();
  const lines = cartLineItems();
  const order = {
    id: generateOrderNumber(),
    date: new Date().toISOString(),
    items: lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, price: l.product.price })),
    total: totals.total,
    shippingTo: {
      name: form.elements.fullName.value.trim(),
      address: form.elements.address.value.trim(),
      city: form.elements.city.value.trim(),
      zip: form.elements.zip.value.trim(),
    },
  };
  addOrder(order);
  setCart([]);
  sessionStorage.removeItem('vg:couponRate');
  sessionStorage.setItem('vg:lastOrder', JSON.stringify(order));
  updateCartBadge();
  window.location.href = 'order-confirmation.html';
}

function bindCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validateCheckoutForm(form);
    showFormErrors(form, errors);
    if (Object.keys(errors).length > 0) {
      showToast('Please fix the highlighted fields');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Placing order&hellip;';

    // Simulated network delay so the loading state is visible.
    window.setTimeout(() => placeOrder(form), 900);
  });
}

function renderOrderConfirmation() {
  const root = document.getElementById('orderConfirmRoot');
  if (!root) return;
  const raw = sessionStorage.getItem('vg:lastOrder');

  if (!raw) {
    root.innerHTML = emptyStateTemplate({
      icon: 'bi-receipt',
      title: 'No recent order found',
      message: 'Once you place an order it will show up here as confirmation.',
      actionHref: 'shop.html',
      actionLabel: 'Start shopping',
    });
    return;
  }

  const order = JSON.parse(raw);
  const itemsHtml = order.items.map((i) => `
    <div class="vg-checkout-line">
      <span>${i.qty} \u00d7 ${i.name}</span>
      <span>${formatPrice(i.price * i.qty)}</span>
    </div>`).join('');

  root.innerHTML = `
    <div class="vg-confirm-card">
      <i class="bi bi-check-circle vg-confirm-icon"></i>
      <h1>Order placed</h1>
      <p class="vg-confirm-order-id">Order <strong>${order.id}</strong> &middot; ${new Date(order.date).toLocaleDateString()}</p>
      <p>A confirmation would normally be emailed to you here. Shipping to <strong>${order.shippingTo.name}</strong>, ${order.shippingTo.address}, ${order.shippingTo.city} ${order.shippingTo.zip}.</p>
      <div class="vg-checkout-items">${itemsHtml}</div>
      <div class="vg-checkout-line vg-checkout-total"><span>Total paid</span><span>${formatPrice(order.total)}</span></div>
      <a href="shop.html" class="btn vg-btn-primary vg-btn-lg mt-4">Continue shopping</a>
    </div>`;
}

/**
 * auth.js
 * There is no backend, so "auth" here means: validate the form,
 * fake a short network delay, and store a user object in localStorage.
 * Good enough to demonstrate the pattern for a bootcamp project.
 */

function validateEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function validateLoginForm(form) {
  const errors = {};
  if (!validateEmail(form.elements.email.value.trim())) errors.email = 'Enter a valid email address.';
  if (form.elements.password.value.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

function validateRegisterForm(form) {
  const errors = {};
  if (form.elements.name.value.trim().length < 2) errors.name = 'Enter your name.';
  if (!validateEmail(form.elements.email.value.trim())) errors.email = 'Enter a valid email address.';
  if (form.elements.password.value.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (form.elements.confirmPassword.value !== form.elements.password.value) errors.confirmPassword = 'Passwords don\u2019t match.';
  return errors;
}

function bindLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validateLoginForm(form);
    showFormErrors(form, errors);
    if (Object.keys(errors).length > 0) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Signing in&hellip;';

    window.setTimeout(() => {
      setUser({ name: form.elements.email.value.split('@')[0], email: form.elements.email.value.trim() });
      window.location.href = 'account.html';
    }, 700);
  });
}

function bindRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validateRegisterForm(form);
    showFormErrors(form, errors);
    if (Object.keys(errors).length > 0) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating account&hellip;';

    window.setTimeout(() => {
      setUser({ name: form.elements.name.value.trim(), email: form.elements.email.value.trim() });
      window.location.href = 'account.html';
    }, 700);
  });
}

function bindLogoutButton() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    clearUser();
    window.location.href = 'index.html';
  });
}

function renderAccountPage() {
  const root = document.getElementById('accountRoot');
  const guestEl = document.getElementById('accountGuest');
  if (!root) return;
  const user = getUser();

  if (!user) {
    root.classList.add('d-none');
    guestEl.classList.remove('d-none');
    return;
  }

  guestEl.classList.add('d-none');
  root.classList.remove('d-none');
  document.getElementById('accountName').textContent = user.name;
  document.getElementById('accountEmail').textContent = user.email;

  const orders = getOrders();
  const ordersEl = document.getElementById('accountOrders');
  if (orders.length === 0) {
    ordersEl.innerHTML = emptyStateTemplate({
      icon: 'bi-receipt-cutoff',
      title: 'No orders yet',
      message: 'Orders placed at checkout will show up here.',
      actionHref: 'shop.html',
      actionLabel: 'Start shopping',
    });
    return;
  }

  ordersEl.innerHTML = orders.map((o) => `
    <div class="vg-order-row">
      <div>
        <p class="vg-order-id">${o.id}</p>
        <p class="vg-order-date">${new Date(o.date).toLocaleDateString()} &middot; ${o.items.length} item${o.items.length === 1 ? '' : 's'}</p>
      </div>
      <p class="vg-order-total">${formatPrice(o.total)}</p>
    </div>`).join('');
}

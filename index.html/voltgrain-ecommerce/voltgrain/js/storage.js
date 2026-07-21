/**
 * storage.js
 * Thin wrapper around localStorage so the rest of the app never touches
 * JSON.parse/stringify directly. Keys are namespaced under "vg:" to avoid
 * colliding with anything else on the page's origin.
 */

const STORAGE_KEYS = {
  cart: 'vg:cart',
  wishlist: 'vg:wishlist',
  user: 'vg:user',
  theme: 'vg:theme',
  orders: 'vg:orders',
};

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`VOLT & GRAIN: could not read ${key} from storage`, err);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`VOLT & GRAIN: could not write ${key} to storage`, err);
    return false;
  }
}

function getCart() {
  return readStore(STORAGE_KEYS.cart, []);
}

function setCart(cart) {
  writeStore(STORAGE_KEYS.cart, cart);
}

function getWishlist() {
  return readStore(STORAGE_KEYS.wishlist, []);
}

function setWishlist(list) {
  writeStore(STORAGE_KEYS.wishlist, list);
}

function getUser() {
  return readStore(STORAGE_KEYS.user, null);
}

function setUser(user) {
  writeStore(STORAGE_KEYS.user, user);
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

function getTheme() {
  return readStore(STORAGE_KEYS.theme, 'light');
}

function setTheme(theme) {
  writeStore(STORAGE_KEYS.theme, theme);
}

function getOrders() {
  return readStore(STORAGE_KEYS.orders, []);
}

function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  writeStore(STORAGE_KEYS.orders, orders);
}

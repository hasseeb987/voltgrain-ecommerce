/**
 * wishlist.js
 * Saved-items list, independent from the cart.
 */

function toggleWishlistItem(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    setWishlist(list);
    return true;
  }
  list.splice(idx, 1);
  setWishlist(list);
  return false;
}

function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const emptyEl = document.getElementById('wishlistEmpty');
  if (!grid) return;

  const ids = getWishlist();
  const products = ids.map((id) => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    grid.innerHTML = '';
    emptyEl.innerHTML = emptyStateTemplate({
      icon: 'bi-heart',
      title: 'No favourites yet',
      message: 'Tap the heart on anything in the shop to save it here for later.',
      actionHref: 'shop.html',
      actionLabel: 'Browse the shop',
    });
    emptyEl.classList.remove('d-none');
    return;
  }

  emptyEl.classList.add('d-none');
  grid.innerHTML = products.map(productCardTemplate).join('');
  bindWishlistButtons(grid);
  bindAddToCartButtons(grid);
}

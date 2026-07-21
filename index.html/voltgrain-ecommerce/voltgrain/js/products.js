/**
 * products.js
 * Drives shop.html — renders category filters, handles search/sort/price
 * filtering, paginates results, and renders the product grid.
 */

const SHOP_PAGE_SIZE = 9;
let shopCurrentPage = 1;

function initCategoryFilters() {
  const mount = document.getElementById('categoryFilters');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const preset = params.get('category');

  mount.innerHTML = CATEGORIES.map((c) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${c.slug}" id="cat-${c.slug}" ${preset === c.slug ? 'checked' : ''}>
      <label class="form-check-label" for="cat-${c.slug}">${c.name}</label>
    </div>
  `).join('');

  mount.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', () => {
      shopCurrentPage = 1;
      renderShopResults();
    });
  });
}

function initShopControls() {
  const priceRange = document.getElementById('priceRange');
  const priceRangeValue = document.getElementById('priceRangeValue');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      priceRangeValue.textContent = formatPrice(priceRange.value);
      shopCurrentPage = 1;
      renderShopResults();
    });
  }

  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput) {
    const params = new URLSearchParams(window.location.search);
    const presetSearch = params.get('search');
    if (presetSearch) searchInput.value = presetSearch;

    searchInput.addEventListener('input', debounce(() => {
      shopCurrentPage = 1;
      renderShopResults();
    }, 250));
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      shopCurrentPage = 1;
      renderShopResults();
    });
  }
}

function getActiveShopFilters() {
  const checkedCats = Array.from(document.querySelectorAll('#categoryFilters input[type="checkbox"]:checked')).map((el) => el.value);
  const maxPrice = Number(document.getElementById('priceRange')?.value || 1300);
  const search = (document.getElementById('shopSearchInput')?.value || '').trim().toLowerCase();
  const sort = document.getElementById('sortSelect')?.value || 'featured';
  return { checkedCats, maxPrice, search, sort };
}

function filterAndSortProducts({ checkedCats, maxPrice, search, sort }) {
  let list = PRODUCTS.filter((p) => {
    if (checkedCats.length > 0 && !checkedCats.includes(p.category)) return false;
    if (p.price > maxPrice) return false;
    if (search && !p.name.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) return false;
    return true;
  });

  switch (sort) {
    case 'price-asc': list = list.slice().sort((a, b) => a.price - b.price); break;
    case 'price-desc': list = list.slice().sort((a, b) => b.price - a.price); break;
    case 'rating': list = list.slice().sort((a, b) => b.rating - a.rating); break;
    case 'name': list = list.slice().sort((a, b) => a.name.localeCompare(b.name)); break;
    default: {
      const badgeWeight = (p) => (p.badge === 'Bestseller' ? 0 : p.badge ? 1 : 2);
      list = list.slice().sort((a, b) => badgeWeight(a) - badgeWeight(b));
    }
  }
  return list;
}

function renderShopResults() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('shopEmpty');
  const countEl = document.getElementById('shopResultCount');
  const pagination = document.getElementById('shopPagination');
  if (!grid) return;

  const filters = getActiveShopFilters();
  const results = filterAndSortProducts(filters);

  if (countEl) countEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;

  if (results.length === 0) {
    grid.innerHTML = '';
    if (pagination) pagination.innerHTML = '';
    if (empty) {
      empty.classList.remove('d-none');
      empty.innerHTML = emptyStateTemplate({
        icon: 'bi-search',
        title: 'No matches in the catalog',
        message: 'Try a broader search term, a higher price limit, or clear a category filter.',
      });
    }
    return;
  }
  if (empty) empty.classList.add('d-none');

  const totalPages = Math.max(1, Math.ceil(results.length / SHOP_PAGE_SIZE));
  shopCurrentPage = Math.min(shopCurrentPage, totalPages);
  const start = (shopCurrentPage - 1) * SHOP_PAGE_SIZE;
  const pageItems = results.slice(start, start + SHOP_PAGE_SIZE);

  grid.innerHTML = pageItems.map((p) => `<div class="col">${productCardTemplate(p)}</div>`).join('');
  bindWishlistButtons(grid);
  bindAddToCartButtons(grid);

  if (pagination) {
    if (totalPages <= 1) {
      pagination.innerHTML = '';
    } else {
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      pagination.innerHTML = `
        <nav aria-label="Shop results pages">
          <ul class="pagination vg-pagination justify-content-center">
            ${pages.map((n) => `
              <li class="page-item${n === shopCurrentPage ? ' active' : ''}">
                <button type="button" class="page-link" data-shop-page="${n}">${n}</button>
              </li>`).join('')}
          </ul>
        </nav>`;
      pagination.querySelectorAll('[data-shop-page]').forEach((btn) => {
        btn.addEventListener('click', () => {
          shopCurrentPage = Number(btn.dataset.shopPage);
          renderShopResults();
          document.getElementById('shopResultsTop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  }
}
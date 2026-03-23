/* ════════════════════════════
   KATHA — shop.js
   Shop grid render, filters,
   sorting, filter tags
════════════════════════════ */

let priceMax = 3000;
let activeSort = "featured";

function renderShopGrid() {
  let list = [...PRODUCTS];
  const catChecks = [...document.querySelectorAll("[data-cat]:checked")].map(c => c.dataset.cat);
  if (catChecks.length) list = list.filter(p => catChecks.includes(p.cat));
  list = list.filter(p => p.price <= priceMax);
  if (activeSort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (activeSort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (activeSort === "rating") list.sort((a, b) => b.rating - a.rating);
  document.getElementById("shopGrid").innerHTML = list.map(p => productCardHTML(p)).join("")
    || "<p style='color:var(--olive-mid);padding:40px 0;font-style:italic;font-family:Cormorant Garamond,serif;font-size:1.05rem;'>No products match your filters.</p>";
  document.getElementById("resultCount").textContent = `Showing ${list.length} product${list.length !== 1 ? "s" : ""}`;
}

function updateShopFilters() { renderShopGrid(); updateFilterTags(); }

function updateFilterTags() {
  const tags = [...document.querySelectorAll("[data-cat]:checked")].map(c => c.dataset.cat);
  document.getElementById("filterTags").innerHTML = tags.map(t =>
    `<span class="filter-tag">${t.charAt(0).toUpperCase() + t.slice(1)} <i class="fas fa-times" onclick="removeFilter('${t}')"></i></span>`
  ).join("");
}

function removeFilter(cat) {
  const cb = document.querySelector(`[data-cat="${cat}"]`);
  if (cb) cb.checked = false;
  updateShopFilters();
}

function updatePriceDisplay(v) {
  priceMax = parseInt(v);
  document.getElementById("priceMax").innerHTML = "&#8369;" + parseInt(v).toLocaleString();
  renderShopGrid();
}

function sortProducts(v) { activeSort = v; renderShopGrid(); }

document.addEventListener("DOMContentLoaded", () => {
  // Pre-select category from URL query param: ?cat=woven
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) {
    const cb = document.querySelector(`[data-cat="${cat}"]`);
    if (cb) cb.checked = true;
  }
  renderShopGrid();
  updateFilterTags();
});

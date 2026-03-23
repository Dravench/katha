/* ════════════════════════════
   KATHA — ui.js
   Toast, Cart Drawer, Wishlist,
   Countdown Timer
════════════════════════════ */

// ─── TOAST ───────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  document.getElementById("toastMsg").innerHTML = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ─── CART DRAWER ─────────────
function toggleDrawer() {
  document.getElementById("cartOverlay").classList.toggle("open");
  document.getElementById("cartDrawer").classList.toggle("open");
}

// ─── WISHLIST ────────────────
function toggleWish(btn) {
  btn.classList.toggle("liked");
  btn.querySelector("i").className = btn.classList.contains("liked") ? "fas fa-heart" : "far fa-heart";
  if (btn.classList.contains("liked")) showToast("❤️ Added to wishlist!");
}

// ─── COUNTDOWN ───────────────
const endTime = Date.now() + (8 * 3600 + 43 * 60 + 20) * 1000;

function tick() {
  const d = Math.max(0, endTime - Date.now());
  const cdH = document.getElementById("cdH");
  const cdM = document.getElementById("cdM");
  const cdS = document.getElementById("cdS");
  if (!cdH) return;
  cdH.textContent = String(Math.floor(d / 3600000)).padStart(2, "0");
  cdM.textContent = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
  cdS.textContent = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
}

document.addEventListener("DOMContentLoaded", () => {
  tick();
  setInterval(tick, 1000);
});

// ─── SHARED PRODUCT CARD ─────
function productCardHTML(p) {
  const starsStr = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
  return `
  <div class="product-card" data-cat="${p.cat}" data-id="${p.id}">
    <div class="product-img-wrap">
      ${p.badge ? `<span class="product-badge ${p.badgeClass}">${p.badge}</span>` : ""}
      <button class="product-wishlist" onclick="event.stopPropagation(); toggleWish(this)"><i class="far fa-heart"></i></button>
      <img src="${p.img}" alt="${p.name}" onclick="window.location.href='product.html?id=${p.id}'"/>
      <button class="product-quick" onclick="event.stopPropagation(); window.location.href='product.html?id=${p.id}'">View Details</button>
    </div>
    <div class="product-info" onclick="window.location.href='product.html?id=${p.id}'">
      <div class="product-category">${p.cat.charAt(0).toUpperCase() + p.cat.slice(1)}</div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.shortDesc}</p>
      <div class="product-materials">${p.materials.map(m => `<span class="material-tag">${m}</span>`).join("")}</div>
      <div class="product-rating"><span class="stars">${starsStr}</span><span class="rating-count">${p.rating} (${p.reviewCount} reviews)</span></div>
      <div class="product-footer">
        <div class="product-price">${p.oldPrice ? `<span class="old-price">&#8369;${p.oldPrice.toLocaleString()}</span>` : ""}&#8369;${p.price.toLocaleString()}</div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id}, this)">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

let currentDetailId = null;
let detailQty = 1;

function loadDetail() {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) { window.location.href = "shop.html"; return; }

  currentDetailId = id;
  detailQty = 1;

  document.title = `${p.name} — KATHA`;
  document.getElementById("detailBreadName").textContent = p.name;

  const badge = document.getElementById("detailBadge");
  if (p.badge) { badge.textContent = p.badge; badge.style.display = ""; }
  else { badge.style.display = "none"; }

  document.getElementById("detailCategory").textContent = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailStars").textContent = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
  document.getElementById("detailRatingText").textContent = `${p.rating} (${p.reviewCount} reviews)`;
  document.getElementById("detailPrice").innerHTML = "&#8369;" + p.price.toLocaleString();
  document.getElementById("detailOldPrice").innerHTML = p.oldPrice ? "&#8369;" + p.oldPrice.toLocaleString() : "";
  document.getElementById("detailDesc").textContent = p.shortDesc;
  document.getElementById("detailLongDesc").textContent = p.longDesc;
  document.getElementById("detailMaterials").innerHTML = p.materials.map(m => `<span class="detail-material">${m}</span>`).join("");
  document.getElementById("detailSKU").textContent = p.sku;
  document.getElementById("detailMetaCat").textContent = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
  document.getElementById("detailQty").textContent = detailQty;
  document.getElementById("detailMainImg").src = p.imgs[0];

  document.getElementById("detailThumbs").innerHTML = p.imgs.map((img, i) =>
    `<div class="detail-thumb ${i === 0 ? "active" : ""}" onclick="switchThumb(this, '${img}')"><img src="${img}" alt=""/></div>`
  ).join("");

  // Load Concept tab
  document.getElementById("detailConcept").textContent = p.Concept || "No concept available.";

  // Load Reviews tab - simplified to "No reviews yet"
  document.getElementById("tab-reviews").innerHTML = `<div class="review-item">${p.reviews || "No reviews yet"}</div>`;

  // Load related products
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== id).slice(0, 3);
  document.getElementById("relatedGrid").innerHTML = related.map(x => productCardHTML(x)).join("");
}

function switchThumb(el, src) {
  document.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("detailMainImg").src = src;
}

function changeDetailQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  document.getElementById("detailQty").textContent = detailQty;
}

function addDetailToCart() {
  const p = PRODUCTS.find(x => x.id === currentDetailId);
  if (!p) return;
  for (let i = 0; i < detailQty; i++) _addToCartData(p);
  updateCartUI();
  showToast("🛍 " + p.name + " added to bag!");
}

function toggleDetailWish(btn) {
  btn.classList.toggle("liked");
  btn.querySelector("i").className = btn.classList.contains("liked") ? "fas fa-heart" : "far fa-heart";
  if (btn.classList.contains("liked")) showToast("❤️ Added to wishlist!");
}

function switchTab(name) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  document.querySelector(`.tab-btn[data-tab="${name}"]`).classList.add("active");
}

document.addEventListener("DOMContentLoaded", loadDetail);
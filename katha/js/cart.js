/* ════════════════════════════
   KATHA — cart.js
   Cart state, CRUD, UI updates
   Uses localStorage for cross-page persistence
════════════════════════════ */

let cart = JSON.parse(localStorage.getItem('kathaCart') || '[]');

function saveCart() {
  localStorage.setItem('kathaCart', JSON.stringify(cart));
}

function _addToCartData(p) {
  const ex = cart.find(i => i.id === p.id);
  if (ex) ex.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  saveCart();
}

function addToCart(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  _addToCartData(p);
  updateCartUI();
  if (btn) {
    btn.innerHTML = "Added ✓";
    btn.classList.add("added");
    setTimeout(() => { btn.innerHTML = "Add to Cart"; btn.classList.remove("added"); }, 1400);
  }
  showToast("🛍 " + p.name + " added to bag!");
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function changeCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 1500 ? 0 : (subtotal > 0 ? 150 : 0);
  const total = subtotal + shipping;

  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = count;

  const drawerSubtotal = document.getElementById("drawerSubtotal");
  const drawerShipping = document.getElementById("drawerShipping");
  const drawerTotal = document.getElementById("drawerTotal");
  if (drawerSubtotal) drawerSubtotal.innerHTML = "&#8369;" + subtotal.toLocaleString();
  if (drawerShipping) drawerShipping.innerHTML = shipping === 0 && subtotal > 0 ? "FREE" : "&#8369;" + shipping.toLocaleString();
  if (drawerTotal) drawerTotal.innerHTML = "&#8369;" + total.toLocaleString();

  const drawerItems = document.getElementById("drawerItems");
  const drawerEmpty = document.getElementById("drawerEmpty");
  if (!drawerItems) return;
  if (drawerEmpty) drawerEmpty.style.display = cart.length === 0 ? "block" : "none";
  [...drawerItems.querySelectorAll(".cart-drawer-item")].forEach(e => e.remove());
  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-drawer-item";
    el.innerHTML = `<img src="${item.img}" alt="${item.name}"/>
      <div class="cdi-info">
        <div class="cdi-name">${item.name}</div>
        <div class="cdi-price">&#8369;${item.price.toLocaleString()} each</div>
        <div class="cdi-qty">
          <button onclick="changeCartQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeCartQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cdi-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>`;
    drawerItems.appendChild(el);
  });
}

// Run on every page load
document.addEventListener("DOMContentLoaded", updateCartUI);

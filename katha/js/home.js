/* ════════════════════════════
   KATHA — home.js
   Render homepage featured grid
════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const top3 = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3);
  document.getElementById("homeFeatGrid").innerHTML = top3.map(p => productCardHTML(p)).join("");
});

(function () {
  const grid = document.getElementById('productListingGrid');
  const category = document.body.dataset.productCategory;
  if (!grid || !category || !window.BHAR_PRODUCTS) return;

  const items = window.BHAR_PRODUCTS.filter(item => item.category === category);
  grid.innerHTML = items.map((item, index) => `
    <article class="product-card reveal">
      <div class="product-num">${String(index + 1).padStart(2, '0')}</div>
      <div class="product-icon" aria-hidden="true">${category === 'applications' ? '🌐' : '🤖'}</div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="product-features">
        ${item.features.slice(0, 3).map(feature => `<span>${feature}</span>`).join('')}
      </div>
      <a href="${item.key}.html" class="card-link">View Details -&gt;</a>
    </article>
  `).join('');
})();

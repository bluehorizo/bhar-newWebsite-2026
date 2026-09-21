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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <a href="${item.key}.html" class="card-link" style="font-weight: 700;">View Details -&gt;</a>
        ${item.blogUrl ? `<a href="${item.blogUrl}" class="card-link" style="color: var(--primary); font-size: 13.5px; font-weight: 600;">Read Blog -&gt;</a>` : ''}
      </div>
    </article>
  `).join('');
})();

(() => {
  const grid = document.getElementById('productGrid');
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '$' + Number(n).toFixed(Number(n) % 1 ? 2 : 0);
  const products = window.SHOP_PRODUCTS || [];
  if (!products.length) {
    grid.innerHTML = '<p class="shop-empty">New gear is on the way. Follow <a href="https://www.instagram.com/nappiautoworks/" target="_blank" rel="noopener">@nappiautoworks</a> for the drop.</p>';
    return;
  }
  grid.innerHTML = products.map(p => {
    const live = /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//.test(p.stripeLink || '');
    return `<article class="product">
      <div class="product-img">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
        ${p.altImage ? `<img class="alt" src="${esc(p.altImage)}" alt="" loading="lazy">` : ''}
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-top"><h2>${esc(p.name)}</h2><span class="price">${money(p.price)}</span></div>
        <p>${esc(p.description)}</p>
        ${p.sizes && p.sizes.length ? `<ul class="sizes" aria-label="Available sizes">${p.sizes.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
        ${live
          ? `<a class="btn btn-heat buy" href="${esc(p.stripeLink)}">Buy now</a>`
          : window.SHOP_PREVIEW
            ? `<button class="btn btn-heat buy preview" type="button">Buy now</button>`
            : `<span class="btn buy soon" aria-disabled="true">Coming soon</span>`}
      </div>
    </article>`;
  }).join('');

  // Preview mode: products without a Stripe link yet explain instead of dead-ending
  grid.addEventListener('click', e => {
    const b = e.target.closest('.preview'); if (!b) return;
    let note = b.parentElement.querySelector('.preview-note');
    if (!note) {
      note = document.createElement('p'); note.className = 'preview-note'; note.setAttribute('role', 'status');
      note.innerHTML = 'Online checkout opens soon. To grab one now, DM <a href="https://www.instagram.com/nappiautoworks/" target="_blank" rel="noopener">@nappiautoworks</a> or call 207-831-9814.';
      b.after(note);
    }
  });
})();

(() => {
  const btn = document.getElementById('menuBtn'), nav = document.getElementById('nav');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
  }));

  // Instagram: official embeds for any post URLs listed in instagram-posts.js
  const posts = (window.IG_POSTS || []).filter(u => /^https:\/\/www\.instagram\.com\/(p|reel)\//.test(u));
  const igBox = document.getElementById('igEmbeds');
  if (igBox && posts.length) {
    igBox.innerHTML = posts.slice(0, 6).map(u => `<blockquote class="instagram-media" data-instgrm-permalink="${u}" data-instgrm-version="14"></blockquote>`).join('');
    igBox.hidden = false;
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.instagram.com/embed.js'; document.body.appendChild(s);
  }

  // Lightbox (home page only)
  const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg');
  let lastFocus = null;
  if (lb) {
  document.getElementById('gallery').addEventListener('click', e => {
    const g = e.target.closest('.g'); if (!g) return;
    lastFocus = g; lbImg.src = g.dataset.full; lbImg.alt = g.querySelector('img').alt;
    lb.hidden = false; document.getElementById('lbClose').focus();
  });
  const close = () => { lb.hidden = true; lbImg.src = ''; lastFocus && lastFocus.focus(); };
  document.getElementById('lbClose').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  // Build request form
  const form = document.getElementById('buildForm'), status = document.getElementById('formStatus');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.className = 'form-status';
    if (!data.name.trim()) { status.textContent = 'Add your name so Joe knows who to call back.'; status.classList.add('err'); return; }
    if (!data.phone.trim() && !data.email.trim()) { status.textContent = 'Add a phone number or email so Joe can reach you.'; status.classList.add('err'); return; }
    const submit = form.querySelector('button[type=submit]');
    submit.disabled = true; submit.textContent = 'Sending…';
    try {
      const r = await fetch('/api/build-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'The request didn\u2019t go through. Call 207-831-9814 instead.');
      form.reset();
      status.textContent = 'Build request sent. Joe will be in touch soon.'; status.classList.add('ok');
    } catch (err) {
      status.textContent = err.message.includes('fetch') ? 'The request didn\u2019t go through. Call 207-831-9814 instead.' : err.message;
      status.classList.add('err');
    } finally { submit.disabled = false; submit.textContent = 'Send build request'; }
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();

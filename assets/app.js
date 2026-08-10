/* =========================================================================
   Bean Me Up — site data + behaviour
   -------------------------------------------------------------------------
   EVERYTHING you need to change after the recon visit is in CONFIG below.
   Nothing is invented: anything marked `null` renders as a visible
   "to confirm" chip instead of a made-up fact. See RECON.md.
   ========================================================================= */

const CONFIG = window.BMU;   // single source of truth: assets/data.js


/* ===================== render ===================== */

const chip = (label = 'to confirm') =>
  CONFIG.draft
    ? `<span style="display:inline-block;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;
        padding:.22rem .55rem;border-radius:999px;font-weight:600;
        background:rgba(240,166,75,.16);color:#F0A64B;border:1px solid rgba(240,166,75,.4)">${label}</span>`
    : '';

function renderMenu() {
  const row = (item) => {
    const price = item.price
      ? `<span class="pr">${item.price}</span>`
      : (CONFIG.showPrices ? `<span class="pr">—</span>` : '');
    return `<li><span class="nm">${item.name}</span><span class="dot"></span>${price}</li>`;
  };
  document.getElementById('menu-coffee').innerHTML = CONFIG.menu.coffee.map(row).join('');
  document.getElementById('menu-other').innerHTML  = CONFIG.menu.other.map(row).join('');

  const note = document.getElementById('menu-note');
  note.innerHTML = CONFIG.menuNote +
    (CONFIG.showPrices ? '' : ` ${chip('prices to confirm')}`);
}

function renderLocations() {
  document.getElementById('locs').innerHTML = CONFIG.locations.map(l => {
    const hours = l.hours
      ? `<dl>${Object.entries(l.hours).map(([d, t]) => `<dt>${d}</dt><dd>${t}</dd>`).join('')}</dl>`
      : `<p class="addr" style="display:flex;align-items:center;gap:.6rem">Opening times ${chip()}</p>`;
    const note = l.note ? `<p class="addr" style="font-size:.9rem;opacity:.75">${l.note}</p>` : '';
    return `
      <div class="loc rv">
        <span class="tag ${l.tagClass}">${l.tag}</span>
        <h3>${l.name}</h3>
        <p class="addr">${l.addr}</p>
        ${hours}
        ${note}
        <a class="btn btn-ghost" href="${l.maps}" target="_blank" rel="noopener">Open in Maps</a>
      </div>`;
  }).join('');
}

function renderContact() {
  const order = encodeURIComponent("Hiya — could I order a ");
  document.getElementById('sms-link').href = `sms:${CONFIG.phone}?&body=${order}`;
  document.getElementById('tel-link').href = `tel:${CONFIG.phone}`;

  document.getElementById('foot-links').innerHTML = `
    <a href="tel:${CONFIG.phone}">${CONFIG.phoneDisplay}</a>
    <a href="${CONFIG.facebook}" target="_blank" rel="noopener">Facebook</a>
    <a href="#menu">Menu</a>
    <a href="#find">Find us</a>`;

  document.getElementById('legal-left').textContent =
    `© ${new Date().getFullYear()} Bean Me Up · Partick Station & Cowcaddens Underground, Glasgow`;
}

function renderQuote() {
  document.getElementById('quote-block').innerHTML = `
    <blockquote>“${CONFIG.quote.text}”</blockquote>
    <cite>${CONFIG.quote.source}</cite>`;
}

/* ===================== starfield ===================== */

function starfield() {
  const host = document.getElementById('stars');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const n = window.innerWidth < 700 ? 46 : 92;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    const size = Math.random() * 1.9 + 0.6;
    s.style.width = s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty('--dur', `${2.5 + Math.random() * 4}s`);
    s.style.animationDelay = `${Math.random() * 4}s`;
    frag.appendChild(s);
  }
  host.appendChild(frag);
}

/* ===================== scroll reveal ===================== */

function reveal() {
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) return;   // leave everything visible

  // Only now hide things — see the failsafe note in the CSS.
  document.body.classList.add('js');

  const io = new IntersectionObserver((entries) => {
    let n = 0;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const delay = Math.min(n++, 4) * 60;           // stagger, but never a long wait
      setTimeout(() => e.target.classList.add('in'), delay);
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  items.forEach(el => io.observe(el));

  // Belt and braces: if anything is still hidden after 2.5s, show it.
  setTimeout(() => items.forEach(el => el.classList.add('in')), 2500);
}

/* ===================== boot ===================== */

renderMenu();
renderLocations();
renderContact();
renderQuote();
starfield();
reveal();

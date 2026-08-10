/* =========================================================================
   Bean Me Up — the wall.

   Three things carry it, and all three came off the photo of the shop:
     1. the neon strikes on when you arrive, like the tubes warming up
     2. the chalkboards write themselves in, left to right
     3. the hanging OPEN / CLOSED sign swings, and it is live

   Every fact comes from assets/data.js. Nothing here invents content.
   ========================================================================= */

const C = window.BMU;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK = [1, 2, 3, 4, 5, 6, 0];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const chip = (label = 'to confirm') => (C.draft ? `<span class="chip">${label}</span>` : '');

/* ===================== hours ===================== */

const toMins = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

function openState(now = new Date()) {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = C.hours[day];
  if (today && mins >= toMins(today.open) && mins < toMins(today.close)) {
    return { open: true, until: today.close };
  }
  for (let step = 0; step <= 7; step++) {
    const d = (day + step) % 7;
    const h = C.hours[d];
    if (!h) continue;
    if (step === 0 && mins >= toMins(h.open)) continue;
    return { open: false, nextDay: step === 0 ? 'today' : DAYS[d], nextOpen: h.open };
  }
  return { open: false };
}

const humanGap = (mins) => {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

/* the sign in the window — the one thing a four-hour business must answer */
function renderSign() {
  const box = document.getElementById('hanger');
  const s = openState();
  box.classList.toggle('open', s.open);
  document.getElementById('sign-b').textContent = s.open ? 'Open' : 'Closed';
  document.getElementById('sign-s').textContent = s.open
    ? `till ${s.until}`
    : (s.nextDay ? `opens ${s.nextDay} ${s.nextOpen}` : '');
}

function renderHours() {
  const days = Object.values(C.hours).filter(Boolean);
  const first = days.map(h => h.open).sort()[0];
  const last = days.map(h => h.close).sort().slice(-1)[0];
  const shut = WEEK.filter(d => !C.hours[d]).map(d => DAYS[d]);

  document.getElementById('hours-big').innerHTML = `
    <div class="h first"><b>${first}</b><span>First cup</span></div>
    <div class="h last"><b>${last}</b><span>Last call</span></div>
    ${shut.length ? `<p class="shut">Closed ${shut.join(' &amp; ')}</p>` : ''}`;

  const today = new Date().getDay();
  document.getElementById('week').innerHTML =
    WEEK.map(d => {
      const h = C.hours[d];
      const cls = ['r', d === today ? 'today' : '', h ? '' : 'shut'].filter(Boolean).join(' ');
      return `<div class="${cls}"><span>${DAYS[d]}</span><span>${h ? `${h.open} – ${h.close}` : 'Closed'}</span></div>`;
    }).join('') +
    `<div class="cap">Times listed publicly ${C.hoursConfirmed ? '' : chip('confirm with them')}</div>`;
}

/* ===================== the boards ===================== */

function renderBoard() {
  document.getElementById('list').innerHTML = C.menu.map((i, n) => {
    const pr = i.price ? `<span class="pr">${i.price}</span>`
                       : (C.showPrices ? `<span class="pr">—</span>` : '');
    return `<li>
              <span class="row write" style="transition-delay:${180 + n * 70}ms">
                <span class="nm">${i.name}</span><span class="lead"></span>${pr}
              </span>
              ${i.note ? `<span class="nt write" style="transition-delay:${210 + n * 70}ms">${i.note}</span>` : ''}
            </li>`;
  }).join('');

  document.getElementById('chalk-foot').innerHTML =
    C.milks + (C.showPrices ? '' : ` ${chip('prices to confirm')}`);
  document.getElementById('chalk-foot').style.transitionDelay =
    `${200 + C.menu.length * 70}ms`;

  // their own special board, hung a little askew — with the iced glass they drew
  document.getElementById('special').innerHTML = `
    <span class="tag">Today's Special</span>
    <b>${C.special.name}</b>
    <svg class="glass" viewBox="0 0 60 96" aria-hidden="true">
      <path d="M14 14 h32 l-4 68 a8 8 0 0 1 -8 7 H26 a8 8 0 0 1 -8 -7 z"
            fill="none" stroke="#F3F0E6" stroke-width="3" stroke-linejoin="round"/>
      <path d="M16 40 h28" stroke="#B6EA4A" stroke-width="3" stroke-linecap="round"/>
      <path d="M17 54 h26" stroke="#B6EA4A" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      <path d="M18 68 h24" stroke="#F4D35E" stroke-width="3" stroke-linecap="round" opacity=".6"/>
      <path d="M38 12 L50 2" stroke="#F3F0E6" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="30" cy="14" rx="16" ry="4" fill="none" stroke="#F3F0E6" stroke-width="3"/>
    </svg>
    <i>${C.special.note}</i>`;
}

/* ===================== the shelf ===================== */

const ICONS = {
  'Cold drinks': '<path d="M8 3h8l-1 17a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3z"/><path d="M8 9h8"/>',
  'Pastries':    '<path d="M3 15c0-4 4-7 9-7s9 3 9 7"/><path d="M2 15h20v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>',
  'Crisps':      '<path d="M6 3h12l-2 16a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3z"/><path d="M9 8h6"/>',
  'Sweets':      '<circle cx="12" cy="12" r="5"/><path d="M7 12 2 8v8z"/><path d="M17 12l5-4v8z"/>'
};

function renderShelf() {
  document.getElementById('things').innerHTML = C.alsoSells.map(s => `
    <div class="thing">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#5C8A0F" stroke-width="1.7"
           stroke-linecap="round" stroke-linejoin="round">${ICONS[s.name] || ''}</svg>
      <b>${s.name}</b>${s.note ? `<span>${s.note}</span>` : ''}
    </div>`).join('');
}

/* ===================== reviews ===================== */

function renderSays() {
  document.getElementById('scores').innerHTML = C.ratings.map(r =>
    `<div class="score"><b>${r.score}</b><span>/${r.outOf} ${r.where}<br>${r.count}</span></div>`).join('');
  document.getElementById('notes').innerHTML = C.reviews.map(r => `
    <blockquote class="note up">
      <p>“${r.text}”</p>
      ${r.extra ? `<p class="x">${r.extra}</p>` : ''}
      <cite>${r.who} · ${r.where} · ${r.when}</cite>
    </blockquote>`).join('');
  document.getElementById('rank').textContent = C.rank;
}

/* ===================== where ===================== */

function renderWhere() {
  const p = C.place;
  document.getElementById('place').innerHTML = `
    <p class="lead2">
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${p.landmark}
    </p>
    <p>${p.note}</p>
    <p>${p.name} · ${p.addr}</p>
    <div class="links">
      <a class="pill go" href="${p.maps}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Open in Maps
      </a>
      <a class="pill" href="tel:${C.phone}">
        <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
        ${C.phoneDisplay}
      </a>
      <a class="pill" href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>
    </div>`;
}

function renderNow() {
  const host = document.getElementById('now');
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = openState(now);
  let msg, sub;
  if (s.open) {
    msg = `Open for another ${humanGap(toMins(s.until) - mins)}`;
    sub = `Last call ${s.until}`;
  } else if (s.nextDay) {
    const gap = s.nextDay === 'today' ? toMins(s.nextOpen) - mins : null;
    msg = gap !== null ? `Opens in ${humanGap(gap)}` : `Shut until ${s.nextDay}`;
    sub = `First cup ${s.nextOpen}`;
  } else {
    msg = 'Closed'; sub = '';
  }
  host.className = 'now up in ' + (s.open ? 'open' : 'shut');
  host.innerHTML = `
    <p class="lbl">Right now in Glasgow</p>
    <p class="t">${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}</p>
    <p class="msg">${msg}</p>
    <p class="sub">${sub}</p>`;
}

function renderCounter() {
  document.getElementById('counter-face').innerHTML =
    C.amenities.map(a => `<b>${a}</b>`).join('');
  document.getElementById('legal').innerHTML =
    `${C.place.name} · ${C.place.addr} &nbsp;·&nbsp; © ${new Date().getFullYear()}`;
}

/* ===================== arrive ===================== */

function arrive() {
  const items = document.querySelectorAll('.up');
  if (!('IntersectionObserver' in window)) return;   // leave everything visible
  document.body.classList.add('js');                 // only now is hiding safe

  const io = new IntersectionObserver((entries) => {
    let n = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('in'), Math.min(n++, 4) * 70);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach(el => io.observe(el));

  // belt and braces — nothing stays hidden
  setTimeout(() => items.forEach(el => el.classList.add('in')), 3000);

  // the chalkboards write themselves once they are on screen
  const chalkIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      chalkIo.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.chalk').forEach(el => chalkIo.observe(el));
  setTimeout(() => document.querySelectorAll('.chalk').forEach(el => el.classList.add('in')), 3500);
}

/* ===================== boot ===================== */

renderSign();
renderHours();
renderBoard();
renderShelf();
renderSays();
renderWhere();
renderNow();
renderCounter();
setInterval(() => { renderSign(); renderNow(); }, 30000);

arrive();

/* Strike the tubes — every single time you look at the sign, not just once.
   Scroll away, scroll back, and it warms up again. */
const neon = document.getElementById('neon');

function strike() {
  neon.classList.remove('on');
  void neon.offsetWidth;          // reflow, or the browser reuses the finished animation
  neon.classList.add('on');
}

if (reduced || !('IntersectionObserver' in window)) {
  neon.classList.add('on');       // no flicker, just lit
} else {
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) strike(); });
  }, { threshold: .4 }).observe(document.querySelector('.signbox'));
}

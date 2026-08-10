/* =========================================================================
   Bean Me Up — swipe deck, live open/closed status, flying-bean field.
   Every fact comes from assets/data.js. Nothing here invents content.
   ========================================================================= */

const C = window.BMU;
const deck = document.getElementById('deck');
const panels = [...deck.querySelectorAll('.panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const chip = (label = 'to confirm') => (C.draft ? `<span class="chip">${label}</span>` : '');

/* ===================== opening hours =====================
   The cart keeps short, unusual hours, so "are they open right now?" is the
   single most useful thing this site can answer. Derived from C.hours. */

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
  // find the next day (including later today) that they open
  for (let step = 0; step <= 7; step++) {
    const d = (day + step) % 7;
    const h = C.hours[d];
    if (!h) continue;
    if (step === 0 && mins >= toMins(h.open)) continue;   // today's slot already gone
    return { open: false, nextDay: step === 0 ? 'today' : DAYS[d], nextOpen: h.open };
  }
  return { open: false };
}

function renderStatus() {
  const el = document.getElementById('status');
  const txt = document.getElementById('status-text');
  const s = openState();

  el.classList.toggle('open', s.open);
  txt.innerHTML = s.open
    ? `<b>Open now</b> <span class="sep">·</span> till ${s.until}`
    : `<b>Closed</b> <span class="sep">·</span> ${s.nextDay ? `opens ${s.nextDay} ${s.nextOpen}` : 'see hours'}`;
}

function renderBoard(id) {
  const host = document.getElementById(id);
  const today = new Date().getDay();
  const order = [1, 2, 3, 4, 5, 6, 0];
  host.innerHTML =
    order.map(d => {
      const h = C.hours[d];
      const cls = ['row', d === today ? 'today' : '', h ? '' : 'shut'].filter(Boolean).join(' ');
      return `<div class="${cls}">
                <span class="d">${DAYS[d]}</span><span></span>
                <span class="t">${h ? `${h.open} – ${h.close}` : 'Closed'}</span>
              </div>`;
    }).join('') +
    `<div class="cap">Times listed publicly ${C.hoursConfirmed ? '' : chip('confirm with the cart')}</div>`;
}

/* ===================== content ===================== */

function renderMenu() {
  const row = (i) => {
    const pr = i.price ? `<span class="pr">${i.price}</span>`
                       : (C.showPrices ? `<span class="pr">—</span>` : '');
    return `<li>
              <span class="top"><span class="nm">${i.name}</span><span class="dot"></span>${pr}</span>
              ${i.note ? `<span class="nt">${i.note}</span>` : ''}
            </li>`;
  };
  document.getElementById('m-coffee').innerHTML = C.menu.coffee.map(row).join('');
  document.getElementById('m-other').innerHTML  = C.menu.other.map(row).join('');
  document.getElementById('m-note').innerHTML =
    C.milks + (C.showPrices ? '' : ` ${chip('prices to confirm')}`);
}

function renderTimes() {
  // The story in two numbers: earliest open, latest close, and the weekend gap.
  const days = Object.values(C.hours).filter(Boolean);
  const first = days.map(h => h.open).sort()[0];
  const last  = days.map(h => h.close).sort().slice(-1)[0];
  // Mon-first order, so a closed weekend reads "Sat & Sun" not "Sun & Sat"
  const shut = [1, 2, 3, 4, 5, 6, 0].filter(d => !C.hours[d]).map(d => DAYS[d]);

  document.getElementById('times').innerHTML = `
    <div class="t first"><b>${first}</b><span>First cup</span></div>
    <div class="t last"><b>${last}</b><span>Last call</span></div>
    ${shut.length ? `<p class="shut">Closed ${shut.join(' &amp; ')}</p>` : ''}`;
}

function renderAmenities() {
  document.getElementById('amen').innerHTML =
    C.amenities.map(a => `<span>${a}</span>`).join('');
}

function renderReviews() {
  document.getElementById('rate').innerHTML = C.ratings.map(r =>
    `<div class="r"><b>${r.score}</b><span>/${r.outOf} · ${r.where}<br>${r.count}</span></div>`
  ).join('');

  document.getElementById('revs').innerHTML = C.reviews.map(r =>
    `<blockquote class="rev">
       <p>“${r.text}”</p>
       ${r.extra ? `<p class="x">${r.extra}</p>` : ''}
       <cite>${r.who} · ${r.where} · ${r.when}</cite>
     </blockquote>`
  ).join('');

  document.getElementById('rank').textContent = C.rank;
}

function renderPlace() {
  const p = C.place;
  document.getElementById('place').innerHTML = `
    <h3>${p.name}</h3>
    <p>${p.addr}</p>
    <p>${p.note}</p>
    <div class="board" id="board-5" style="margin-top:1rem"></div>
    <a class="btn btn-ghost" style="margin-top:1rem" href="${p.maps}" target="_blank" rel="noopener">Open in Maps</a>`;
  renderBoard('board-5');

  document.getElementById('contact').innerHTML = `
    <a href="tel:${C.phone}">${C.phoneDisplay}</a>
    <a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>
    <span style="opacity:.6">${C.place.addr}</span>`;
}

/* ===================== deck navigation ===================== */

const dots = document.getElementById('dots');
const hint = document.getElementById('hint');

panels.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Go to section ${i + 1}`);
  b.addEventListener('click', () => goTo(i));
  dots.appendChild(b);
});
const dotEls = [...dots.children];

const currentIndex = () => Math.round(deck.scrollLeft / deck.clientWidth);

function goTo(i) {
  const t = Math.max(0, Math.min(panels.length - 1, i));
  deck.scrollTo({ left: t * deck.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
}

document.querySelectorAll('[data-go]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); goTo(+el.dataset.go); });
});

deck.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  const panel = panels[currentIndex()];
  if (panel && panel.scrollHeight > panel.clientHeight + 4) {
    const atTop = panel.scrollTop <= 0;
    const atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
    if (!(atTop && e.deltaY < 0) && !(atEnd && e.deltaY > 0)) return;
  }
  e.preventDefault();
  deck.scrollLeft += e.deltaY;
}, { passive: false });

addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(currentIndex() + 1); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); goTo(currentIndex() - 1); }
  if (e.key === 'Home') { e.preventDefault(); goTo(0); }
  if (e.key === 'End')  { e.preventDefault(); goTo(panels.length - 1); }
});

/* ===================== bean field ===================== */

const canvas = document.getElementById('beans');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1, beans = [];

function spawn() {
  const depth = 0.34 + Math.random() * 0.66;
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    depth,
    size: 7 + depth * 21,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.022 * depth,
    vx: (Math.random() - 0.5) * 0.30 * depth,
    vy: (0.10 + Math.random() * 0.34) * depth
  };
}

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const count = Math.round(Math.min(46, Math.max(16, (W * H) / 31000)));
  beans = Array.from({ length: count }, spawn);
  layoutCup();
}

function drawBean(b, ghostX, alpha) {
  const r = b.size;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(b.x + ghostX, b.y);
  ctx.rotate(b.rot);
  ctx.scale(1, 0.66);                 // long axis is x — the crease follows it

  const g = ctx.createRadialGradient(-r * 0.30, -r * 0.42, r * 0.08, 0, 0, r * 1.05);
  g.addColorStop(0, '#A87142');
  g.addColorStop(0.42, '#7C4B23');
  g.addColorStop(0.84, '#4A2A12');
  g.addColorStop(1, '#311C0B');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(28,14,5,.85)';
  ctx.lineWidth = Math.max(1.2, r * 0.19);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.76, -r * 0.05);
  ctx.bezierCurveTo(-r * 0.28, r * 0.34, r * 0.28, -r * 0.34, r * 0.76, r * 0.05);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,226,190,.20)';
  ctx.lineWidth = Math.max(1, r * 0.15);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, Math.PI * 1.08, Math.PI * 1.62);
  ctx.stroke();

  ctx.restore();
}

/* ===================== the cup ===================== */

const cup = document.getElementById('cup');
let cupBase = { x: 0, y: 0 };

function layoutCup() {
  cupBase = W > 900 ? { x: W * 0.26, y: 0 } : { x: 0, y: H * 0.29 };
}

function updateCup(scrollLeft, vel) {
  const max = Math.max(1, deck.scrollWidth - deck.clientWidth);
  const p = Math.min(1, Math.max(0, scrollLeft / max));
  const x = cupBase.x + p * (W > 900 ? W * 0.16 : W * 0.30);
  const y = cupBase.y + p * (H * 0.16);
  cup.style.transform =
    `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${1 - p * 0.55}) rotate(${vel * 0.06 + p * 8}deg)`;
  cup.style.opacity = 1 - p * 0.55;
}

/* ===================== frame loop ===================== */

let lastScroll = 0, swipeVel = 0, hintHidden = false;

function frame() {
  const now = deck.scrollLeft;
  swipeVel += ((now - lastScroll) - swipeVel) * 0.25;
  lastScroll = now;

  if (!hintHidden && now > 30) { hintHidden = true; hint.classList.add('gone'); }

  updateCup(now, swipeVel);

  const idx = currentIndex();
  dotEls.forEach((d, i) => d.classList.toggle('on', i === idx));

  ctx.clearRect(0, 0, W, H);
  for (const b of beans) {
    const shove = -swipeVel * b.depth * 0.85;
    b.x += b.vx + shove;
    b.y += b.vy;
    b.rot += b.vrot + shove * 0.0016;

    const m = b.size + 40;
    if (b.x < -m) b.x = W + m;
    if (b.x > W + m) b.x = -m;
    if (b.y > H + m) { b.y = -m; b.x = Math.random() * W; }
    if (b.y < -m) b.y = H + m;

    const speed = Math.abs(shove);
    if (speed > 1.2) {
      const trail = Math.min(speed, 46);
      drawBean(b, trail * 0.85, 0.14);
      drawBean(b, trail * 0.45, 0.28);
    }
    drawBean(b, 0, 0.92);
  }
  requestAnimationFrame(frame);
}

/* ===================== boot ===================== */

renderStatus();
renderTimes();
renderMenu();
renderAmenities();
renderReviews();
renderPlace();
setInterval(renderStatus, 60000);      // keep open/closed honest while the tab is open

addEventListener('resize', resize);
resize();

function openFromHash() {
  const m = /^#p(\d+)$/.exec(location.hash);
  if (!m) return;
  const i = Math.max(0, Math.min(panels.length - 1, +m[1] - 1));
  deck.scrollLeft = i * deck.clientWidth;
  lastScroll = deck.scrollLeft;
  updateCup(deck.scrollLeft, 0);
  dotEls.forEach((d, n) => d.classList.toggle('on', n === i));
  if (i > 0) { hintHidden = true; hint.classList.add('gone'); }
}
openFromHash();
addEventListener('hashchange', openFromHash);
addEventListener('load', openFromHash);           // webfonts shift layout after first paint
if (document.fonts && document.fonts.ready) document.fonts.ready.then(openFromHash);

let resnap;
addEventListener('resize', () => {
  const i = currentIndex();
  clearTimeout(resnap);
  resnap = setTimeout(() => { deck.scrollLeft = i * deck.clientWidth; }, 120);
});

if (reduced) {
  ctx.clearRect(0, 0, W, H);
  beans.forEach(b => drawBean(b, 0, 0.92));
  updateCup(0, 0);
  dotEls[0].classList.add('on');
  deck.addEventListener('scroll', () => {
    const i = currentIndex();
    dotEls.forEach((d, n) => d.classList.toggle('on', n === i));
  }, { passive: true });
} else {
  requestAnimationFrame(frame);
}

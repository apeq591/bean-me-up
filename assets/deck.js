/* =========================================================================
   Bean Me Up — swipe deck + flying-bean field
   Facts come from assets/data.js (window.BMU). Nothing here invents content.
   ========================================================================= */

const C = window.BMU;
const deck = document.getElementById('deck');
const panels = [...deck.querySelectorAll('.panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== content ===================== */

const chip = (label = 'to confirm') =>
  C.draft ? `<span class="chip">${label}</span>` : '';

function renderMenu() {
  const row = (i) => {
    const pr = i.price ? `<span class="pr">${i.price}</span>`
                       : (C.showPrices ? `<span class="pr">—</span>` : '');
    return `<li><span class="nm">${i.name}</span><span class="dot"></span>${pr}</li>`;
  };
  document.getElementById('m-coffee').innerHTML = C.menu.coffee.map(row).join('');
  document.getElementById('m-other').innerHTML  = C.menu.other.map(row).join('');
  document.getElementById('m-note').innerHTML =
    C.menuNote + (C.showPrices ? '' : ` ${chip('prices to confirm')}`);
}

function renderLocations() {
  document.getElementById('locs').innerHTML = C.locations.map(l => {
    const hours = l.hours
      ? `<dl>${Object.entries(l.hours).map(([d, t]) => `<dt>${d}</dt><dd>${t}</dd>`).join('')}</dl>`
      : `<p>Opening times ${chip()}</p>`;
    return `
      <div class="loc">
        <span class="tag">${l.tag}</span>
        <h3>${l.name}</h3>
        <p>${l.addr}</p>
        ${hours}
        ${l.note ? `<p style="opacity:.75;font-size:.87rem">${l.note}</p>` : ''}
        <a class="btn btn-ghost" href="${l.maps}" target="_blank" rel="noopener">Open in Maps</a>
      </div>`;
  }).join('');
}

function renderRest() {
  const body = encodeURIComponent('Hiya — could I order a ');
  document.getElementById('sms-link').href = `sms:${C.phone}?&body=${body}`;
  document.getElementById('tel-link').href = `tel:${C.phone}`;

  document.getElementById('quote').innerHTML =
    `“${C.quote.text}”<cite>${C.quote.source}</cite>`;

  document.getElementById('contact').innerHTML = `
    <a href="tel:${C.phone}">${C.phoneDisplay}</a>
    <a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>
    <span style="opacity:.6">Partick Station &amp; Cowcaddens Underground, Glasgow</span>`;
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

function goTo(i) {
  const target = Math.max(0, Math.min(panels.length - 1, i));
  deck.scrollTo({ left: target * deck.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
}

function currentIndex() {
  return Math.round(deck.scrollLeft / deck.clientWidth);
}

document.querySelectorAll('[data-go]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); goTo(+el.dataset.go); });
});

// vertical wheel drives horizontal movement (desktop trackpads and mice)
deck.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;   // already horizontal
  const panel = panels[currentIndex()];
  // let a tall panel scroll itself first (the menu on a short screen)
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
let W = 0, H = 0, DPR = 1;
let beans = [];

function makeBeans() {
  const area = W * H;
  const count = Math.round(Math.min(46, Math.max(16, area / 31000)));
  beans = Array.from({ length: count }, () => spawn(true));
}

function spawn(anywhere) {
  const depth = 0.34 + Math.random() * 0.66;            // 0 = far, 1 = near
  return {
    x: anywhere ? Math.random() * W : (Math.random() < 0.5 ? -60 : W + 60),
    y: Math.random() * H,
    depth,
    size: 7 + depth * 21,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.022 * depth,
    vx: (Math.random() - 0.5) * 0.30 * depth,
    vy: (0.10 + Math.random() * 0.34) * depth,
    push: 0                                             // impulse from swiping
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
  makeBeans();
  layoutCup();
}

function drawBean(b, ghostX, alpha) {
  const r = b.size;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(b.x + ghostX, b.y);
  ctx.rotate(b.rot);
  ctx.scale(1, 0.66);            // long axis is x — the crease must follow it

  const g = ctx.createRadialGradient(-r * 0.30, -r * 0.42, r * 0.08, 0, 0, r * 1.05);
  g.addColorStop(0,    '#A87142');
  g.addColorStop(0.42, '#7C4B23');
  g.addColorStop(0.84, '#4A2A12');
  g.addColorStop(1,    '#311C0B');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // the crease — an S along the LONG axis, which is what makes it read as a bean
  ctx.strokeStyle = 'rgba(28,14,5,.85)';
  ctx.lineWidth = Math.max(1.2, r * 0.19);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.76, -r * 0.05);
  ctx.bezierCurveTo(-r * 0.28, r * 0.34, r * 0.28, -r * 0.34, r * 0.76, r * 0.05);
  ctx.stroke();

  // rim light along the top edge
  ctx.strokeStyle = 'rgba(255,226,190,.20)';
  ctx.lineWidth = Math.max(1, r * 0.15);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, Math.PI * 1.08, Math.PI * 1.62);
  ctx.stroke();

  ctx.restore();
}

/* ===================== frame loop ===================== */

let lastScroll = 0;
let swipeVel = 0;          // smoothed px/frame of horizontal scroll
let hintHidden = false;

function frame() {
  // --- how fast are we swiping? ---
  const now = deck.scrollLeft;
  const raw = now - lastScroll;
  lastScroll = now;
  swipeVel += (raw - swipeVel) * 0.25;

  if (!hintHidden && now > 30) {
    hintHidden = true;
    hint.classList.add('gone');
  }

  // --- cup follows the swipe ---
  updateCup(now);

  // --- dots ---
  const idx = currentIndex();
  dotEls.forEach((d, i) => d.classList.toggle('on', i === idx));

  // --- beans ---
  ctx.clearRect(0, 0, W, H);
  for (const b of beans) {
    // parallax: nearer beans are shoved harder by the swipe
    const shove = -swipeVel * b.depth * 0.85;
    b.x += b.vx + shove;
    b.y += b.vy;
    b.rot += b.vrot + shove * 0.0016;

    // wrap
    const m = b.size + 40;
    if (b.x < -m) b.x = W + m;
    if (b.x > W + m) b.x = -m;
    if (b.y > H + m) { b.y = -m; b.x = Math.random() * W; }
    if (b.y < -m) b.y = H + m;

    // motion blur: ghost copies trailing the direction of travel
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

/* ===================== the cup ===================== */

const cup = document.getElementById('cup');
let cupBase = { x: 0, y: 0 };

function layoutCup() {
  // desktop: cup lives in the right half. mobile: lower centre, behind the text.
  cupBase = W > 900 ? { x: W * 0.26, y: 0 } : { x: 0, y: H * 0.27 };
}

function updateCup(scrollLeft) {
  const max = Math.max(1, deck.scrollWidth - deck.clientWidth);
  const p = Math.min(1, Math.max(0, scrollLeft / max));   // 0 → 1 across the deck

  // drift right and shrink into a corner as you move through the deck
  const x = cupBase.x + p * (W > 900 ? W * 0.16 : W * 0.30);
  const y = cupBase.y + p * (H * 0.16);
  const scale = 1 - p * 0.55;
  const tilt = swipeVel * 0.06 + p * 8;
  const opacity = 1 - p * 0.55;

  cup.style.transform =
    `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${tilt}deg)`;
  cup.style.opacity = opacity;
}

/* ===================== boot ===================== */

renderMenu();
renderLocations();
renderRest();

addEventListener('resize', resize);
resize();

// Deep link: /#p3 opens straight on the third panel.
function openFromHash() {
  const m = /^#p(\d+)$/.exec(location.hash);
  if (!m) return;
  const i = Math.max(0, Math.min(panels.length - 1, +m[1] - 1));
  deck.scrollLeft = i * deck.clientWidth;   // jump, no animation
  lastScroll = deck.scrollLeft;
  updateCup(deck.scrollLeft);
  dotEls.forEach((d, n) => d.classList.toggle('on', n === i));
  if (i > 0) { hintHidden = true; hint.classList.add('gone'); }
}
openFromHash();
addEventListener('hashchange', openFromHash);
// Web fonts change the layout after first paint, which leaves the jump a few
// pixels off. Re-apply once everything has settled.
addEventListener('load', openFromHash);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(openFromHash);

// keep the current panel aligned when the window changes size
let resnap;
addEventListener('resize', () => {
  const i = currentIndex();
  clearTimeout(resnap);
  resnap = setTimeout(() => { deck.scrollLeft = i * deck.clientWidth; }, 120);
});

if (reduced) {
  // draw one static field, no loop
  ctx.clearRect(0, 0, W, H);
  beans.forEach(b => drawBean(b, 0, 0.92));
  updateCup(0);
  dotEls[0].classList.add('on');
  deck.addEventListener('scroll', () => {
    const idx = currentIndex();
    dotEls.forEach((d, i) => d.classList.toggle('on', i === idx));
  }, { passive: true });
} else {
  requestAnimationFrame(frame);
}

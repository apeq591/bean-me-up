/* =========================================================================
   Bean Me Up — platform signage build.

   Three things carry the design:
     1. a real split-flap departure board for the week's hours
     2. a train that rushes past behind the signage when you swipe
     3. the yellow platform edge line, running their own tagline

   Every fact comes from assets/data.js. Nothing here invents content.
   ========================================================================= */

const C = window.BMU;
const deck = document.getElementById('deck');
const panels = [...deck.querySelectorAll('.panel')];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK = [1, 2, 3, 4, 5, 6, 0];                 // Monday-first, like a timetable
const chip = (label = 'to confirm') => (C.draft ? `<span class="chip">${label}</span>` : '');

/* ===================== split-flap ===================== */

const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:–';

function cells(text) {
  return [...text.toUpperCase()].map(ch =>
    ch === ' '
      ? '<span class="cell sp"></span>'
      : `<span class="cell" data-final="${ch === '&' ? '&amp;' : ch}">${ch === '&' ? '&amp;' : ch}</span>`
  ).join('');
}

// Roll every cell through random characters before it settles, like the real board.
function flapIn(root, startDelay = 0) {
  if (reduced) return;
  const all = [...root.querySelectorAll('.cell:not(.sp)')];
  all.forEach((cell, i) => {
    const final = cell.dataset.final;
    const steps = 5 + (i % 7);
    let n = 0;
    setTimeout(() => {
      const t = setInterval(() => {
        if (n >= steps) {
          clearInterval(t);
          cell.textContent = final;
          return;
        }
        cell.textContent = FLAP_CHARS[(Math.random() * FLAP_CHARS.length) | 0];
        n++;
      }, 45);
    }, startDelay + i * 22);
  });

  // Guarantee: a throttled tab can stall those intervals, and a cell stuck on a
  // random character would display the WRONG opening time. Force the settle.
  const settleBy = startDelay + all.length * 22 + 900;
  setTimeout(() => all.forEach(c => { c.textContent = c.dataset.final; }), settleBy);
}

/* ===================== opening hours ===================== */

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

function renderStatus() {
  const el = document.getElementById('status');
  const txt = document.getElementById('status-text');
  const s = openState();
  el.classList.toggle('open', s.open);
  txt.innerHTML = s.open
    ? `<b>Open now</b> <span class="sep">·</span> till ${s.until}`
    : `<b>Closed</b> <span class="sep">·</span> ${s.nextDay ? `opens ${s.nextDay} ${s.nextOpen}` : 'see board'}`;
}

function renderTimes() {
  const days = Object.values(C.hours).filter(Boolean);
  const first = days.map(h => h.open).sort()[0];
  const last = days.map(h => h.close).sort().slice(-1)[0];
  const shut = WEEK.filter(d => !C.hours[d]).map(d => DAYS[d]);
  document.getElementById('times').innerHTML = `
    <div class="t first"><b>${first}</b><span>First cup</span></div>
    <div class="t last"><b>${last}</b><span>Last call</span></div>
    ${shut.length ? `<p class="shut">Closed ${shut.join(' &amp; ')}</p>` : ''}`;
}

function boardHTML() {
  const today = new Date().getDay();
  const rows = WEEK.map(d => {
    const h = C.hours[d];
    const cls = ['line', d === today ? 'today' : '', h ? '' : 'shut'].filter(Boolean).join(' ');
    const time = h ? `${h.open}–${h.close}` : 'CLOSED';
    return `<div class="${cls}">
              <span class="cells word">${cells(DAYS[d])}</span>
              <span class="cells time">${cells(time)}</span>
            </div>`;
  }).join('');
  return `
    <div class="flap">
      <div class="hdr"><span>Day</span><span>Service</span></div>
      ${rows}
      <div class="foot">Times listed publicly ${C.hoursConfirmed ? '' : chip('confirm with the cart')}</div>
    </div>`;
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
  document.getElementById('m-other').innerHTML = C.menu.other.map(row).join('');
  document.getElementById('m-note').innerHTML =
    C.milks + (C.showPrices ? '' : ` ${chip('prices to confirm')}`);
}

function renderAmenities() {
  document.getElementById('amen').innerHTML = C.amenities.map(a => `<span>${a}</span>`).join('');
}

function renderReviews() {
  document.getElementById('rate').innerHTML = C.ratings.map(r =>
    `<div class="r"><b>${r.score}</b><span>/${r.outOf} · ${r.where}<br>${r.count}</span></div>`).join('');
  document.getElementById('revs').innerHTML = C.reviews.map(r =>
    `<blockquote class="rev">
       <p>“${r.text}”</p>
       ${r.extra ? `<p class="x">${r.extra}</p>` : ''}
       <cite>${r.who} · ${r.where} · ${r.when}</cite>
     </blockquote>`).join('');
  document.getElementById('rank').textContent = C.rank;
}

function renderPlace() {
  const p = C.place;
  document.getElementById('place').innerHTML = `
    <h3>${p.name}</h3>
    <p>${p.addr}</p>
    <p>${p.note}</p>`;
  document.getElementById('contact').innerHTML = `
    <a href="tel:${C.phone}">${C.phoneDisplay}</a>
    <a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a>
    <a href="${C.place.maps}" target="_blank" rel="noopener">Open in Maps</a>`;
}

function renderEdge() {
  // their own words, running along the platform edge — duplicated for a seamless loop
  const one = `<span>${C.tagline}</span><span>◆</span>`;
  document.getElementById('run').innerHTML = one.repeat(16);
}

/* ===================== live clock ===================== */

function humanGap(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function renderClock() {
  const host = document.getElementById('clockcard');
  if (!host) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = openState(now);

  let msg, sub;
  if (s.open) {
    msg = `Open for another ${humanGap(toMins(s.until) - mins)}`;
    sub = `Last call ${s.until}`;
  } else if (s.nextDay) {
    const gap = s.nextDay === 'today'
      ? toMins(s.nextOpen) - mins
      : null;
    msg = gap !== null ? `Opens in ${humanGap(gap)}` : `Closed until ${s.nextDay}`;
    sub = `First cup ${s.nextOpen}`;
  } else {
    msg = 'Closed'; sub = 'See the board';
  }

  host.className = 'clockcard ' + (s.open ? 'open' : 'shut');
  host.innerHTML = `
    <p class="lbl">Right now in Glasgow</p>
    <p class="now">${hh}:${mm}</p>
    <p class="msg">${msg}</p>
    <p class="sub">${sub}</p>`;
}

/* ===================== deck ===================== */

const dots = document.getElementById('dots');
const hint = document.getElementById('hint');

panels.forEach((_, i) => {
  const b = document.createElement('button');
  b.textContent = i + 1;
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
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(currentIndex() - 1); }
  if (e.key === 'Home') { e.preventDefault(); goTo(0); }
  if (e.key === 'End') { e.preventDefault(); goTo(panels.length - 1); }
});

/* ===================== canvas: passing train + platform haze ===================== */

const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, DPR = 1;
let haze = [];
let streaks = [];

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  haze = Array.from({ length: W < 700 ? 14 : 24 }, makeHaze);
}

function makeHaze() {
  return {
    x: Math.random() * W,
    y: H * (0.55 + Math.random() * 0.55),
    r: 40 + Math.random() * 110,
    vy: -(0.06 + Math.random() * 0.16),
    vx: (Math.random() - 0.5) * 0.12,
    a: 0.015 + Math.random() * 0.03
  };
}

// A train is a band of lit windows travelling fast. Spawn them on a hard swipe.
function spawnTrain(dir) {
  const bandTop = H * 0.16 + Math.random() * H * 0.2;
  const n = 10 + ((Math.random() * 8) | 0);
  for (let i = 0; i < n; i++) {
    streaks.push({
      x: dir > 0 ? W + i * 90 + Math.random() * 40 : -i * 90 - Math.random() * 40,
      y: bandTop + Math.random() * 46,
      w: 46 + Math.random() * 70,
      h: 7 + Math.random() * 13,
      v: dir > 0 ? -(18 + Math.random() * 16) : (18 + Math.random() * 16),
      life: 1
    });
  }
}

function drawFx(vel) {
  ctx.clearRect(0, 0, W, H);

  // platform haze — cold morning air under the lights
  ctx.globalCompositeOperation = 'lighter';
  for (const p of haze) {
    p.x += p.vx; p.y += p.vy;
    if (p.y + p.r < 0) { Object.assign(p, makeHaze(), { y: H + p.r }); }
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(178,206,232,${p.a})`);
    g.addColorStop(1, 'rgba(178,206,232,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // the train
  for (let i = streaks.length - 1; i >= 0; i--) {
    const s = streaks[i];
    s.x += s.v;
    s.life -= 0.012;
    if (s.life <= 0 || s.x < -400 || s.x > W + 400) { streaks.splice(i, 1); continue; }
    const a = Math.max(0, s.life) * 0.5;
    const g = ctx.createLinearGradient(s.x, 0, s.x + s.w, 0);
    g.addColorStop(0, `rgba(255,196,110,0)`);
    g.addColorStop(0.5, `rgba(255,208,140,${a})`);
    g.addColorStop(1, `rgba(255,196,110,0)`);
    ctx.fillStyle = g;
    ctx.fillRect(s.x, s.y, s.w, s.h);
  }
  ctx.globalCompositeOperation = 'source-over';
}

/* ===================== frame loop ===================== */

let lastScroll = 0, vel = 0, hintHidden = false, trainCool = 0;

function frame() {
  const now = deck.scrollLeft;
  vel += ((now - lastScroll) - vel) * 0.25;
  lastScroll = now;

  if (!hintHidden && now > 30) { hintHidden = true; hint.classList.add('gone'); }

  if (trainCool > 0) trainCool--;
  if (Math.abs(vel) > 26 && trainCool === 0) { spawnTrain(Math.sign(vel)); trainCool = 90; }

  const idx = currentIndex();
  dotEls.forEach((d, i) => d.classList.toggle('on', i === idx));

  drawFx(vel);
  requestAnimationFrame(frame);
}

/* ===================== boot ===================== */

renderStatus();
renderTimes();
renderMenu();
renderAmenities();
renderReviews();
renderPlace();
document.getElementById('board-slot').innerHTML = boardHTML();
document.getElementById('board-slot-5').innerHTML = boardHTML();
renderClock();
renderEdge();
setInterval(() => { renderStatus(); renderClock(); }, 30000);

addEventListener('resize', resize);
resize();

// flap the board in the first time it comes into view
let flapped = false;
function maybeFlap() {
  if (flapped) return;
  // only the board that is actually on screen for this breakpoint
  const flap = [...document.querySelectorAll('.flap')]
    .find(el => el.offsetParent !== null &&
                el.getBoundingClientRect().left < window.innerWidth &&
                el.getBoundingClientRect().right > 0);
  if (!flap) return;
  flapped = true;
  flapIn(flap, 120);
}
deck.addEventListener('scroll', maybeFlap, { passive: true });

function openFromHash() {
  const m = /^#p(\d+)$/.exec(location.hash);
  if (!m) return;
  const i = Math.max(0, Math.min(panels.length - 1, +m[1] - 1));
  deck.scrollLeft = i * deck.clientWidth;
  lastScroll = deck.scrollLeft;
  dotEls.forEach((d, n) => d.classList.toggle('on', n === i));
  if (i > 0) { hintHidden = true; hint.classList.add('gone'); }
  maybeFlap();
}
openFromHash();
addEventListener('hashchange', openFromHash);
addEventListener('load', openFromHash);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(openFromHash);

let resnap;
addEventListener('resize', () => {
  const i = currentIndex();
  clearTimeout(resnap);
  resnap = setTimeout(() => { deck.scrollLeft = i * deck.clientWidth; }, 120);
});

if (reduced) {
  dotEls[0].classList.add('on');
  drawFx(0);
  deck.addEventListener('scroll', () => {
    const i = currentIndex();
    dotEls.forEach((d, n) => d.classList.toggle('on', n === i));
  }, { passive: true });
} else {
  requestAnimationFrame(frame);
}

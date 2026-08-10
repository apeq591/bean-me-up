/* =========================================================================
   The scan.

   Mukta's structure, and it is the right one: the scan that FAILS is the hook.
   Told to come back before 1pm, you come back. Act one costs the poster
   nothing and buys a second visit.

   The gate is the clock, not a visit count. Someone standing there at 7am on
   their first ever scan gets the secret straight away — making a ready
   customer wait a day would be daft. The "you came back" line is a bonus for
   anyone who did act one, remembered in localStorage.

   The poster says "1pm" because it is memorable. The PAGE uses their real
   hours, which are 13:00 some days and 13:30 others. Slogan on the wall,
   truth on the screen.
   ========================================================================= */

const C = window.BMU;
const { openState, humanGap, toMins } = window.BMUClock;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.add('live');

/* which poster was scanned — the QR is the position fix, so no GPS */
const params = new URLSearchParams(location.search);
const poster = C.posters[params.get('p')] || C.posters[C.posterDefault];

/* localStorage can be unavailable (private mode, blocked cookies). It is a
   nice-to-have, never load-bearing — so every use is wrapped. */
const TOLD = 'bmu.told';
const remember = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* fine */ } };
const recall = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

/* ===================== act 1 — too late ===================== */

function actTooLate(s) {
  remember(TOLD, String(Date.now()));

  $('late-sub').textContent = s.nextDay === 'today'
    ? 'You are early, not late. They have not opened yet.'
    : 'They are shut. Nothing here works until they are not.';

  const tick = () => {
    const now = openState();
    if (now.open) return location.reload();     // they opened while you stood there
    // A countdown is only useful while it is short enough to feel. Past a day
    // "65h 15m" means nothing to anybody — name the day instead.
    if (now.inMins == null) {
      $('count').innerHTML = `<small>back ${now.nextDay} at ${now.nextOpen}</small>`;
    } else if (now.inMins > 1440) {
      $('count').innerHTML = `${now.nextDay}<small>${now.nextOpen}, and not before</small>`;
    } else {
      $('count').innerHTML = `${humanGap(now.inMins)}<small>until they open</small>`;
    }
  };
  tick();
  setInterval(tick, 30000);
  show('late');
}

/* ===================== act 2 — the secret ===================== */

function actSecret(s) {
  if (recall(TOLD)) $('welcome-back').textContent = 'You came back.';
  $('until').textContent = s.until;

  $('go').addEventListener('click', reveal, { once: true });
  show('secret');
}

/* the tubes catch — the payoff the whole poster was buying */
function reveal() {
  $('secret').classList.remove('live');
  $('behind').innerHTML = poster.metres
    ? `It has been <b>${poster.metres} metres</b> behind you this whole time.`
    : 'It has been behind you this whole time.';
  show('reveal');

  const neon = $('neon');
  if (reduced) {
    neon.classList.add('on');
    $('after').classList.add('in');
  } else {
    setTimeout(() => neon.classList.add('on'), 900);          // two beats of nothing first
    setTimeout(() => $('after').classList.add('in'), 1700);
  }

  $('show').addEventListener('click', theWay, { once: true });
  $('straight').addEventListener('click', toSite);
}

const toSite = () => { location.href = 'index.html'; };

/* ===================== act 3 — the way ===================== */

async function theWay() {
  $('reveal').classList.remove('live');
  $('way').classList.add('live');
  $('skip').addEventListener('click', toSite);

  $('dist').textContent = poster.metres ?? '—';
  $('dist-label').textContent = poster.metres ? 'roughly, on foot' : 'distance to confirm';

  // The written directions are the thing that never fails, so they lead.
  $('tell').innerHTML =
    (poster.facing ? `${poster.facing}. ` : '') + C.place.landmark;

  await startCamera();
  startArrow();
}

async function startCamera() {
  const note = $('cam-note');
  if (!navigator.mediaDevices?.getUserMedia) {
    note.textContent = 'Camera not available on this browser';
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } }, audio: false
    });
    $('cam').srcObject = stream;
    // hand the camera back when they leave, rather than holding the light on
    window.addEventListener('pagehide', () => stream.getTracks().forEach(t => t.stop()));
  } catch (e) {
    note.textContent = 'No camera — the directions above still hold';
  }
}

/* The arrow.

   Absolute compass heading is not trustworthy inside a station: it is a steel
   box and the magnetometer drifts. RELATIVE rotation is fine — so we take the
   heading at the moment they tap as "facing the poster" and rotate from there.
   If the poster's turn angle has not been measured yet, the arrow stays put
   and the written directions do the work. Better a still arrow than a
   confident wrong one. */
function startArrow() {
  const arrow = $('arrow');
  const note = $('cam-note');

  // No measured turn angle means no honest arrow. A big arrow pointing
  // confidently "forward" would walk people the wrong way down a platform,
  // which is worse than no arrow at all — so hide it and let the landmark
  // directions carry the screen until the angle is paced out on site.
  if (poster.turn == null) {
    $('way').classList.add('nodir');
    note.textContent = 'Direction not set for this poster yet';
    return;
  }
  if (!window.DeviceOrientationEvent) {
    $('way').classList.add('nodir');
    note.textContent = 'This phone has no compass — directions above';
    return;
  }

  let zero = null;
  const onTurn = (e) => {
    const a = e.webkitCompassHeading ?? e.alpha;
    if (a == null) return;
    if (zero === null) zero = a;                 // this is "facing the poster"
    const turned = ((a - zero) + 360) % 360;     // how far they have rotated since
    arrow.style.transform = `rotate(${((poster.turn - turned) + 360) % 360}deg)`;
  };

  const listen = () => window.addEventListener('deviceorientation', onTurn);

  // iOS will not give orientation without an explicit grant, on a gesture
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(r => { if (r === 'granted') listen(); })
      .catch(() => { /* they said no — written directions still stand */ });
  } else {
    listen();
  }
}

/* ===================== which act ===================== */

const state = openState();
if (state.open) actSecret(state);
else actTooLate(state);

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
const scanned = C.posters[params.get('p')] || C.posters[C.posterDefault];

/* Demo override.
   The printed QR only ever carries ?p= — so a stranger scanning the wall gets
   whatever is in data.js, and an unmeasured poster still hides its arrow.
   But measure.html hands the freshly-paced numbers straight through as
   ?turn= and ?m=, which lets the arrow be shown on site the same minute it
   is measured, without waiting for a commit. Nothing is written to data.js:
   the override lives and dies with the page load. */
const num = (name, max) => {
  const v = Number(params.get(name));
  return params.has(name) && Number.isFinite(v) && v >= 0 && v <= max ? v : null;
};
const turnParam = num('turn', 359);
const metresParam = num('m', 5000);

/* The pitch link.

   She measures on site with measure.html, then shows the whole thing from ONE
   bookmarked URL — scan.html?p=barriers&act=open — and it uses what she just
   measured. Nobody edits a query string in front of the person they are
   selling to. Only ever read in trial mode (?act=), which the printed QR never
   carries, so a stranger at the wall is unaffected either way. */
const savedMeasure = () => {
  try {
    const m = JSON.parse(localStorage.getItem('bmu.measure')) || {};
    return {
      turn: m.turn ?? null,
      metres: m.paces ? Math.round(m.paces * (m.stride || 0.72)) : null
    };
  } catch (e) { return { turn: null, metres: null }; }
};

const fromPhone = params.has('act') ? savedMeasure() : { turn: null, metres: null };

const poster = {
  ...scanned,
  // saved measurements first, then anything named explicitly in the URL
  ...(fromPhone.turn != null ? { turn: fromPhone.turn } : {}),
  ...(fromPhone.metres != null ? { metres: fromPhone.metres } : {}),
  ...(turnParam != null ? { turn: turnParam } : {}),
  ...(metresParam != null ? { metres: metresParam } : {})
};

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
    const now = trialState(openState());
    // they opened while you stood there — but never while a trial is pinning
    // the page shut, or it would reload itself every half minute
    if (now.open) return location.reload();
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

  // one button, two jobs: end the walk, then leave for the menu
  $('skip').addEventListener('click', () => {
    if ($('way').classList.contains('arrived')) toSite();
    else arrive();
  });

  $('dist').textContent = poster.metres ?? '—';
  $('dist-label').textContent = poster.metres ? 'roughly, on foot' : 'distance to confirm';

  // The written directions are the thing that never fails, so they lead.
  $('tell').innerHTML =
    (poster.facing ? `${poster.facing}. ` : '') + C.place.landmark;

  // Both of these ask iOS for a sensor grant, and iOS only gives one while the
  // tap that opened this screen still counts as fresh. Awaiting the camera
  // first would spend that. Camera last, on purpose.
  startArrow();
  startPacing();
  await startCamera();
}

/* ===================== how far is left =====================

   No GPS indoors, so the only honest source of "have I moved" is the phone
   shaking as you walk. Count the footfalls off the accelerometer and multiply
   by a stride. That is a step counter, not a tape measure: it drifts, so it
   never counts past zero, and arrival is deliberately generous — inside a few
   metres you can see the thing, and a number frozen at 4m while you stand in
   front of the hatch is worse than no number at all.                        */

const STRIDE = 0.72;    // an average adult pace, in metres
const ARRIVED_AT = 4;   // metres — close enough that the hatch is in front of you
const NEARLY = 12;      // metres — stop counting at them and start telling them

/* Counting footfalls will always be a guess, so the person walking gets the
   final say: one tap on the button ends the walk whether the count agrees or
   not. Stopping the sensor here matters too — nothing should keep counting
   steps at somebody who has already put their phone away. */
let stopPacing = null;

function arrive() {
  if ($('way').classList.contains('arrived')) return;
  $('way').classList.add('arrived');
  $('skip').textContent = 'Show me the menu';
  if (stopPacing) stopPacing();
}

function startPacing() {
  const total = poster.metres;
  if (total == null) return;            // nothing measured, nothing to count down

  let steps = 0, lastPeak = 0, ema = 9.8, dev = 0.4, armed = true;

  const paint = () => {
    const left = Math.max(0, total - steps * STRIDE);
    if (left <= ARRIVED_AT) return arrive();

    $('dist').textContent = Math.round(left);
    // "about" is the honest word: this is a step count, and a step count can
    // run fast or slow. Inside the last few metres the number stops being the
    // useful thing anyway — what to look for is.
    $('dist-label').textContent = 'about, on foot';
    if (left <= NEARLY) $('tell').innerHTML = '<b>It is right here.</b> ' + C.place.landmark;
  };

  /* A fixed threshold assumes one way of carrying the thing. A phone swinging
     in one hand throws several m/s²; an iPad gripped in two hands barely
     wobbles, and a fixed bar simply never sees a step. So the bar is set from
     how much THIS device is actually shaking: the mean deviation over the last
     few seconds, floored so that standing still can never manufacture steps.

     Peaks are also armed and disarmed — one step must fall back below the bar
     before the next can count — which is what stops one heavy stride
     registering three times. */
  const onMotion = (e) => {
    const a = e.accelerationIncludingGravity;
    if (!a) return;
    const mag = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
    ema = ema * 0.92 + mag * 0.08;      // gravity, and any slow drift along with it
    const dyn = Math.abs(mag - ema);
    dev = dev * 0.96 + dyn * 0.04;      // how lively this device is being carried

    const bar = Math.max(0.32, dev * 1.5);
    const t = e.timeStamp || performance.now();

    if (armed && dyn > bar && t - lastPeak > 250) {
      armed = false; lastPeak = t; steps++; paint();
    } else if (!armed && dyn < bar * 0.55) {
      armed = true;                     // fallen back down: ready for the next footfall
    }
  };

  const listen = () => window.addEventListener('devicemotion', onMotion);
  stopPacing = () => window.removeEventListener('devicemotion', onMotion);

  if (typeof DeviceMotionEvent?.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(r => { if (r === 'granted') listen(); })
      .catch(() => { /* declined — the distance simply stays put */ });
  } else if (window.DeviceMotionEvent) {
    listen();
  }
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
  const floor = $('floor');
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
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const onTurn = (e) => {
    const a = e.webkitCompassHeading ?? e.alpha;
    if (a == null) return;
    if (zero === null) zero = a;                 // this is "facing the poster"
    const turned = ((a - zero) + 360) % 360;     // how far they have rotated since
    const rel = ((poster.turn - turned) + 360) % 360;   // where the shop is, from here

    /* Behind you, an arrow drawn on the floor would run off the bottom of the
       screen and read as "walk into your own feet". Words are better. */
    const behind = rel > 118 && rel < 242;
    $('way').classList.toggle('behind', behind);
    if (behind) return;

    floor.style.setProperty('--yaw', rel + 'deg');

    /* beta is the phone's own tilt: ~90 held upright looking ahead, less as it
       is tipped down towards the ground. Raking the floor plane to match keeps
       the chevrons lying on the actual floor instead of floating. */
    if (e.beta != null) floor.style.setProperty('--pitch', clamp(e.beta - 10, 30, 80) + 'deg');
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

/* Trial mode — for Mukta, not for the wall.

   ?act=open  forces act two, whatever the clock says
   ?act=shut  forces act one

   The gate itself is untouched. Editing the hours, or deleting the check, would
   mean a stranger scanning at six in the evening gets told the shop is open —
   and the one thing this page is FOR is being right about that. A parameter
   only she has in her address bar shows the same screens without ever lying to
   anyone standing at the poster, and there is nothing to remember to put back.  */
const forced = params.get('act');

const closeOfNextOpenDay = () => {
  const day = new Date().getDay();
  for (let step = 0; step <= 7; step++) {
    const h = C.hours[(day + step) % 7];
    if (h) return h.close;
  }
  return '13:00';
};

function trialState(real) {
  if (forced === 'open' && !real.open) {
    return { open: true, until: C.hours[new Date().getDay()]?.close ?? closeOfNextOpenDay() };
  }
  if (forced === 'shut' && real.open) {
    // ask the clock what it would say a minute after they shut, so the
    // countdown and the day name are the real ones rather than invented
    const after = new Date();
    after.setHours(...String(real.until).split(':').map(Number), 0, 0);
    after.setMinutes(after.getMinutes() + 1);
    return openState(after);
  }
  return real;
}

const state = trialState(openState());
if (state.open) actSecret(state);
else actTooLate(state);

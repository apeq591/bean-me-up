/* =========================================================================
   The clock.

   Shared by the site and the scan page. Opening hours are the one thing that
   must never disagree between two files — a poster that says "come back before
   1pm" and a site that says they shut at 13:30 makes a liar of both.

   Reads window.BMU.hours. Knows nothing about the DOM.
   ========================================================================= */

(function () {
  const C = window.BMU;
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    // walk forward to the next day they actually open
    for (let step = 0; step <= 7; step++) {
      const d = (day + step) % 7;
      const h = C.hours[d];
      if (!h) continue;
      if (step === 0 && mins >= toMins(h.open)) continue;   // already past today's opening
      return {
        open: false,
        nextDay: step === 0 ? 'today' : DAYS[d],
        nextOpen: h.open,
        // minutes from now until they open, so a countdown never has to guess
        inMins: step * 1440 + toMins(h.open) - mins
      };
    }
    return { open: false };
  }

  const humanGap = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  };

  window.BMUClock = { DAYS, toMins, openState, humanGap };
})();

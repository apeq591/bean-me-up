/* =========================================================================
   Bean Me Up — single source of truth for every fact on the site.

   RULE: nothing here is invented. Each block says where it came from.
   Anything unknown is `null` and renders a visible "to confirm" chip.

   Two kinds of source now:
     LISTED  — public listings (Yelp, RestaurantGuru, their Facebook), 10 Aug 2026
     SEEN    — Mukta's own observation of the place. Better evidence than any
               listing, because she looked at it.
   ========================================================================= */

window.BMU = {

  draft: true,

  /* ---- LISTED --------------------------------------------------------- */
  name: 'Bean Me Up',
  tagline: 'Best coffee in the toon',      // their own Facebook line
  phone: '+447875697214',
  phoneDisplay: '07875 697214',
  facebook: 'https://www.facebook.com/beanmeuppartick/',

  /* ---- SEEN: it is not a cart -----------------------------------------
     A hatch built into the station wall, under the gig posters. Nothing on
     wheels. So the site never says "cart", and directs people by the thing
     they can actually see.                                                */
  place: {
    name: 'Partick Station',
    addr: 'Merkland Court, Partick, Glasgow G11 6BU',
    maps: 'https://maps.google.com/?q=Bean+Me+Up+Merkland+Court+Glasgow+G11+6BU',
    landmark: 'Look for the gig posters. It is the lit green hatch right beside them.',
    note: 'Built into the station wall, beside the train and bus stations. You do not need to leave.'
  },

  /* ---- SEEN: their identity -------------------------------------------
     Observed at the counter, and now the whole design system:
       green   — the counter front and the light wash behind it
       neon    — BEAN in bold caps, "me up" in a lit script
       hex     — warm tan/cream honeycomb tile on the back wall
       chalk   — black boards, white handwriting                            */

  /* ---- HOURS — LISTED, not owner-confirmed ---------------------------- */
  hoursConfirmed: false,
  hours: {                       // 0 = Sunday … 6 = Saturday
    1: { open: '06:45', close: '13:00' },
    2: { open: '06:45', close: '13:00' },
    3: { open: '06:45', close: '13:30' },
    4: { open: '06:45', close: '13:30' },
    5: { open: '06:45', close: '13:30' },
    6: null,
    0: null
  },

  /* ---- RATINGS — LISTED, real ----------------------------------------- */
  ratings: [
    { score: '4.7', outOf: '5', count: '26 reviews', where: 'Google' },
    { score: '4.6', outOf: '5', count: '5 reviews',  where: 'Facebook' }
  ],
  rank: '#285 of 1,703 coffeehouses in Glasgow',

  /* ---- THE BOARD ------------------------------------------------------
     Named by real reviewers, or standard of any espresso bar. Prices are
     NOT guessed — no photo of the boards ever reached ApeQ, so showPrices
     stays false until they are transcribed off the real thing.            */
  showPrices: false,
  menu: [
    { name: 'Cappuccino',         price: null, note: 'the one people write reviews about' },
    { name: 'Coconut cappuccino', price: null, note: null },
    { name: 'Flat white',         price: null, note: null },
    { name: 'Caramel latte',      price: null, note: null },
    { name: 'Latte',              price: null, note: null },
    { name: 'Americano',          price: null, note: null },
    { name: 'Espresso',           price: null, note: null },
    { name: 'Hot chocolate',      price: null, note: 'with caramel syrup, if you want it' },
    { name: 'Tea',                price: null, note: null }
  ],
  milks: 'Plant-based milks available — just ask.',

  /* ---- SEEN in the photo: today's special ------------------------------
     A framed chalkboard on the green wall, handwritten in chalk, with a
     hand-drawn tall iced glass beside it. It changes, so it is flagged.    */
  special: {
    name: 'Iced chai latte',
    note: 'It changes — ask what’s on today'
  },

  /* ---- SEEN: it is not only coffee ------------------------------------ */
  alsoSells: [
    { name: 'Cold drinks',   note: 'A full glass-door fridge of cans and bottles' },
    { name: 'Pastries',      note: 'A heated glass case of them by the window' },
    { name: 'Crisps',        note: 'Racked along the counter' },
    { name: 'Sweets',        note: 'Boxes of them at the till' }
  ],

  /* ---- REVIEWS — LISTED, real, attributed ----------------------------- */
  reviews: [
    {
      text: 'The best cappuccino I’ve had in a long time.',
      extra: 'Extremely efficient and friendly barista.',
      who: 'Andrew M.', where: 'Yelp', when: 'Feb 2018'
    },
    {
      text: 'A coconut cappuccino — and they had plant-based milk without me having to ask twice.',
      extra: null,
      who: 'Usman B.', where: 'Google', when: '2025'
    },
    {
      text: 'Lovely caramel latte. Nice pastries too.',
      extra: null,
      who: 'Mary W. & Cara A.', where: 'Yelp', when: 'Feb 2011'
    }
  ],

  /* ---- AMENITIES — LISTED --------------------------------------------- */
  amenities: ['Card &amp; contactless', 'Free Wi-Fi', 'Wheelchair accessible', 'Takeaway'],

  /* ---- STILL UNKNOWN — ask when you go --------------------------------
     owner's name · prices off the chalkboards · the full food list ·
     a clean photo of the neon sign to replace the drawn lockup            */
  unknown: ['owner', 'prices']   // the photo settled the rest
};

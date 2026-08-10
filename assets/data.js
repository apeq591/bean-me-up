/* =========================================================================
   Bean Me Up — single source of truth for every fact on the site.

   RULE: nothing in here is invented. Each block says where it came from.
   Anything unknown is `null` and renders a visible "to confirm" chip.
   ========================================================================= */

window.BMU = {

  // Set to false once every `null` is filled and the hours are confirmed.
  draft: true,

  /* ---- CONFIRMED — public listings, checked 10 Aug 2026 --------------- */
  name: 'Bean Me Up',
  // Their own tagline, from their Facebook page. Their words, not ours.
  tagline: 'Best coffee in the toon',
  phone: '+447875697214',
  phoneDisplay: '07875 697214',
  facebook: 'https://www.facebook.com/beanmeuppartick/',

  place: {
    name: 'Partick Station',
    addr: 'Merkland Court, Partick, Glasgow G11 6BU',
    maps: 'https://maps.google.com/?q=Bean+Me+Up+Merkland+Court+Glasgow+G11+6BU',
    note: 'Right beside the train station and the bus station. You do not need to leave.'
  },

  /* ---- HOURS ---------------------------------------------------------
     From a public aggregator listing, NOT from the owner. Treat as a draft:
     the open/closed banner on the site is only as right as this table.
     Confirm at the cart, then set hoursConfirmed = true.                */
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

  /* ---- RATINGS — real, published -------------------------------------- */
  ratings: [
    { score: '4.7', outOf: '5', count: '26 reviews', where: 'Google' },
    { score: '4.6', outOf: '5', count: '5 reviews',  where: 'Facebook' }
  ],
  rank: '#285 of 1,703 coffeehouses in Glasgow',

  /* ---- WHAT THEY SELL --------------------------------------------------
     Every item below is one a real customer named in a public review, or a
     standard of any espresso bar. Prices are NOT guessed — see showPrices. */
  showPrices: false,
  menu: {
    coffee: [
      { name: 'Cappuccino',        price: null, note: 'the one people write reviews about' },
      { name: 'Coconut cappuccino', price: null, note: null },
      { name: 'Flat white',        price: null, note: null },
      { name: 'Caramel latte',     price: null, note: null },
      { name: 'Latte',             price: null, note: null },
      { name: 'Americano',         price: null, note: null },
      { name: 'Espresso',          price: null, note: null }
    ],
    other: [
      { name: 'Hot chocolate',     price: null, note: 'with caramel syrup, if you want it' },
      { name: 'Tea',               price: null, note: null },
      { name: 'Pastries',          price: null, note: null }
    ]
  },
  milks: 'Plant-based milks available — just ask.',

  /* ---- REAL REVIEWS ----------------------------------------------------
     Published, attributed, and quoted as written. Do NOT add a review here
     that you have not read on a public page yourself.                     */
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

  /* ---- AMENITIES — listed publicly ------------------------------------ */
  amenities: [
    'Card &amp; contactless',
    'Free Wi-Fi',
    'Wheelchair accessible',
    'Takeaway'
  ],

  /* ---- STILL UNKNOWN — ask on the recon visit -------------------------
     owner's name · real menu board · prices · food beyond pastries ·
     their actual logo (Facebook blocks scraping, so photograph the cart)  */
  unknown: ['owner', 'prices', 'full menu', 'logo artwork']
};

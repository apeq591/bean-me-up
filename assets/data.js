/* =========================================================================
   Bean Me Up — single source of truth for every fact on the site.
   Used by both v2 (deck.js) and v1 (app.js).

   EVERYTHING you need to change after the recon visit lives here.
   Nothing is invented: anything `null` renders a visible "to confirm" chip
   instead of a made-up fact. See RECON.md.
   ========================================================================= */

window.BMU = {

  // Set to false once every `null` below has been filled in.
  draft: true,

  // ---- CONFIRMED (public sources, Aug 2026) ----------------------------
  phone: '+447875697214',
  phoneDisplay: '07875 697214',
  facebook: 'https://www.facebook.com/beanmeuppartick/',

  // ---- LOCATIONS -------------------------------------------------------
  locations: [
    {
      tag: 'Main cart',
      tagClass: 'tag-main',
      name: 'Partick Station',
      addr: 'Merkland Court, Partick, Glasgow G11 6BU',
      maps: 'https://maps.google.com/?q=Bean+Me+Up+Merkland+Court+Glasgow+G11+6BU',
      hours: null,              // e.g. { 'Mon–Fri':'6:30am – 2pm', 'Sat':'8am – 1pm' }
      note: 'On the platform level — you do not need to leave the station.'
    },
    {
      tag: 'Second cart',
      tagClass: 'tag-sec',
      name: 'Cowcaddens Underground',
      addr: 'Cowcaddens Subway station, Glasgow',
      maps: 'https://maps.google.com/?q=Cowcaddens+Subway+Station+Glasgow',
      hours: null,
      note: null                // confirm: same owner? same hours? same menu?
    }
  ],

  // ---- MENU ------------------------------------------------------------
  // Stays false until real prices are known — never guess a price in front of
  // the person who sets them.
  showPrices: false,
  menu: {
    coffee: [
      { name: 'Espresso',      price: null },
      { name: 'Americano',     price: null },
      { name: 'Flat white',    price: null },
      { name: 'Latte',         price: null },
      { name: 'Cappuccino',    price: null },
      { name: 'Mocha',         price: null },
      { name: 'Iced latte',    price: null }
    ],
    other: [
      { name: 'Hot chocolate', price: null },   // confirmed real — syrups available
      { name: 'Syrup shot',    price: null },
      { name: 'Tea',           price: null },
      { name: 'Cold drinks',   price: null }
    ]
  },
  menuNote: 'Oat, soya and semi-skimmed available. Sizes and food options to be confirmed with the cart.',

  // ---- SOCIAL PROOF ----------------------------------------------------
  // Real published customer review. Do not add any review that isn't real.
  quote: {
    text: 'A great wee addiction to the newly refurbished station.',
    source: 'Customer review · Yelp'
  }
};

# Bean Me Up — what to find out before you pitch

Everything on the site that isn't confirmed shows an amber **"to confirm"** chip.
Fill these in inside `assets/app.js` (top of the file, `CONFIG`), then set
`draft: false` and the chips disappear.

## Ask at the cart (you're a customer — this is a normal conversation)

| # | Question | Goes into |
|---|---|---|
| 1 | Who owns it / who do I speak to? | nothing on the site — you need it for the pitch |
| 2 | What are the opening times? Different at weekends? | `locations[0].hours` |
| 3 | Is the Cowcaddens one yours too, or a different owner? | `locations[1]` — **if it's not theirs, delete that whole block** |
| 4 | Cowcaddens times? | `locations[1].hours` |
| 5 | What's actually on the menu — and is there food (croissants, pastries)? | `CONFIG.menu` |
| 6 | Prices | `price` fields, then `showPrices: true` |
| 7 | Milk options — oat, soya? | `menuNote` |
| 8 | Would you take an order by text if someone was on the train? | this decides whether the **Text ahead** section stays |
| 9 | Busiest time of day? Quietest? | your pitch — the site's job is to fill the quiet hours |

## Two things to decide before you show it

**1. The "Text ahead" section is a promise you can't make for them.**
It's the strongest thing on the page — it's the bit that gets them *more*
customers rather than just looking nice. But if the owner says "no, I'm not
reading texts during a rush," it has to come out. Ask question 8 **before** you
show the site, not after.

**2. The Cowcaddens cart might not be theirs.**
Public sources say there's a Bean Me Up at Cowcaddens Underground, but nothing
confirms it's the same owner. If it isn't, showing a site that claims their
brand runs two carts is an own goal. Check first.

## Things deliberately NOT on the site

- **No fake reviews.** The one quote is a real published Yelp review. Don't add
  more unless they're real.
- **No prices.** Guessing a price in front of the person who sets it is the
  fastest way to lose them.
- **No "about us" story.** You don't know it yet. Ask, then write it.

## Not confirmed, worth knowing

- Public listings say: coffee cart at Merkland Court, Partick G11 6BU, takeaway,
  card accepted, free Wi-Fi, hot chocolate with syrups. Phone 07875 697214.
  Facebook page "Bean Me Up Partick" exists; **no website found** — which is the
  whole opening.
- `beanmeuproastery.com` is a **different, unrelated business in Munster,
  Indiana**. Don't let it come up in conversation as if it's them.

## Running it

Open `index.html` in a browser — no build step, no server needed.
To show it on your phone from your laptop: `python3 -m http.server 8080` in this
folder, then visit `http://<your-laptop-ip>:8080`. Or push to GitHub Pages the
same way as Ram Provision.

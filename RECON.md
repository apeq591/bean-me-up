# Bean Me Up — what's real, what isn't, and what to ask

Everything on the site comes from a source listed below. Anything unconfirmed
shows a lime **"to confirm"** chip. It all lives in one place: `assets/data.js`.
Fill the gaps, set `draft: false`, and the chips disappear.

Two kinds of source:

- **LISTED** — public listings (Yelp, RestaurantGuru, their Facebook), 10 Aug 2026
- **SEEN** — Mukta's own look at the place. Better evidence than any listing.

## SEEN — the things that made this site theirs

| Observed | Where it went |
|---|---|
| **Apple/lime green** counter front + the light wash behind it | the counter band under the sign, the score tiles, the buttons |
| **White neon logo** — BEAN caps running into rounded lowercase | the lockup, drawn in HTML/CSS so it actually strikes on and glows |
| **Warm tan/cream honeycomb hex tile** on the back wall | the background of the entire site — it *is* the wall |
| **Chalkboard black, white handwriting** | "The Board", which writes itself in left to right |
| **Hand-drawn special board** (an iced chai latte on it) | the gold-framed special board, hung slightly askew |
| **Cold drinks fridge, pastries, crisps, sweets** | its own section, not a heading |
| **It is a hatch in the station wall, under the gig posters** | the copy, and the directions |

**"Find the cart" is gone.** It isn't a cart, nothing is on wheels, and sending
people to look for one is sending them to the wrong thing. The line is now
**"You don't find it. You walk past it."**, and the directions lead with the gig
posters instead of the postcode — because a postcode is useless once you are
already inside a station.

## LISTED — checked 10 Aug 2026

| Fact | Source |
|---|---|
| Merkland Court, Partick, Glasgow G11 6BU · 07875 697214 | Yelp, RestaurantGuru |
| Tagline **"Best coffee in the toon"** | their own Facebook |
| Google 4.7/5 from 26 reviews · Facebook 4.6/5 from 5 | RestaurantGuru |
| #285 of 1,703 coffeehouses in Glasgow | RestaurantGuru |
| Hours 06:45–13:00 (Mon–Tue), 06:45–13:30 (Wed–Fri), closed weekends | RestaurantGuru |
| Card, free Wi-Fi, wheelchair access, takeaway | Yelp, RestaurantGuru |

Reviews are real and attributed — Andrew M. (Yelp, Feb 2018), Usman B. (Google,
2025), Mary W. & Cara A. (Yelp, Feb 2011). Never add one you have not read on a
public page yourself.

## The photo — what it settled, and what it didn't

The photo is saved at `reference/the-shop.jpg`. What it corrected:

- **The neon is ONE line — `BEANmeup`, joined.** "BEAN" in bold caps running
  straight into "meup" in a **rounded lowercase**, not a cursive script, and not
  two stacked lines. The site's lockup now matches. The tube is white; the green
  is the panel it is screwed to.
- **The hex tile is solid filled hexagons in mixed warm tones** — cream, tan,
  terracotta, brown — flat-top, thin grout. The earlier version had them as
  outlines on flat tan, which was wrong. `assets/hex.svg` is now traced from it.
- Confirmed: the lime counter front, the framed special board with the
  hand-drawn iced glass, the glass-door drinks fridge, the heated pastry case,
  crisps racked along the counter, sweets at the till, the steel surround, and
  the **gig posters immediately to the left** — the landmark line is right.

**The prices are still not in.** The menu boards are in the photo but at 800×600
the item names and prices are illegible even blown up 8×. Reading them would be
guessing, so they stay out and the "prices to confirm" chip stays on.

**What would finish it: one close-up photo of just the menu board**, square on,
as large as your phone will take it. Then the prices go into the `price` fields
in `assets/data.js`, `showPrices` flips to `true`, and the last chip disappears.

## Still to ask when you go

| # | Question | Fills |
|---|---|---|
| 1 | Who owns it / who do I speak to? | your pitch |
| 2 | Are these hours right? | `hours`, then `hoursConfirmed: true` |
| 3 | Prices off both boards | `price` fields → `showPrices: true` |
| 4 | Full food list — what else is in the fridge? | `alsoSells` |
| 5 | What's today's special, and how often does it change? | `special` |
| 6 | How long have you been here? | the site says "fifteen years" off a Feb 2011 review |
| 7 | Busiest time? Quietest? | your pitch — the site's job is the quiet hours |

## The idea the site is built on

**The wall.** Everything in that shop hangs on one surface — the warm honeycomb
tile. The neon is screwed to it, the chalkboards hang off it, the lime counter
runs along the bottom of it. So the site *is* that wall, and every section is an
object mounted on it. You scroll down it the way your eye travels down it while
you queue.

Nothing on the site is borrowed from "railway station" — no departure board, no
platform edge, no concrete. That was an idea about where the shop happens to be,
not about the shop. The tile, the neon, the chalk and the green are the shop.

Three things carry it, and all three came off the photo:

1. the neon **strikes on** when you arrive, like the tubes warming up
2. the chalkboards **write themselves in**, left to right
3. the OPEN / CLOSED sign **hangs and swings**, and it is live

Two more make it useful rather than just good-looking, and both come from the
hours:

1. **The hanging OPEN / CLOSED sign** reads the visitor's own clock.
2. **The clock card** counts it down — *"open for another 26m"*.

For a business with a four-hour trading window that is the most valuable thing a
website can do. It is also only as honest as the hours — which is why question 2
matters more than any other question on this page.

## Running it

Open `index.html` — no build step. Normal vertical scroll. Deep links:
`#hours`, `#board`, `#more`, `#says`, `#where`.
Live at https://apeq591.github.io/bean-me-up/ (unlisted — `noindex` until they
say yes).

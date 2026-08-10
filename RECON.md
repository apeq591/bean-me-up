# Bean Me Up — what's real, what's not, and what to ask

Everything on the site comes from a public source, listed below. Anything not
confirmed shows an amber **"to confirm"** chip. All of it lives in one place:
`assets/data.js`. Fill the gaps, set `draft: false`, and the chips disappear.

## What's confirmed (public listings, checked 10 Aug 2026)

| Fact | Source |
|---|---|
| Coffee cart, Merkland Court, Partick, Glasgow G11 6BU | Yelp, RestaurantGuru |
| Phone 07875 697214 | RestaurantGuru |
| Tagline **"Best coffee in the toon"** | their own Facebook page |
| Google 4.7/5 from 26 reviews · Facebook 4.6/5 from 5 | RestaurantGuru |
| #285 of 1,703 coffeehouses in Glasgow | RestaurantGuru |
| Card, free Wi-Fi, wheelchair access, takeaway | Yelp, RestaurantGuru |
| Hours 06:45–13:00 (Mon–Tue), 06:45–13:30 (Wed–Fri), closed weekends | RestaurantGuru |
| Named after "Beam me up, Scotty" | obvious, and reviewers say it |

**Reviews on the site are real and attributed** — Andrew M. (Yelp, Feb 2018),
Usman B. (Google, 2025), Mary W. & Cara A. (Yelp, Feb 2011). Don't add one you
haven't read on a public page yourself.

## What was REMOVED and why

- **Cowcaddens** — gone, your call. (For the record: a 2011 Yelp review does
  mention a second Bean Me Up at Cowcaddens with hot food, but nothing confirms
  it's still there or the same owner. You were right to cut it.)
- **Text/call to place an order** — gone. It was never discussed with them, so
  the site shouldn't promise it. Mention it out loud instead; it shows you came
  with an idea rather than just a page.
- **A quote I could not verify** — an earlier version carried a review line
  ("a great wee addiction to the newly refurbished station"). It does not appear
  in any Yelp review I could actually retrieve, and a direct search for it finds
  nothing. It has been deleted. Treat it as never having existed.

## Still unknown — ask at the cart

| # | Question | Fills |
|---|---|---|
| 1 | Who owns it / who do I speak to? | your pitch |
| 2 | Are these hours right? Do they change? | `C.hours`, then `hoursConfirmed: true` |
| 3 | Prices | `price` fields, then `showPrices: true` |
| 4 | Full menu — any food beyond pastries? | `C.menu` |
| 5 | **Can I photograph your sign?** | the logo — see below |
| 6 | How long have you been here? | the site says "fifteen years" off a Feb 2011 review — confirm |
| 7 | Busiest time? Quietest? | your pitch: the site's job is filling the quiet hours |

## About their logo

**I could not get it.** Their Facebook page is the only place it appears and
Facebook blocks automated access. So the mark on the site is one I designed — a
coffee bean in a transporter beam — and it is a **proposal, not their logo**.

When you go, photograph the cart's sign. If they have a real mark, it replaces
mine and the site instantly stops looking like a template and starts looking
like theirs. That's worth doing before any pitch.

## The idea the site is built on

They open at **06:45** and are shut by **one**. Closed at weekends. That is not a
café's opening hours — that is a **train timetable**. They are a morning cart for
people catching a train.

So the site is built out of **railway platform signage**, because that is what
they physically are:

- the name sits on an **enamel platform nameboard** with the yellow rule real
  station signs carry;
- the week's hours are a working **split-flap departure board** that clatters
  through its characters and settles, exactly like the board above your head;
- a **yellow platform edge line** runs along the bottom of every screen, with
  their own words — *best coffee in the toon* — running along it;
- the scene is **dawn, not night** — cold blue platform, one warm lamp, a cup of
  coffee steaming under it, because that is the hour they trade in.

Two things make it useful rather than just good-looking, and both come straight
from the hours:

1. **The live OPEN / CLOSED pill** reads the visitor's own clock.
2. **The clock card** counts it down — *"open for another 52m"*.

For a business with a four-hour trading window that is the most valuable thing a
website can do. It is also only as honest as the hours, which is why question 2
above matters more than any other question on this page.

## Running it

Open `index.html` — no build step. Deep links: `#p1`–`#p5` open a given panel.
Live at https://apeq591.github.io/bean-me-up/ (unlisted — `noindex` until they
say yes).

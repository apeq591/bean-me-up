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

They open at **06:45** and are shut by **one**. Closed at weekends. That means
they aren't a café — they're a **morning cart for people catching a train**. The
whole site is built round that, which is why it can't be mistaken for a generic
coffee-shop template.

The most useful thing on it is the **live OPEN / CLOSED pill** in the corner. It
reads the visitor's own clock and tells them whether the cart is open right now
and when it shuts. For a business with a four-hour trading window, that's the
single most valuable thing a website can do — and it only works because the
hours are real. Which is why question 2 matters more than any other.

## Running it

Open `index.html` — no build step. Deep links: `#p1`–`#p5` open a given panel.
Live at https://apeq591.github.io/bean-me-up/ (unlisted — `noindex` until they
say yes).

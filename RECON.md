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
| **Apple/lime green** counter front + the light wash behind it | the brand colour: counter bar, glow, buttons, bottom strip |
| **White neon logo** — BEAN in bold caps, *me up* in a lit script | the lockup, drawn in HTML/CSS so it actually glows |
| **Warm tan/cream honeycomb hex tile** on the back wall | the "Also on the go" panel, and faintly behind the neon |
| **Chalkboard black, white handwriting** | the whole menu panel — "The Board" |
| **Hand-drawn special board** (an iced chai latte on it) | the Today's Special strip on the front |
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

## The one thing that could not be done

**The prices are still missing, because no photo ever reached ApeQ.** The only
image in the workspace is the phone-case screenshot from 8 August. So the board
shows the drinks with no prices and a "prices to confirm" chip, rather than
invented numbers.

**Send the photo of the chalkboards and they go straight in** — `price` fields in
`assets/data.js`, then `showPrices: true`. Same for a clean shot of the neon: the
lockup on the site is drawn from your description, not traced from their sign.

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

At 6:45 on a January morning Partick station is grey concrete, brushed steel and
strip lighting — and this thing is a **glowing green box** in the middle of it.
That is the entire site. The background is cold grey station; the content sits in
the green light. It earns the dark theme instead of defaulting to it.

Two things make it useful rather than just good-looking, and both come from the
hours:

1. **The live OPEN / CLOSED pill** reads the visitor's own clock.
2. **The clock card** counts it down — *"open for another 26m"*.

For a business with a four-hour trading window that is the most valuable thing a
website can do. It is also only as honest as the hours — which is why question 2
matters more than any other question on this page.

## Running it

Open `index.html` — no build step. Deep links `#p1`–`#p6` open a given panel.
Live at https://apeq591.github.io/bean-me-up/ (unlisted — `noindex` until they
say yes).

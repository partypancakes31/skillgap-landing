# DESIGN.md: GapLee (gaplee.space)

Status: Locked (2026-11-25); Direction C built 2026-11-26 and moved to the homepage `/` 2026-11-28, awaiting Christian's lock
House style: Apple (restraint, whitespace, clear hierarchy, few colors, calm motion)

The site has two surfaces with two directions:

| Surface | Direction | Status |
|---|---|---|
| Homepage `/` (company site of GapLee Information Technology Services; was `/services/` until 2026-11-28) and `/card/` | **C. GapLee Services** ("Grid & rack"), an infrastructure-style layout in GapLee's ink, warm paper and gold | Built 2026-11-26, moved to `/` 2026-11-28, awaiting lock |
| Teacher product pages (`index`, `institutions`, `pricing`, `use`, `compliance`, `custom-build`, `integration`) | **A. GapLee product** ("Ink, Canvas & Gold"), captured as-is | Parked 2026-11-28 in `_parked/product/` (not deployed); old URLs 301 to `/`. Relaunches later under a new product name |
| `/services` | ~~B. Monochrome editorial~~ (after Christian's portfolio) | Superseded 2026-11-26 |

---

## Brief (homepage `/`, formerly `/services`)

- What it is: the homepage of GapLee Information Technology Services, a DTI-registered
  sole proprietorship in Taguig City. Sells business websites, inquiry and booking systems, and
  custom tools.
- Who it's for: owners and staff of small and mid-size businesses (for example a real estate
  company). Only the footer legal line and the structured data name the region (Metro Manila,
  Philippines). Most visit on a phone.
- The one thing a visitor must do: send an inquiry through the contact form ("Get a free
  preview").
- Feel: precise, quiet, confident, engineered. It should read as a web studio, not an edtech
  product, and it should be clear where to look and where the page leads.
- Content we have: the handoff copy, the GapLee logo and the contact email (hello@gaplee.space).
  The teacher product is parked, so it is no longer shown as proof of work.
- Content still missing (Christian supplies later): case studies, client screenshots. The Work
  section stays omitted until then; nothing is invented to fill it.
- Constraints: static HTML in the existing repo, no build step, no new packages. The page
  carries its own inline CSS, fonts and script so it can move to a subdomain unchanged. Light
  only. English. The repo is public.

## References

| Reference | Take this | Not this |
|---|---|---|
| baseten.co (home, product, pricing, customers, careers, security and talk-to-us pages, viewed 2026-11-26) | Square everything; big regular-weight sans headlines; mono section tags in a black box; tinted panels on a faint square grid; a tab list floating over a panel with a detail card; sticky side list beside content; two-card terms like their pricing page; FAQ rows with square plus icons; form with mono uppercase labels; black footer with white column labels and a giant wordmark; stepped striped spacers between sections | Their 3D isometric art, product names, copy, green and pastel palette, client logo walls, testimonials and metrics |
| gaplee.space product pages | Gold `#c9a96e`, warm paper tints, the `/api/contact` form wiring and honeypot | Cream canvas as page background, DM Serif headings, product CTAs |
| lawsofux.com | Von Restorff (one gold highlight per block), goal-gradient (steps rail), Hick's (one primary action), Fitts (44px+ targets), WCAG 2.2.2 (nothing auto-moves beyond one-time hints) | |

## Direction C: GapLee Services, grid & rack

A white page organised like a well-labelled rack: every section opens with a small black mono
tag, content sits on warm tinted panels drawn on a faint 44px grid, and all corners are square.
Headlines are large, regular weight and tightly tracked. Gold is the single accent and always
means "this one": the highlighted fact, the selected tab, the active step.
The black footer closes the page with a giant wordmark. GapLee's identity stays through the
monochrome GL mark, the business name and legal line, and gold.

Options considered: B monochrome editorial (shipped as drafts 2026-11-25/26, rejected by
Christian: "plain", "no focus", then "too minimal" and "suffocating"), a three-section cut of B
(rejected, reverted), Baseten's own green palette (rejected: imitates their brand).

## Tokens (Direction C)

Source of truth in code: the `:root` block at the top of `index.html` (the homepage; `/card/` copies it). No hex or rgba
values appear in the CSS outside that block.

### Color

| Role | Token | Value | Use for |
|---|---|---|---|
| bg | `--bg` / `--white` | `#ffffff` | page, cards on tint, inputs |
| text | `--ink` | `#0a0a0a` | headings, body, primary buttons, tags |
| text-2 | `--ink-2` | `#2b2925` | paragraph text inside panels |
| text-muted | `--muted` | `#67635d` (about 6:1 on white, 5.5:1 on tint) | secondary text, mono labels |
| faint | `--faint` | `#c9c4bb` | decorative markers, statement words before they light up |
| border | `--line` | `#e8e3d9` | hairlines, list rules |
| panel | `--tint` / `--tint-2` | `#f6f3ee` / `#ede7dc` | panels, secondary buttons, hover |
| grid | `--grid` | `rgba(10,10,10,.055)` | the 44px panel grid |
| accent | `--gold` | `#c9a96e` | fills only, with ink on top: highlight cell, active markers, glyph pixels, rail |
| accent-pale | `--gold-pale` | `#f3ead9` | the proof panel, hover cell |
| accent-text | `--gold-deep` | `#8a6c35` (4.9:1 on white) | numerals in the contact promise, success tick |
| night | `--night` | `#0a0a0a` | footer, dark bar |
| on-night | `--white`, `--on-night-muted` `.64`, `--on-night-faint` `.55`, `--on-night-line` `.14` | | footer text and rules |
| error | `--error` | `#b3261e` | form errors only |
| depth | `--shadow-shot` | | product screenshots only |
| scrim | `--scrim` | `rgba(10,10,10,.45)` | behind the plans sheet |

Gold never appears as text on white. Dark mode: none (light only, as on the product pages).

### Type

Families: `Inter Tight` 400/500 for everything; `Geist Mono` 400 for tags, labels and meta.
Loaded from Google Fonts with the preload/noscript pattern. No serif on this surface.

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| h1 | `clamp(2.85rem, 9.4vw, 6.75rem)` / 0.98 | 400 | -0.045em | hero only |
| display | `clamp(2.6rem, 6.4vw, 4.75rem)` / 1 | 400 | -0.045em | contact headline |
| h2 | `clamp(2rem, 5vw, 3.5rem)` / 1.04 | 400 | -0.035em | section titles |
| statement | `clamp(1.625rem, 3.7vw, 3rem)` / 1.16 | 400 | -0.03em | the one statement paragraph |
| h3 | 1.375rem to 2rem / 1.2 | 400 | -0.02em to -0.03em | card, step and plan titles |
| lead | 1.0625rem / 1.55 | 400 | -0.005em | intros |
| body | 1rem / 1.5 | 400 | -0.005em | paragraphs |
| mono | 11px / 1.3, uppercase | Geist Mono 400 | 0.08em | tags, labels, meta |
| button | 15px (14px in the bar) | 500 | -0.005em | buttons, sentence case |

### Space, shape, depth

- Gutters `clamp(16px, 4vw, 40px)`; section padding `clamp(72px, 10vw, 136px)`; max width
  1320px; panels and cards sit 6px apart (the "rack" gap). Grid cell 44px.
- Radii: none. Every corner is square (the GL mark included).
- Depth: flat panels. The only shadow is `--shadow-shot`, on real product screenshots.
- Translucency: the top bar only (white 86% with blur), because content scrolls under it.

### Motion

All motion is gated on `prefers-reduced-motion: no-preference` (the `.motion` class) and uses
`transform`, `opacity` or `clip-path`. Easing `--ease: cubic-bezier(.2, .7, .2, 1)`.

- Wayfinding: the bar's brand name rolls to the current section ("02 How it works"), in the
  scroll direction. Without motion it still updates, instantly.
- Section openings: tags wipe in and decode from mono noise (about 0.6s); headings rise out of a
  mask line by line (1s, 90ms stagger); blocks fade up 16px once.
- Scroll-linked: the statement paragraph darkens word by word (accepted trade-off: words not
  yet reached sit at `--faint`; the whole paragraph is ink by the time it reaches mid-screen, and
  always ink with reduced motion); striped spacers build step by
  step; the Services and proof panels open from a slight inset; the steps rail fills.
- Hints (one-time, finite): the hero "Scroll" drip runs 3 times; the other service tabs nudge
  twice when first seen and stop on any interaction.
- Pointer (mouse only): the grid cell under the cursor lights in gold-pale; glyph pixels shrink
  on hover; the hero screenshot leans away from the cursor by a few pixels (lerp 0.12).
- Scrolling: mouse-wheel input glides to its target (lerp 0.1, settles in about 0.6s).
  Touch, keyboard, scrollbar and links stay native and interrupt a glide. In-page links scroll
  smoothly.
- FAQ answers slide open; the footer wordmark rises letter by letter.
- The plans sheet slides up (`--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1)`, 0.5s), the scrim
  fades in, and its cards rise in after it with a 60ms stagger.
- Never: loaders, custom cursors, auto-advancing carousels, looping animation, scroll-jacking on
  touch, input blocked during motion.
- Reduced motion: everything above is off except the section name, which swaps without moving.

### Breakpoints

Mobile-first. Base styles target 375px; then `min-width: 640px`, `720px` (bar email link),
`960px` (two-column layouts, floating tabs) and `1200px` (the hero card floats over the window).

## Components (Direction C)

| Component | Rule |
|---|---|
| Top bar | Square black GL mark + rolling name/section, section nav from 960px, "Email us" from 720px, one black "Free preview" button. Sticky, translucent white, hairline after scroll; dark over the footer. |
| Button | Square, 44px min (52px submit), label left and a small triangle right. Primary ink; secondary `--tint` (white on tinted cards). Hover darkens, triangle nudges 3px, press scales 0.985. Focus: 2px ink ring, 3px offset (gold on night). Disabled 0.6 opacity. |
| Section tag | Black box, white mono uppercase, gold `::` prefix. Every section starts with one. |
| Tinted panel | `--tint` on the 44px grid. Hero stage, services visual. |
| Glyph | 5×5 square pixels from a pattern string (0 off, 1 ink, 2 gold). Large in Services, mini (4px) as card icons. |
| Facts row | Four tinted cells under the hero; exactly one gold. Real terms only. |
| Services | Tab list (ARIA tabs, arrow keys) floating top-left on the panel, detail card bottom-right with deliverables and one button. Stacks on phones. |
| Steps | Sticky side list with a gold rail (from 960px) beside tinted step rows; mono step number and terms. |
| Plans sheet | Native modal `<dialog>` at `#plans`, opened by any link to `#plans` (bar nav, after the steps, footer). Slides up from the bottom (`--ease-sheet`, 0.5s) over a `--scrim`, stopping below the bar on desktop and 12px from the top on phones; sticky header with the Plans tag and a Close button; Esc, Close or a click on the scrim dismisses it. Three plan cards (tint) with price, "Good for" checks and one button each, a gold-pale Care plan row, and an "Every plan includes" list. A plan's button closes the sheet, ticks that project type in the form and moves focus to Name. Page scroll is locked while open. |
| FAQ | Rows split by hairlines, square black plus/minus icon, one open at a time. |
| Hero example | Two examples drawn in HTML inside the hero window, switched by a two-button control in the Free preview card: a property-company homepage ("Your Company", listings, "Book a viewing") and a booking system (inquiries marked new, replied or booked, beside a weekly schedule). Each is `role="img"` with a descriptive label; the hidden one is `aria-hidden`. No invented prices or names. Replace with a real client screenshot (Coral Way demo) when one is live. |
| Input | Mono label above; required fields marked with `*` and a "* Required" note; white field on the tinted form panel, no radius, 46px min, 16px text; focus ink border; error border and message in `--error`. Radio options are square cells that invert to ink when chosen. |
| Footer | Night. Three columns (Services, This page, Contact) with white mono label bars, a status line with a gold square, the giant "GapLee" wordmark, legal line. |
| Form states | Idle; sending ("Sending…", disabled); success (tick draws in, names their email); error (message plus a mailto link). |

## Voice (Direction C)

- Sounds like: a small, competent local studio. Plain, specific and short. Explains the process
  (free preview, fixed scope, 50/50) and doesn't lean on adjectives.
- Use: "you" and "we", concrete deliverables (website, inquiry form, booking, dashboard), "free
  preview".
- Leave out: the business registration, and any other detail that doesn't help a visitor
  decide or act. The region appears only in the footer legal line and structured data. The one
  exception is the payment FAQ's line about BIR-registered invoices, which corporate buyers need.
- Banned words: elevate, seamless, unlock, supercharge, revolutionize, cutting-edge,
  game-changer, effortless, delve, robust, empower, leverage, "world-class", "solutions" on its
  own, "in today's fast-paced world".
- No invented stats, testimonials, logos, quotes or "trusted by" lines. No usage numbers for the
  GapLee product.

## Anti-slop

### Banned by default

Visual
- Purple-to-blue (or any rainbow) gradients, gradient text, glowing blobs behind the hero.
- Emoji used as icons or bullet points.
- Three identical feature cards in a row with an icon, a title and two lines each.
- Glass blur on everything. Translucency only where something sits over moving content.
- Everything centered. Center only short, deliberate moments (a hero line, an empty state).
- Huge soft drop shadows, and the same large radius on every element.
- More than one accent color, or accent color used for decoration instead of meaning.
- Default icon set at default stroke and size, mixed with icons from another set.
- Decorative stock illustrations, 3D blobs, abstract "tech" art that says nothing.
- Fake browser chrome or fake phone frames around nothing real.
- Dark mode that's just inverted, with pure black and pure white.

Content
- Lorem ipsum or placeholder copy in anything shown to the user.
- Invented numbers ("10,000+ users"), testimonials, client logos, or awards.
- Hero copy that could describe any product ("Build the future of work").
- Banned words: see Voice.
- Headings in Title Case Everywhere when the house voice is sentence case.

Layout
- Sections that all have identical padding and the same structure top to bottom.
- Walls of cards where a list or table would read faster.
- Text set wider than ~75 characters per line.
- Buttons with no pressed, focus or disabled state.

### Project-specific bans (Direction C)

- No edtech nav, product mockups, "Try it on your class" or "Open Platform" CTAs.
- No copying of another company's art, copy, palette, logos or testimonials.
- No rounded corners, pills or a second accent color.
- Gold never appears as text on white.
- No color values outside the token block.
- Browser chrome only around a real screenshot of our own product, or around the hero's HTML
  example preview, which is labelled "Pictured: an example preview" and names no real business.
- No education-product wording (alt text included); this page sells client work.

### Done checks

- [ ] Only color tokens from the `:root` block are used.
- [ ] Screenshots taken at 375 px and desktop width (light only), and looked at.
- [ ] One clear primary action per screen; hierarchy reads in a 3-second squint test.
- [ ] Real content throughout; nothing invented.
- [ ] Contrast: body 4.5:1, large text and UI parts 3:1. Visible focus ring.
- [ ] Touch targets 44 px on web.
- [ ] Loading, empty and error states exist and look designed.
- [ ] Worst-case data tried (`break-ui`): long names, long messages, long company names.
- [ ] Motion respects reduced motion and never blocks input.
- [ ] Nothing from "Banned by default" appears.
- [ ] HIG Compliance Auditor run, if installed.

---

## Direction A: GapLee product pages (recorded as-is, parked 2026-11-28)

Captured from the inline `:root` blocks of the seven product pages and screenshots of
`index.html` and `institutions.html`. The services work changes only their footers.

- Color: canvas `#f5f1ea`, paper `#ffffff`, mid `#ede8df`, ink `#0a0a0a`, ink-soft `#1a1814`,
  muted `#6b6762`, border `#e4e0d8`, gold `#c9a96e`, gold-deep `#8a6c35`, gold-pale
  `rgba(201,169,110,0.12)`. Status: success `#1a7a4a`, warning `#d97706`, error `#b91c1c`.
- Type: Manrope 400–800 for text and headings (800, tracking -0.04em); DM Serif Display italic
  for accent phrases. Eyebrows 0.7rem 800 uppercase in gold-deep.
- Shape: pill buttons, cards at 16–24px radius, blurred sticky canvas nav, ink-soft footer.
- Motion: `cubic-bezier(0.22, 1, 0.36, 1)`, 150ms / 250ms, hover lifts.
- Light only.

### Proposed fixes to the product pages (flagged, not applied)

1. `--muted` is `#6b6762` on index, institutions and use, but `#9a9690` on pricing, compliance,
   custom-build and integration. `#9a9690` is 2.6:1 on canvas and fails for text.
2. Font variables are `--serif`/`--sans` on some pages and `--font-display`/`--font-body` on
   others.
3. Small text at `rgba(10,10,10,0.45)` (3.1:1), footer links at `rgba(255,255,255,0.35)`
   (3.2:1) and the footer copyright at 0.2 (1.9:1) fail 4.5:1.
4. Gold-deep eyebrows on canvas are 4.4:1, just under 4.5:1.
5. No page has a `prefers-reduced-motion` rule (the hero dot pulses forever).
6. Twelve border-radius values and nine breakpoints across pages.

---

## Skills lineup

Lead: `design-taste-frontend`, because `/services` is a public marketing page. Assists:
`apple-design` (house style), `animate` (motion), `mobile-native` (phone-first visitors),
`break-ui` (the form). Critique the finished page against this file with `impeccable`.

## Decision log

- 2026-11-25: Direction A recorded in capture mode from the existing product pages.
- 2026-11-25: Christian chose to restyle `/services` only, after his personal portfolio, and
  leave the product pages unchanged. Direction B drafted from `christian-baquilid` with GapLee's
  logo and gold as the single accent. Light only.
- 2026-11-25: Christian approved and locked Direction B ("Lock and build").
- 2026-11-26: Christian found the B page plain and unfocused and asked for the portfolio's
  scrolling feel plus the Laws of UX. A pinned sideways timeline, scroll-linked band and
  hairline links were added (draft 2). He then rejected pills, generic patterns and outlined
  containers, found the hero empty and the page suffocating; a three-section draft was tried
  and reverted to draft 2 at his request.
- 2026-11-26: Christian asked to copy baseten.co's design and to go through its other pages for
  layout variations. Direction C written: Baseten's layout system (square, mono tags, grid
  panels, tabs over a panel, sticky side list, plan cards, FAQ rows, giant-wordmark footer) in
  GapLee's own colors and copy, without Baseten's art, copy, palette, logos or testimonials.
  About folded into the FAQ.
- 2026-11-26: Christian asked for a minimalist two-tone logo on this page: square black mark,
  white "GL" in Inter Tight, used in the bar and as `/services/favicon.svg`. `/logo.svg` and the
  product pages keep the original mark.
- 2026-11-26: Christian asked for more animation, hints and section-to-section transitions; the
  motion list above was added. He approved it ("Feels right") and asked for scrolling with a
  bit of resistance; mouse-wheel smoothing (lerp 0.1) was added, touch left native.
- 2026-11-26: Christian cut unnecessary details: no DTI registration, no Taguig City, Metro
  Manila or Philippines anywhere on the page (title, description and structured data included).
  Also removed the repeated business-details table in the FAQ, the footer Business column, the
  mono term labels on the steps (they repeated the step text) and the duplicate gaplee.space
  label on the proof card. The footer now has three columns.
- 2026-11-26: Christian cut the two plan cards under the steps ("Before you pay" / "When you go
  ahead"); they repeated steps 1 to 3. The terms now appear in the facts row, the steps, the FAQ
  and the contact promise list.
- 2026-11-26: Christian asked for a plans view "like a pop up" so visitors can see what a plan
  looks like. Added the plans sheet at `#plans` (three plans, Care plan, what every plan
  includes). Prices read "Fixed quote, set after your free preview" until Christian supplies
  numbers; no prices are invented.
- 2026-11-27: Fixes from an outside review: rewrote the proof screenshot's alt text (it
  described the education product); replaced the duplicate hero screenshot with an HTML example
  of a business homepage (the Coral Way demo replaces it when live); renamed "Our work" to "Our
  product" in the nav, footer and section indicator; Care plan price reads "Quoted per project";
  required form fields marked, and a privacy line by the submit button ("We'll only use your
  details to reply to your inquiry."); spaces added between adjacent text elements so the page
  reads cleanly as plain text ("See it before you pay", list items, prices).
- 2026-11-28: From a second outside review (Gemini), with Christian's answers: the hero now
  switches between a website example and a booking-system example so it speaks to small
  businesses broadly, not only real estate; the three service descriptions are rewritten around
  what the client gets; the free preview is described as "a clickable one-page concept with your
  brand, usually within 2 business days of getting your details" (pending Christian's final
  word). Kept on purpose: "Fixed quote" instead of starting prices, the Gmail address until a
  domain address exists, and no city or region. The hero card sits below the window under 960px.
- 2026-11-28: /services contact address changed from the Gmail address to hello@gaplee.space
  (Cloudflare Email Routing forwards it). Christian asked for a business card and a digital
  card. The printed card (3.5 x 2 in, 0.125 in bleed) is a black front with the GapLee wordmark
  and a white back with name, Founder, email, web and phone. The digital card is a new page at
  /card/ in Direction C: the card front on a tinted grid panel, name and role, "Save contact"
  (a vCard at /card/christian-baquilid.vcf) and "Share this card", then phone, email and web
  rows. It is noindex, so it is shared by link rather than found by search. /card redirects to
  /card/ like /services.
- 2026-11-28: Fixes from a third outside review (Gemini, of the live page), checked against the
  code first. Hero window from 960px moved from `left 34%, width 84%` to `left 32%, width 66%`,
  so the example's header (Listings, About, Contact, Inquire) and all five booking-grid columns
  sit inside the stage. That alone left the Free preview card covering most of the window at
  960-1199px, so the card now floats over the window's lower-left corner only from 1200px and
  sits under the window below that (as on tablets); from 640px the window is `left 6%, width
  88%` so it no longer runs off the right edge. Phones keep the window bleeding off the right.
  Christian reversed the 2026-11-26 no-location rule for two places only: the footer legal line
  reads "GapLee Information Technology Services · Metro Manila, Philippines" and the structured
  data has `areaServed: Metro Manila, Philippines`. Sitemap priority: /services/ 1.0, root 0.8.
  robots.txt was already correct; no `Disallow` for previews (they live off-site and carry
  noindex).
- 2026-11-28: Christian's answers on the rest of that review. Prices stay "Fixed quote" (the
  suggested PHP 30,000 / 45,000 anchors were judged too low for corporate prospects; revisit once
  the first client quote is set). The payment FAQ adds "you'll receive an official BIR-registered
  invoice for each payment". Ownership is kept apart from hosting so no one reads it as free
  hosting: "Every plan includes" says "You own your domain and the finished site once it's paid
  in full"; the Care plan and its FAQ say you can cancel anytime and we hand over your files;
  its price note reads "Billed monthly, cancel anytime". The teacher product is parked: `/`
  temporarily redirects (302) to `/services/` in `vercel.json` and the root is out of the
  sitemap, until the company homepage replaces it at `/`.
- 2026-11-28: GapLee is now the business name of the web and IT services company, and the
  teacher product is parked until it relaunches under a new name. Christian approved this URL
  plan: the `/services/` page (Direction C, unchanged) becomes the homepage at `/`;
  `/services`, `/services/` and anything under it 301 to `/`; the seven product pages and
  `skillgap-overview.pdf` go offline and 301 to `/`; their files, the product logos and the
  product screenshots are kept in `_parked/product/`, which `.vercelignore` keeps out of
  deploys. The "Our own product" section (and its nav, footer and wayfinding entries) is removed
  until a real client project, the Coral Way demo first, can take its place; the footer's
  gaplee.space link went with it. The FAQ keeps the BIR-registered invoice line (Christian
  confirmed it). Favicon, touch icon and share image moved from `/services/` to the root. The
  temporary 302 from `/` to `/services/` is gone. Canonical, `og:url` and structured data point
  to `https://www.gaplee.space/`; the sitemap lists only `/`. `/card/` and its vCard now link to
  the homepage.

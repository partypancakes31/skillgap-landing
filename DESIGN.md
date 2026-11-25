# DESIGN.md: GapLee (gaplee.space)

Status: Locked (2026-11-25)
House style: Apple (restraint, whitespace, clear hierarchy, few colors, calm motion)

The site has two surfaces with two directions:

| Surface | Direction | Status |
|---|---|---|
| Product pages (`index`, `institutions`, `pricing`, `use`, `compliance`, `custom-build`, `integration`) | **A. GapLee product** ("Ink, Canvas & Gold"), captured as-is | Recorded, not to be changed by the services work |
| `/services` (later `services.gaplee.space`) | **B. GapLee Services** ("Monochrome editorial"), adapted from Christian's portfolio (`C:\dev\christian-baquilid`) | Locked 2026-11-25 |

---

## Brief (`/services`)

- What it is: the client-work page of GapLee Information Technology Services, a DTI-registered
  sole proprietorship in Taguig City. Sells business websites, inquiry and booking systems, and
  custom tools.
- Who it's for: owners and staff of small and mid-size businesses in Metro Manila (for example a
  real estate company). Most visit on a phone.
- The one thing a visitor must do: send an inquiry through the contact form ("Get a free
  preview").
- Feel: precise, quiet, confident. It should read as a web studio, not an edtech product.
- Content we have: the handoff copy, the GapLee logo (`/logo.svg`), the contact email
  (gapleeco@gmail.com), and the live product at gaplee.space as proof of work.
- Content still missing (Christian supplies later): case studies, client screenshots. The Work
  section stays omitted until then; nothing is invented to fill it.
- Constraints: static HTML in the existing repo, no build step, no new packages. The page
  carries its own inline CSS and fonts so it can move to a subdomain unchanged. Light only.
  English. The repo is public.

## References

| Reference | Take this | Not this |
|---|---|---|
| christian-baquilid portfolio (`C:\dev\christian-baquilid`, viewed locally 2026-11-25) | White page, near-black ink, `#6b6b6b` muted text, `#e4e4e0` hairlines; Inter Tight 500 headlines with very tight tracking and one thin Newsreader word; numbered sections; black full-bleed bands; 28px panels; pill buttons; hairline "link-line" text links | Loading screen, custom dot cursor, word-by-word title reveals, marquee band, resume framing |
| Christian Builds (`C:\dev\portfolio`) | Same system; confirms it works for a business audience (index menu, prices, FAQ) | Mango highlight color, the stacked design-style gallery |
| gaplee.space product pages | Logo (dark tile, cream "G", gold "L"), the gold `#c9a96e`, the `/api/contact` form wiring and honeypot | Cream canvas, DM Serif headings, product mockups and CTAs |

## Direction B: GapLee Services, monochrome editorial

The page borrows Christian's portfolio system: white, ink and hairlines, big medium-weight
headlines with tight tracking, and one thin serif word per headline for voice. Numbered
sections and black full-bleed bands set the rhythm. GapLee's identity stays through the logo,
the business name and legal line, and gold as the only accent, which appears on black and in the
focus ring. Doing this separates client work from the edtech product without looking like a
different company. Accepted trade-off: `/services` won't match the cream product pages, so the
logo, name and footer line carry the family resemblance.
Options considered: A as-is (rejected: reads as edtech), Christian Builds with mango (rejected:
a second accent and a competing personal brand).

## Tokens (`/services`)

Source of truth in code: the `:root` block at the top of `services/index.html`.

### Color

| Role | Token | Value | Use for |
|---|---|---|---|
| bg | `--bg` | `#ffffff` | page background |
| surface | `--card` | `#f3f3f1` | panels, form fields' resting fill |
| text | `--ink` | `#0a0a0a` | headings, body, primary buttons |
| text-muted | `--muted` | `#6b6b6b` (5.3:1 on white, 4.8:1 on `--card`) | secondary text, labels |
| border | `--line` | `#e4e4e0` | hairlines, field borders |
| night | `--night` | `#0a0a0a` | full-bleed bands, footer |
| on-night | `--on-night` | `#ffffff`; muted `rgba(255,255,255,0.6)` (7.3:1) | text on night |
| accent | `--gold` | `#c9a96e` | **on night only** (8.9:1): step numerals, one word, links on hover |
| accent-on-light | `--gold-deep` | `#8a6c35` (4.9:1 on white) | focus ring, nothing else on white |
| positive / danger | `--success` `#1a7a4a` / `--error` `#b91c1c` | | form status only |

Dark mode: none. The black bands are part of the design, as on the portfolio.

### Type

Families: `Inter Tight` (400, 500) for everything; `Newsreader` (200, opsz) only for one
thin word inside large headlines. Loaded from Google Fonts with the site's preload/noscript
pattern. No other fonts.

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| display | `clamp(2.75rem, 11vw, 6.5rem)` / 0.92 | 500 | -0.05em | hero H1 only |
| h2 | `clamp(2.5rem, 8vw, 4.5rem)` / 0.95 | 500 | -0.045em | section titles |
| h3 | `clamp(1.5rem, 4vw, 2rem)` / 1.1 | 500 | -0.03em | service and step titles |
| numeral | `clamp(3rem, 8vw, 4.5rem)` / 1 | Newsreader 200 | -0.02em | 01–04 numbers |
| lead | 1.125rem (1.25rem ≥ 980px) / 1.6 | 400 | -0.01em | hero sub, section intros |
| body | 1rem / 1.6 | 400 | -0.01em | paragraphs |
| label | 0.75rem / 1.4 | 500, uppercase | 0.12em | eyebrows, field labels, meta |
| button | 0.875rem | 500 | 0 | buttons (sentence case) |

`.thin` = Newsreader 200, tracking -0.02em, one word per headline at most. Sentence case
everywhere except labels.

### Space, shape, depth

- Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96, 144. Gutters 16 (phone) / 32 (≥ 768px).
  Section padding 96 (phone) / 144 (≥ 980px). Content max width 1280px; text columns max 40rem.
- Radii: field 12px, panel 28px, pill 999px. Nothing else.
- Depth: flat. Hairlines and the black bands do the separating. No shadows.
- Translucency: the top bar only, `rgba(255,255,255,0.8)` with 16px blur, because content
  scrolls under it.

### Motion

- Durations: fast 150ms (color), base 300ms (button press, link-line), reveal 700ms.
- Easing: `--ease-out: cubic-bezier(0.2, 0.7, 0.2, 1)`.
- What moves: sections fade up 16px once as they enter (only with JS on and no reduced
  motion), the link-line underline grows on hover, buttons scale to 0.97 when pressed.
- What never moves: the hero (visible at first paint), text inside headlines, form fields. No
  loader, no custom cursor, no word reveals, no marquee, no replays.
- Reduced motion: no reveals, no smooth scroll, no transforms.

### Breakpoints

Mobile-first. Base styles target 375px; then `min-width: 768px` and `min-width: 980px`.

## Components (`/services`)

| Component | Rule |
|---|---|
| Top bar | Logo tile + "GapLee IT Services" on the left, one "Contact" pill on the right. Sticky, translucent white, hairline bottom border after scroll. No product links. |
| Button | Primary: ink pill, white label, 48px tall, optional arrow. Secondary: text link with link-line underline. Pressed: scale 0.97. Focus-visible: 2px `--gold-deep` ring, 3px offset (gold on night). Disabled: 0.5 opacity. Loading: "Sending…", disabled. One primary per section. |
| Section head | Label (`01 / Services`) in muted, then h2 with at most one `.thin` word, then an optional lead paragraph. |
| Service row | Not three identical cards: a numbered list split by hairlines. Number left, title and one paragraph right, deliverables as a short muted line. |
| Steps | On a night band: 4 rows on phone, 4 columns from 980px. Gold Newsreader numeral, h3, one line. |
| Panel | `--card` fill, 28px radius, 24px (phone) / 40px padding. Used for the "Built by the team" note and the form. |
| Input | Label above (label token). White field, 1px `--line`, radius 12px, 16px font (no iOS zoom), min height 48px. Focus: ink border + gold-deep ring. Error: `--error` border, message below in `--error`. |
| Footer | Night band. Legal line, email link, link back to gaplee.space. Muted text at 0.6 white. |
| Form states | Idle; sending (button disabled, "Sending…"); success (the panel swaps to a thank-you naming the email they gave); error (message plus a mailto link to gapleeco@gmail.com). |

## Voice (`/services`)

- Sounds like: a small, competent local studio. Plain, specific and short. Explains the process
  (free preview, fixed scope, 50/50) and doesn't lean on adjectives.
- Use: "you" and "we", Metro Manila, concrete deliverables (website, inquiry form, booking,
  dashboard), "free preview".
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

### Project-specific bans (`/services`)

- No edtech nav, product mockups, "Try it on your class" or "Open Platform" CTAs.
- No loader, custom cursor, word-by-word reveals or marquee (portfolio effects left behind).
- Gold never appears as text on white.
- No mango yellow or any second accent.
- No hex, px or ms values outside the token block.

### Done checks

- [ ] Only tokens from DESIGN.md are used (no stray hex, px or ms values).
- [ ] Screenshots taken at 375 px and desktop width (light only, see Decision log), and looked at.
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

## Direction A: GapLee product pages (recorded as-is)

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
`apple-design` (house style), `mobile-native` (phone-first visitors), `break-ui` (the form).
Critique the finished page against this file with `impeccable`.

## Decision log

- 2026-11-25: Direction A recorded in capture mode from the existing product pages.
- 2026-11-25: Christian chose to restyle `/services` only, after his personal portfolio, and
  leave the product pages unchanged. Direction B drafted from `christian-baquilid` with GapLee's
  logo and gold as the single accent. Light only.
- 2026-11-25: Christian approved and locked Direction B ("Lock and build").

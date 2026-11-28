# gaplee.space

Company site of GapLee Information Technology Services, live at https://www.gaplee.space.
Static HTML, no build step. Hosted on Cloudflare Pages.

## Layout

| Path | What it is | Published? |
|---|---|---|
| `site/` | Everything the public sees: `index.html` (homepage), `card/` (digital business card), `404.html`, icons, `robots.txt`, `sitemap.xml` | Yes, this is the Pages output folder |
| `site/_redirects` | 301s from the old `/services/` and product URLs to `/`, and `/card` to `/card/` | Read by Pages |
| `site/_headers` | Security headers for every page; `noindex` on the `*.pages.dev` copies | Read by Pages |
| `functions/api/contact.js` | `POST /api/contact`, sends the inquiry form through EmailJS | Runs as a Pages Function |
| `wrangler.toml` | Pages project name and output folder | Config |
| `DESIGN.md` | Design direction, tokens and decision log | No |
| `_parked/` | The parked teacher product pages | No |

## Deploy

Pushing to `master` deploys to production through the Pages project's GitHub connection.
Other branches get preview URLs at `https://<branch>.gaplee-site.pages.dev`.

To deploy by hand instead (from the repo root, logged in with `npx wrangler login`):

```sh
npx wrangler pages deploy
```

To run it locally with the same redirects, headers, 404 page and `/api/contact` function:

```sh
npx wrangler pages dev
```

The contact function needs `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` and `EMAILJS_PUBLIC_KEY`
in the Pages project (Settings > Variables and Secrets). Locally, put them in a `.dev.vars` file,
which is git-ignored.

## Domain and email

The domain is registered at Vercel; its DNS is on Cloudflare. `www.gaplee.space` is the canonical
host and `gaplee.space` redirects to it. Mail for `hello@gaplee.space` goes through Cloudflare
Email Routing: don't remove the MX, SPF (`TXT @`), DKIM (`cf2024-1._domainkey`) or DMARC
(`_dmarc`) records, or the `google-site-verification` TXT record used by Search Console.

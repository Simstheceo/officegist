# OfficeGist web (V1)

Next.js 14 (App Router), plain JavaScript, no UI library. Talks to `officegist-backend`.

## Run it

```bash
# 1. API (in ../officegist-backend): set APP_ORIGIN=http://localhost:3000 and TRUST_PROXY=1, then npm start
# 2. Web
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

## How it fits together

- **Same-origin API proxy.** `next.config.mjs` rewrites `/api/*` to the API. The session cookie stays first-party and the API's CSRF origin check sees this site's origin, so the API's `APP_ORIGIN` must equal this site's URL. Set the API's `TRUST_PROXY=1` so rate limits see real client IPs (otherwise everyone shares the proxy's IP).
- **SEO pages are server-rendered** with `generateMetadata`, canonical URLs and JSON-LD: `/companies/[slug]`, `/salaries/[slug]`, `/interviews/[slug]` (company or role), `/best-companies/nigeria`, plus `robots.txt` and `/sitemap.xml` (proxied from the API). Interactive pieces are small client components.
- **Empty states are designed**, because the app starts with no reviews. Salary pages explain the minimum-reports rule instead of showing nothing.

## Pages

| Route | Notes |
|---|---|
| `/` | hero search with autocomplete, trending, gist, salaries, interviews, CTA |
| `/companies`, `/companies/[slug]` | list/search/filter; profile with rating breakdown, recommend ring, reviews, sort, helpful/report, save, claim link |
| `/gist` | category filter, composer, like/save/report, load more |
| `/salaries`, `/salaries/[slug]` | median, range, by-company table, privacy threshold messaging |
| `/interviews`, `/interviews/[slug]` | common questions + experiences |
| `/contribute` | 8-step review flow (progress bar, per-step validation, work-email verification) |
| `/contribute/salary`, `/contribute/interview` | single-page forms |
| `/sign-in`, `/me`, `/verify` | auth, dashboard (contributions, saved, notifications, verification, settings), email confirm |
| `/claim/[slug]` | employer claim request |
| `/admin` | stats, moderation queue (approve / needs edit / reject), reports, claims, audit log |

## Not verified / not built

- **Never built or run with Next.js** in the environment I worked in (no network to install it). I checked that all 38 files parse, every import resolves, no server file uses client-only hooks, and every API call matches a real backend route. Expect a first `npm run dev` to surface a few small issues.
- Not built: gist comment threads (API exists), password reset UI, social sign-in, employer response UI, edit-and-resubmit screen for `NEEDS_EDIT` items (API exists), industry and location landing pages, image/logo upload, tests.
- Default fonts load from Google Fonts at build time (`next/font`).

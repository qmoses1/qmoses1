# insurance-brokerage — "Coverage, Plain English" portal

Multi-journey insurance site on Cloudflare Workers (static assets + a small Worker).
Journeys: /health (geo-personalized CA/TX/other), /life (questionnaire -> Term/Whole/Annuity),
/business, /medicare (education + interest list). /articles = SEO library.

## Deploy
Cloudflare -> Workers & Pages -> Create -> Connect to Git -> this repo. No build step.
Every push to main auto-deploys.

## APIs (src/worker.js)
- GET /api/geo — visitor state from request.cf (free geo personalization)
- POST /api/lead — lead capture -> D1 (stage 2). Until the DB binding is enabled the
  API returns fallback:true and forms show a direct booking link (no lead lost silently).

## Stage 2 — lead database (D1)
Create D1 db "leads", run schema below, then uncomment d1_databases in wrangler.jsonc:
  CREATE TABLE leads (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT, journey TEXT,
  product_segment TEXT, geo_state TEXT, first_name TEXT, last_name TEXT, email TEXT,
  phone TEXT, zip TEXT, enrolled TEXT, consent INTEGER, source TEXT);

## GA4
Set the real G- ID in public/ga.js (one line) — applies site-wide.

## Compliance (every page)
True-name branding (Quentin Moses), NPN 9877170 + TX 1475793 + CA 0F93140, non-affiliation,
comp disclosure, education-not-advice, accurate post-2026-subsidy claims, supplements never a
replacement for major medical, Medicare page = education/interest-list only (no plan marketing),
Covered California canonical disclaimer on homepage. Answer-first + FAQ JSON-LD content rules.

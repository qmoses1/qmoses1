#!/usr/bin/env node
/**
 * Minimal Dub.co helper for creating short links that measure traffic sources.
 * Zero dependencies — requires Node 18+ (global fetch).
 *
 * Auth: set DUB_API_KEY in the environment (or a .env file loaded by your runner).
 *
 * Usage as a module:
 *   import { createShortLink, getClicks } from "./dub.js";
 *   const link = await createShortLink({
 *     url: "https://myinsurancesite.com/quote",
 *     source: "facebook",
 *     campaign: "life-quote-v2",
 *   });
 *   console.log(link.shortLink); // e.g. https://dub.sh/abc123
 *
 * Usage as a CLI:
 *   node dub.js https://myinsurancesite.com/quote --source facebook --campaign life-quote-v2
 */

const API_BASE = "https://api.dub.co";

function apiKey(explicit) {
  const key = explicit ?? process.env.DUB_API_KEY;
  if (!key) throw new Error("DUB_API_KEY is not set");
  return key;
}

async function request(method, path, { key, body, query } = {}) {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey(key)}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Dub API ${method} ${path} failed: ${message}`);
  }
  return data;
}

/**
 * Create (or idempotently reuse) a short link.
 *
 * Uses PUT /links/upsert keyed on the destination URL, so repeated calls —
 * e.g. from test runs — return the same link instead of piling up duplicates.
 *
 * @param {object} opts
 * @param {string} opts.url        Destination URL (required).
 * @param {string} [opts.source]   Traffic source, e.g. "facebook". Sets utm_source and adds a tag.
 * @param {string} [opts.campaign] Campaign name. Sets utm_campaign.
 * @param {string} [opts.medium]   Sets utm_medium.
 * @param {string[]} [opts.tags]   Extra Dub tag names (created on the fly).
 * @param {string} [opts.domain]   Short domain; defaults to your workspace default (dub.sh on free plans).
 * @param {string} [opts.slug]     Custom back-half for the short link.
 * @param {string} [opts.externalId] Your own stable ID for the link (lookup key for analytics).
 * @param {boolean} [opts.isTest]  Adds a "test" tag so test-run links are filterable in analytics.
 * @param {string} [opts.key]      API key override (defaults to DUB_API_KEY env var).
 * @returns {Promise<object>}      The Dub link object; .shortLink is the full short URL.
 */
export async function createShortLink({
  url,
  source,
  campaign,
  medium,
  tags = [],
  domain,
  slug,
  externalId,
  isTest = false,
  key,
}) {
  if (!url) throw new Error("url is required");
  const tagNames = [...tags];
  if (source && !tagNames.includes(source)) tagNames.push(source);
  if (isTest && !tagNames.includes("test")) tagNames.push("test");
  return request("PUT", "/links/upsert", {
    key,
    body: {
      url,
      domain,
      key: slug,
      externalId,
      tagNames: tagNames.length ? tagNames : undefined,
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
    },
  });
}

/**
 * Fetch click counts, grouped so you can compare traffic sources.
 *
 * @param {object} [opts]
 * @param {string} [opts.groupBy]    e.g. "tags" (compare sources), "timeseries", "referers", "countries".
 * @param {string} [opts.interval]   "24h" | "7d" | "30d" | "90d" | "1y" | "all" (default "30d").
 * @param {string} [opts.tagNames]   Filter to a tag, e.g. one traffic source.
 * @param {string} [opts.externalId] Filter to one link by your external ID (prefix "ext_" is added).
 * @param {string} [opts.key]        API key override.
 */
export async function getClicks({ groupBy, interval = "30d", tagNames, externalId, key } = {}) {
  return request("GET", "/analytics", {
    key,
    query: {
      event: "clicks",
      groupBy,
      interval,
      tagNames,
      externalId: externalId ? `ext_${externalId}` : undefined,
    },
  });
}

// ---- CLI ----------------------------------------------------------------

function parseArgs(argv) {
  const args = { tags: [] };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--test") args.isTest = true;
    else if (a === "--tag") args.tags.push(argv[++i]);
    else if (a.startsWith("--")) args[a.slice(2)] = argv[++i];
    else positional.push(a);
  }
  args.url = positional[0];
  return args;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    console.error(
      "Usage: node dub.js <url> [--source <src>] [--campaign <name>] [--medium <med>]\n" +
        "                       [--slug <back-half>] [--domain <domain>] [--externalId <id>]\n" +
        "                       [--tag <name>]... [--test]"
    );
    process.exit(1);
  }
  createShortLink(args)
    .then((link) => {
      console.log(link.shortLink);
      console.error(`  id: ${link.id}  tags: ${(link.tags ?? []).map((t) => t.name).join(", ") || "-"}`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

# Project notes for Claude

## Dub.co short links (traffic source tracking)

This repo has `dub.js`, a zero-dependency Node helper for creating short links
via the Dub API. Use it whenever short links or traffic-source tracking come up.

- Auth: `DUB_API_KEY` is set as an environment variable in the cloud
  environment config (network allowlist includes `api.dub.co`). Never commit
  the key or print more than its first few characters.
- CLI: `node dub.js <url> --source <src> --campaign <name> [--test]`
- Module: `import { createShortLink, getClicks } from "./dub.js"`
- Idempotent: upsert by fully-composed URL (UTMs embedded) — same inputs
  always return the same short link. Missing tags are created automatically.
- Test runs must pass `--test` / `isTest: true` so links are tagged `test`
  and filterable out of real traffic analytics.
- The Analytics API (`getClicks`) requires a paid Dub plan; on the free plan
  it 429s with `x-ratelimit-limit: 0`. Dashboard analytics work on any plan.
- Cloud-sandbox quirk: Node's fetch ignores the egress proxy unless you run
  with `NODE_USE_ENV_PROXY=1` (and `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`).
  Plain `curl` works without this. User-facing sites/CI don't need either.

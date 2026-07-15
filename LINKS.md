# Active tracked short links

Registry of Dub short links created with `dub.js`. One row per distribution
placement so dashboard analytics (filter by tag) cleanly separate sources.

| Short link | Destination | Source / placement | UTMs | Tags |
|---|---|---|---|---|
| [dub.sh/remote-hubs](https://dub.sh/remote-hubs) | quentindmoses.com | Anjali Kumari's LinkedIn remote-work-hub posts ([profile](https://www.linkedin.com/in/kumarianjali10)) | `utm_source=linkedin`, `utm_medium=social`, `utm_campaign=remote-work-hubs` | `LinkedIn`, `kumarianjali` |

## Notes

- **dub.sh/remote-hubs** is the link to hand to Anjali Kumari for inclusion in
  her remote-work-hub posts. Clicks from her audience show up in the Dub
  dashboard under the `kumarianjali` tag; the broader `LinkedIn` tag rolls up
  all LinkedIn placements.
- Links are upserted by destination URL (UTMs included), so re-running the
  same `dub.js` command returns the same link — safe to re-run.

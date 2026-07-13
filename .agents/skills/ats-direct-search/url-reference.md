# Greenhouse & Lever API Reference

Both endpoints below are **public, unauthenticated JSON APIs that Greenhouse and Lever
publish specifically so companies can embed their job board on their own careers page.**
This is a fundamentally different risk profile from scraping Indeed or Wellfound's
aggregator UI (both of which are hard-blocked by Cloudflare/DataDome bot detection in
this repo's testing) — these endpoints are *meant* to be fetched by arbitrary client
code, no login, no API key, no robots.txt/ToS concern of that kind.

Verified empirically (2026-07-13) against real company boards — see Notes for the
companies used.

## Greenhouse

### List a company's open jobs

```
GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs
```

`board_token` is almost always the company's lowercase slug — the same one that
appears in `boards.greenhouse.io/{board_token}` or `job-boards.greenhouse.io/{board_token}`.
Examples confirmed live: `gitlab`, `stripe`, `mongodb`, `datadog`, `elastic`, `twilio`.

Response shape:

```json
{
  "jobs": [
    {
      "id": 8503792002,
      "title": "Account Executive - Italy",
      "location": { "name": "Remote, Italy" },
      "updated_at": "2026-06-05T16:18:10-04:00",
      "first_published": "...",
      "absolute_url": "https://job-boards.greenhouse.io/gitlab/jobs/8503792002",
      "departments": [{ "name": "EMEA - Commercial" }]
    }
  ]
}
```

A **404** on this endpoint means the slug isn't a valid board token — either the
company doesn't use Greenhouse, or its token differs from the obvious slug (rare).
It is not an error condition to alarm on; the CLI tries several slug variants before
giving up on Greenhouse and falling back to Lever.

### Single job detail

```
GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}?content=true
```

`content=true` adds a `content` field with the full job description as HTML — but the
JSON string value has its tags **HTML-entity-escaped** (i.e. the string literally
contains `&lt;div&gt;...`), so it must be entity-decoded once before tag-stripping to
get readable plain text. See `decodeHtmlEntities`/`stripTags` in `cli/src/helpers.ts`.

## Lever

### List a company's open postings

```
GET https://api.lever.co/v0/postings/{company}?mode=json
```

`company` is the slug that appears in `jobs.lever.co/{company}`. Examples confirmed
live: `palantir` (276 open postings at time of testing). Some slugs return `200` with
an **empty array** (`netflix`, `lever` itself) — that means the company has a Lever
board but zero current openings, not a lookup failure. A **404** means no board at
that slug at all.

Response shape (array of postings, full descriptions included — no separate detail
call needed for a list):

```json
[
  {
    "id": "0bbfd4f4-41ff-4ec6-b73f-5200efd5d4d3",
    "text": "Administrative Business Partner - Security",
    "categories": {
      "location": "Palo Alto, CA",
      "team": "Administrative",
      "commitment": "Full-time",
      "allLocations": ["Palo Alto, CA"]
    },
    "createdAt": 1778622524938,
    "hostedUrl": "https://jobs.lever.co/palantir/0bbfd4f4-...",
    "applyUrl": "https://jobs.lever.co/palantir/0bbfd4f4-.../apply",
    "descriptionPlain": "...",
    "openingPlain": "...",
    "additionalPlain": "..."
  }
]
```

`descriptionPlain` / `openingPlain` / `additionalPlain` are **already plain text** —
no HTML stripping needed, unlike Greenhouse.

### Single posting detail

```
GET https://api.lever.co/v0/postings/{company}/{posting_id}?mode=json
```

Same shape as one array element above. Confirmed working live.

## Notes

- **No cross-company search on either platform.** Both APIs are scoped to one
  company's board — there is no "search all Greenhouse boards for X" endpoint. This
  tool is a per-company lookup, not a search engine.
- **Slug guessing**: the CLI derives a handful of slug candidates from the company
  name the user types (concatenated, hyphenated, underscored) and tries each against
  Greenhouse first, then Lever. See `slugCandidates()` in `cli/src/helpers.ts`.
- **A company using neither platform is common and expected** — Ashby, Workday,
  iCIMS, SmartRecruiters, and custom-built boards are all out of scope for this tool.
  The CLI reports this cleanly (`meta.found: false`, exit code 0) rather than as an
  error.
- **Rate limits**: not formally documented by either platform for these endpoints;
  the CLI backs off on 429/5xx like the other portal skills in this repo. Keep volume
  reasonable (checking specific named companies, not enumerating slugs at scale).
- Companies verified live during development: Greenhouse — `gitlab` (157 jobs, 29
  "Account Executive" matches), `stripe`, `mongodb`, `datadog`, `elastic`, `twilio`.
  Lever — `palantir` (276 jobs). Confirmed 404 on both platforms for a nonsense slug
  (`zzzznotarealcompanyxyz123abc`) to verify the "not found" path.

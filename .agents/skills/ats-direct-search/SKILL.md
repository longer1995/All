---
name: ats-direct-search
version: 1.0.0
description: >
  Use this skill to check whether a SPECIFIC, NAMED company has open roles on
  Greenhouse or Lever — the two applicant-tracking systems that expose public,
  unauthenticated JSON job-board APIs. This is a per-company lookup tool, not a
  keyword-search-the-whole-internet tool: there is no cross-company search on
  either platform. Use it to monitor a target company Brandon is specifically
  interested in (e.g. a company he's tracking, a company from a referral, a
  company he wants to check periodically for new openings), or to pull the full
  description of one posting he already found. Trigger phrases: "does <company>
  have any openings", "check <company>'s job board", "is <company> hiring",
  "look up jobs at <company>", "check if <company> uses Greenhouse/Lever",
  "monitor <company> for new roles", "any Account Executive roles at
  <company>".
context: fork
allowed-tools: Bash(bun run skills/ats-direct-search/cli/src/cli.ts *)
---

# ATS-Direct Search Skill

Look up a **specific, named company's** open roles directly from Greenhouse or
Lever's public job-board embed APIs. No authentication, no API key, **zero
runtime dependencies** — it runs with just `bun`.

## Why this exists, and how it differs from the other job-search skills

This repo tried building direct scrapers for Wellfound and Indeed. Both were
hard-blocked by Cloudflare/DataDome bot detection — confirmed empirically, not
a proxy or configuration issue. Those sites also don't want automated access to
their aggregator UI, which is why `linkedin-search` carries a personal-use-only
warning.

Greenhouse and Lever are different: **both platforms publish these exact JSON
endpoints so that companies can embed their own job board on their own careers
page.** Fetching them programmatically is the intended, designed-for use case
of the API — not a workaround, not a ToS gray area. No personal-use warning is
needed here for that reason.

The tradeoff: **there is no keyword search across companies.** Every request
is scoped to one company's board. This tool answers "does `<company>` have
openings?" — it cannot answer "which companies are hiring for `<role>`?" the
way `linkedin-search` can. Use it for:

- Checking a specific target company (one Brandon is already tracking, was
  referred to, or is otherwise interested in) for current openings
- Periodically re-checking a shortlist of target companies for new roles
- Pulling the full description of one posting once you have its ID

Many companies use neither platform (Ashby, Workday, iCIMS, a custom board,
etc.) — that's a normal, expected outcome the CLI reports cleanly, not a
failure.

## Commands

### Search a company's open roles

```bash
bun run skills/ats-direct-search/cli/src/cli.ts search --company "<name>" [flags]
```

Tries Greenhouse's board-token convention first; if that 404s on every slug
variant, falls back to Lever's convention. Reports `meta.found: false`
(exit code 0) if neither platform has a board for that company.

Key flags:
- `--company <text>` / `-c <text>` — **required.** Company name, e.g. `"GitLab"`, `"Palantir"`, `"Stripe"`. The CLI derives slug candidates automatically (`gitlab`, `git-lab`, `git_lab`, ...).
- `--query <text>` / `-q <text>` — keyword filter on job title (client-side substring match), e.g. `"Account Executive"`, `"Sales"`.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full posting detail

```bash
bun run skills/ats-direct-search/cli/src/cli.ts detail <job-id> --company "<name>" [--format json|plain]
```

`job-id` is the `id` from a `search` result (numeric for Greenhouse, a UUID for
Lever — pass it as-is either way). Returns the full description, department,
employment type, and apply link.

## Usage examples

```bash
# Does GitLab have any open Account Executive roles right now?
bun run skills/ats-direct-search/cli/src/cli.ts search -c "GitLab" -q "Account Executive" --format table

# All open roles at Palantir (a Lever company)
bun run skills/ats-direct-search/cli/src/cli.ts search -c "Palantir" --format table

# Full detail on one posting
bun run skills/ats-direct-search/cli/src/cli.ts detail 8503792002 -c "GitLab" --format plain

# A company that isn't on either platform — reports cleanly, exit 0
bun run skills/ats-direct-search/cli/src/cli.ts search -c "SomeAshbyCompany" --format table
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single posting's full detail (`detail` command) |

All hard errors are written to **stderr** as `{ "error": "...", "code": "..." }`
with exit code `1`. A company found on neither Greenhouse nor Lever is **not**
an error — `search` prints `meta.found: false` on stdout with exit code `0`,
since that's a normal, common outcome (see above).

## Notes

- Data sources: Greenhouse `boards-api.greenhouse.io/v1/boards/{token}/jobs`
  and Lever `api.lever.co/v0/postings/{company}`. See `url-reference.md` for
  full endpoint/field documentation.
- No cross-company search exists on either platform — this is a per-company
  lookup, not a discovery tool.
- Live-verified against real boards during development: Greenhouse — GitLab
  (157 open roles, 29 matching "Account Executive"), plus Stripe, MongoDB,
  Datadog, Elastic, Twilio all confirmed reachable. Lever — Palantir (276 open
  roles). A nonsense company name was confirmed to 404 on both platforms and
  report cleanly rather than crash.
- Greenhouse job descriptions are HTML (entity-escaped in the JSON payload,
  decoded and tag-stripped by the CLI). Lever postings ship pre-stripped plain
  text (`descriptionPlain`) — no HTML parsing needed there.
- This skill is not wired into `.claude/skills/job-scraper/search-queries.md`
  — it's a separate, complementary lookup path for named target companies,
  not part of the broad `/scrape` keyword sweep.

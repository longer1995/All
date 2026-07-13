# ats-direct-search-cli

CLI for looking up a **specific company's** open roles on Greenhouse or Lever —
the two ATS platforms that expose public, unauthenticated JSON APIs built for
embedding a job board on a company's own careers page.

**Data sources**:
- Greenhouse: `https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs`
- Lever: `https://api.lever.co/v0/postings/{company}?mode=json`

**Authentication**: None required — these are public embed APIs, not scraped pages.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **This is a per-company lookup tool, not a search engine.** Neither platform
> offers a keyword search across all companies — every request is scoped to one
> company's board. Use it to check a target company you already have in mind.

## Installation

```bash
cd .agents/skills/ats-direct-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | List a company's open roles (tries Greenhouse, then Lever) |
| `detail` | Fetch full detail for one posting |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All hard errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.
A company found on neither platform is **not** a hard error — `search` reports
`meta.found: false` on stdout with exit code `0`, since that's a normal, expected
outcome for many companies.

## Quick examples

```bash
# All open roles at GitLab (Greenhouse)
bun run src/cli.ts search -c "GitLab" --format table

# Account Executive roles at GitLab
bun run src/cli.ts search -c "GitLab" -q "Account Executive" --format table

# All open roles at Palantir (Lever)
bun run src/cli.ts search -c "Palantir" --format table

# Full detail for one posting
bun run src/cli.ts detail 8503792002 -c "GitLab" --format plain

# A company on neither platform — reports cleanly, does not crash
bun run src/cli.ts search -c "SomeCompanyOnAshbyOrWorkday" --format table
```

See `../SKILL.md` for the full flag reference.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--company` | `-c` | **Required.** Company name, e.g. `"GitLab"`, `"Palantir"`. The CLI derives board-slug candidates from it automatically. |
| `--query` | `-q` | Keyword filter on job title (client-side substring match). |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |

## How board resolution works

Given `--company "GitLab"`, the CLI derives slug candidates (`gitlab`,
`git-lab`, `git_lab`, ...) and tries them against Greenhouse's
`/v1/boards/{token}/jobs` first, then Lever's `/v0/postings/{company}`. The
first one that returns a valid jobs array wins. A 404 on a given candidate
just means that slug isn't a valid board token — not a failure — so the CLI
moves on to the next candidate/platform silently.

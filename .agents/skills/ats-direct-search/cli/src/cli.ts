#!/usr/bin/env bun
// Self-contained CLI for looking up a specific company's open roles on
// Greenhouse or Lever's public job-board embed APIs. No external CLI
// framework, so it runs anywhere `bun` is available with zero install
// beyond the repo clone.
//
// This is a PER-COMPANY lookup tool, not a keyword-search-the-whole-internet
// tool: Greenhouse and Lever don't expose a cross-company search, only a
// per-board listing. Use it to check whether a specific target company has
// open roles, not to discover companies you haven't already named.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", c: "company", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `ats-direct-search — look up a specific company's open roles on Greenhouse or Lever

Per-company lookup only: Greenhouse and Lever don't offer a cross-company
keyword search, only a per-board listing. Use this to check a target company
you already have in mind, not to discover companies.

USAGE
  bun run src/cli.ts search --company "<name>" [flags]
  bun run src/cli.ts detail <job-id> --company "<name>" [--format json|plain]

SEARCH FLAGS
  --company, -c <text>   Company name (or exact board slug). REQUIRED.
                          e.g. "GitLab", "gitlab", "Palantir".
  --query, -q <text>     Keyword filter on job title (client-side), e.g. "Account Executive".
  --limit, -n <n>        Cap results emitted (client-side).
  --format <fmt>         json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -c "GitLab" -q "Account Executive" --format table
  bun run src/cli.ts search -c "Palantir" --format table
  bun run src/cli.ts detail 8503792002 -c "GitLab" --format plain

If the company isn't on Greenhouse or Lever (Ashby, Workday, iCIMS, a custom
board, etc.), search reports "found: false" cleanly rather than erroring —
that's a normal, expected outcome, not a failure.
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const company = typeof flags.company === "string" ? flags.company : undefined

  if (cmd === "search") {
    if (!company) {
      process.stderr.write(
        JSON.stringify({
          error: 'the --company/-c flag is required (e.g. -c "GitLab")',
          code: "NO_COMPANY",
        }) + "\n",
      )
      return 1
    }
    const fmt = (flags.format as string) || "json"

    if (flags.limit !== undefined) {
      const v = parseInt(flags.limit as string, 10)
      if (isNaN(v)) {
        process.stderr.write(JSON.stringify({ error: `--limit must be a number, got "${flags.limit}"`, code: "BAD_ARG" }) + "\n")
        return 1
      }
      flags.limit = String(v)
    }

    const opts: SearchOpts = {
      company,
      query: typeof flags.query === "string" ? flags.query : undefined,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <job-id>", code: "NO_ID" }) + "\n")
      return 1
    }
    if (!company) {
      process.stderr.write(
        JSON.stringify({
          error: 'the --company/-c flag is required (e.g. -c "GitLab")',
          code: "NO_COMPANY",
        }) + "\n",
      )
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      id,
      company,
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main().then((code) => process.exit(code))

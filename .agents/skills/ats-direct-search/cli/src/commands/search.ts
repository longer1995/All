import { resolveBoard, filterByKeyword, writeError, type JobCard, type AtsSource } from "../helpers.js"

export interface SearchOpts {
  company: string
  query?: string
  limit?: number
  format: "json" | "table" | "plain"
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 42).padEnd(42)
    const location = (c.location || "—").slice(0, 24).padEnd(24)
    const date = (c.date || "—").slice(0, 10)
    return `${c.id.padEnd(38)} ${title} ${location} ${date}`
  })
  const header =
    "ID".padEnd(38) + " " + "TITLE".padEnd(42) + " " + "LOCATION".padEnd(24) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

function renderPlain(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  return cards
    .map((c) => `${c.title}\n  ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`)
    .join("\n\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const board = await resolveBoard(opts.company)

    if (!board) {
      const meta = {
        company: opts.company,
        source: null as AtsSource | null,
        boardToken: null as string | null,
        query: opts.query ?? null,
        count: 0,
        found: false,
      }
      if (opts.format === "json") {
        process.stdout.write(JSON.stringify({ meta, results: [] }, null, 2) + "\n")
      } else {
        process.stdout.write(
          `No Greenhouse or Lever job board found for "${opts.company}". ` +
            `This company may use a different ATS (Ashby, Workday, iCIMS, a custom board, etc.), ` +
            `or the board token differs from the company name — try the exact slug from their ` +
            `careers page URL if you know it.\n`,
        )
      }
      // Not found on either platform is an expected, common outcome for a
      // per-company lookup tool — not a crash, not a fetch error — so this
      // exits 0 with an explicit "found: false" rather than erroring.
      return 0
    }

    let cards = filterByKeyword(board.jobs, opts.query)
    const totalBeforeLimit = cards.length
    if (opts.limit && opts.limit > 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(renderPlain(cards) + "\n")
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              company: opts.company,
              source: board.source,
              boardToken: board.token,
              query: opts.query ?? null,
              count: totalBeforeLimit,
              found: true,
            },
            results: cards,
          },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

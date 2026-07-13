import {
  slugCandidates,
  resolveGreenhouseBoard,
  resolveLeverBoard,
  fetchGreenhouseJob,
  fetchLeverJob,
  normalizeGreenhouseDetail,
  normalizeLeverDetail,
  writeError,
  type JobDetail,
} from "../helpers.js"

export interface DetailOpts {
  id: string
  company: string
  format: "json" | "plain"
}

function renderPlain(job: JobDetail): string {
  const lines = [
    job.title,
    `${job.company || "—"} · ${job.location || "—"}`,
    "",
    job.department ? `Department: ${job.department}` : "",
    job.employmentType ? `Employment: ${job.employmentType}` : "",
    `Source: ${job.source}`,
    "",
    job.description || "(no description)",
    "",
    `URL: ${job.url}`,
    job.applyUrl && job.applyUrl !== job.url ? `Apply: ${job.applyUrl}` : "",
  ].filter((l) => l !== "")
  return lines.join("\n")
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  try {
    const candidates = slugCandidates(opts.company)

    // Try Greenhouse first: resolve the board token, then fetch the specific job.
    const gh = await resolveGreenhouseBoard(candidates)
    if (gh) {
      const job = await fetchGreenhouseJob(gh.token, opts.id)
      if (!job) {
        writeError(`Job "${opts.id}" not found on ${opts.company}'s Greenhouse board`, "NOT_FOUND")
        return 1
      }
      const detail = normalizeGreenhouseDetail(job, opts.company)
      process.stdout.write(
        (opts.format === "plain" ? renderPlain(detail) : JSON.stringify(detail, null, 2)) + "\n",
      )
      return 0
    }

    // Fall back to Lever.
    const lever = await resolveLeverBoard(candidates)
    if (lever) {
      const job = await fetchLeverJob(lever.token, opts.id)
      if (!job) {
        writeError(`Job "${opts.id}" not found on ${opts.company}'s Lever board`, "NOT_FOUND")
        return 1
      }
      const detail = normalizeLeverDetail(job, opts.company)
      process.stdout.write(
        (opts.format === "plain" ? renderPlain(detail) : JSON.stringify(detail, null, 2)) + "\n",
      )
      return 0
    }

    writeError(`No Greenhouse or Lever job board found for "${opts.company}"`, "COMPANY_NOT_FOUND")
    return 1
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}

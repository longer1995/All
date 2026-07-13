// Data sources: Greenhouse and Lever's public, unauthenticated job-board embed APIs.
// These endpoints are NOT scraped HTML — they are JSON APIs the platforms publish
// specifically so companies can embed their job board on their own website. No
// login, no API key, no robots.txt/ToS concern of the kind that blocked Wellfound
// and Indeed.
//
//   Greenhouse: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs
//   Lever:      https://api.lever.co/v0/postings/{company}?mode=json
//
// A given company is typically on ONE of these platforms (or neither — Ashby,
// Workday, iCIMS, and plenty of home-grown boards are out of scope here). There
// is no cross-company keyword search: every lookup is scoped to one company's
// board.

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

/**
 * Fetch JSON with exponential backoff on 429/5xx. Returns `null` on a 404
 * (the normal, expected signal that a company isn't on this platform / this
 * board token doesn't exist / this job id doesn't exist) rather than throwing.
 */
export async function jsonFetch<T = unknown>(url: string): Promise<T | null> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
      },
      redirect: "follow",
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface JobDetail extends JobCard {
  description: string | null
  source: "greenhouse" | "lever"
  department: string | null
  employmentType: string | null
  applyUrl: string | null
}

export type AtsSource = "greenhouse" | "lever"

/**
 * Derive candidate board-token/company slugs from a human-typed company name.
 * Both platforms want a lowercase, no-space slug, but conventions vary
 * (some tokens keep hyphens, e.g. "american-express"; most just concatenate,
 * e.g. "gitlab", "mongodb"). We try the most common forms in order.
 */
export function slugCandidates(company: string): string[] {
  const trimmed = company.trim()
  const lower = trimmed.toLowerCase()
  const candidates = new Set<string>()

  // As typed, lowercased, spaces/underscores collapsed to nothing.
  candidates.add(lower.replace(/[^a-z0-9]+/g, ""))
  // Hyphenated.
  candidates.add(
    lower
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  )
  // Underscored (rare, but seen).
  candidates.add(
    lower
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
  )
  // If the user already passed a clean slug (no spaces), keep it verbatim too.
  if (/^[a-z0-9-]+$/.test(lower)) candidates.add(lower)

  return [...candidates].filter(Boolean)
}

// ---------------------------------------------------------------------------
// Greenhouse
// ---------------------------------------------------------------------------

interface GreenhouseListJob {
  id: number
  title: string
  location?: { name?: string | null }
  updated_at?: string | null
  first_published?: string | null
  absolute_url?: string | null
  departments?: { name?: string }[]
}

interface GreenhouseJobsResponse {
  jobs: GreenhouseListJob[]
}

interface GreenhouseDetailJob extends GreenhouseListJob {
  content?: string | null
  company_name?: string | null
}

export function greenhouseJobsUrl(token: string): string {
  return `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs`
}

export function greenhouseJobUrl(token: string, id: string): string {
  return `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(token)}/jobs/${encodeURIComponent(id)}?content=true`
}

export function normalizeGreenhouseJob(job: GreenhouseListJob, companyName: string): JobCard {
  return {
    id: String(job.id),
    title: job.title,
    company: companyName,
    location: job.location?.name ?? null,
    date: job.updated_at ?? job.first_published ?? null,
    url: job.absolute_url ?? `https://boards.greenhouse.io/${encodeURIComponent(companyName)}`,
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function normalizeGreenhouseDetail(job: GreenhouseDetailJob, companyName: string): JobDetail {
  // `content` is HTML, but the JSON value has its tags HTML-entity-escaped
  // (i.e. it literally contains "&lt;div&gt;..." as text) — decode once to
  // get real HTML, then strip tags for the plain-text description.
  const rawHtml = job.content ? decodeHtmlEntities(job.content) : null
  const description = rawHtml ? stripTags(rawHtml) || null : null
  return {
    id: String(job.id),
    title: job.title,
    company: job.company_name ?? companyName,
    location: job.location?.name ?? null,
    date: job.updated_at ?? job.first_published ?? null,
    url: job.absolute_url ?? `https://boards.greenhouse.io/${encodeURIComponent(companyName)}`,
    description,
    source: "greenhouse",
    department: job.departments?.[0]?.name ?? null,
    employmentType: null,
    applyUrl: job.absolute_url ?? null,
  }
}

/** Try each Greenhouse board-token candidate; return the first that resolves. */
export async function resolveGreenhouseBoard(
  candidates: string[],
): Promise<{ token: string; jobs: GreenhouseListJob[] } | null> {
  for (const token of candidates) {
    const res = await jsonFetch<GreenhouseJobsResponse>(greenhouseJobsUrl(token))
    if (res && Array.isArray(res.jobs)) {
      return { token, jobs: res.jobs }
    }
  }
  return null
}

export async function fetchGreenhouseJob(token: string, id: string): Promise<GreenhouseDetailJob | null> {
  return jsonFetch<GreenhouseDetailJob>(greenhouseJobUrl(token, id))
}

// ---------------------------------------------------------------------------
// Lever
// ---------------------------------------------------------------------------

interface LeverCategories {
  location?: string | null
  team?: string | null
  commitment?: string | null
  allLocations?: string[]
}

interface LeverPosting {
  id: string
  text: string
  categories?: LeverCategories
  createdAt?: number
  hostedUrl?: string
  applyUrl?: string
  descriptionPlain?: string | null
  openingPlain?: string | null
  additionalPlain?: string | null
}

export function leverPostingsUrl(company: string): string {
  return `https://api.lever.co/v0/postings/${encodeURIComponent(company)}?mode=json`
}

export function leverJobUrl(company: string, id: string): string {
  return `https://api.lever.co/v0/postings/${encodeURIComponent(company)}/${encodeURIComponent(id)}?mode=json`
}

function isoFromMillis(ms: number | undefined): string | null {
  if (!ms) return null
  const d = new Date(ms)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

export function normalizeLeverJob(job: LeverPosting, companyName: string): JobCard {
  return {
    id: job.id,
    title: job.text,
    company: companyName,
    location: job.categories?.location ?? job.categories?.allLocations?.[0] ?? null,
    date: isoFromMillis(job.createdAt),
    url: job.hostedUrl ?? `https://jobs.lever.co/${encodeURIComponent(companyName)}`,
  }
}

export function normalizeLeverDetail(job: LeverPosting, companyName: string): JobDetail {
  const parts = [job.openingPlain, job.descriptionPlain, job.additionalPlain].filter(
    (p): p is string => !!p && p.trim().length > 0,
  )
  return {
    id: job.id,
    title: job.text,
    company: companyName,
    location: job.categories?.location ?? job.categories?.allLocations?.[0] ?? null,
    date: isoFromMillis(job.createdAt),
    url: job.hostedUrl ?? `https://jobs.lever.co/${encodeURIComponent(companyName)}`,
    description: parts.length ? parts.join("\n\n").trim() : null,
    source: "lever",
    department: job.categories?.team ?? null,
    employmentType: job.categories?.commitment ?? null,
    applyUrl: job.applyUrl ?? null,
  }
}

/** Try each Lever company-slug candidate; return the first that resolves. */
export async function resolveLeverBoard(
  candidates: string[],
): Promise<{ token: string; jobs: LeverPosting[] } | null> {
  for (const token of candidates) {
    const res = await jsonFetch<LeverPosting[]>(leverPostingsUrl(token))
    if (res && Array.isArray(res)) {
      return { token, jobs: res }
    }
  }
  return null
}

export async function fetchLeverJob(token: string, id: string): Promise<LeverPosting | null> {
  return jsonFetch<LeverPosting>(leverJobUrl(token, id))
}

// ---------------------------------------------------------------------------
// Combined board resolution
// ---------------------------------------------------------------------------

export interface ResolvedBoard {
  source: AtsSource
  token: string
  jobs: JobCard[]
}

/**
 * Resolve a company name to a board: try every Greenhouse slug candidate
 * first, then every Lever slug candidate. Returns `null` if the company
 * isn't found on either platform (expected/normal — many companies use
 * neither, e.g. Ashby, Workday, or a home-grown board).
 */
export async function resolveBoard(company: string): Promise<ResolvedBoard | null> {
  const candidates = slugCandidates(company)

  const gh = await resolveGreenhouseBoard(candidates)
  if (gh) {
    return { source: "greenhouse", token: gh.token, jobs: gh.jobs.map((j) => normalizeGreenhouseJob(j, company)) }
  }

  const lever = await resolveLeverBoard(candidates)
  if (lever) {
    return { source: "lever", token: lever.token, jobs: lever.jobs.map((j) => normalizeLeverJob(j, company)) }
  }

  return null
}

/** Filter job cards by a case-insensitive keyword match on the title. */
export function filterByKeyword(jobs: JobCard[], query: string | undefined): JobCard[] {
  if (!query) return jobs
  const q = query.toLowerCase()
  return jobs.filter((j) => j.title.toLowerCase().includes(q))
}

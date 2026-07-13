// Live smoke tests against the real Greenhouse and Lever public APIs.
// These make real network requests (a handful, not a crawl) to confirm both
// platform code paths, the keyword filter, and the "not found on either"
// path all work against live data. Company/board choices were verified
// empirically to be on the expected platform at the time this was written;
// if a company migrates ATS platforms these may need updating.

import { describe, test, expect } from "bun:test";
import { runCLI, parseJSON } from "./helpers";

interface SearchResult {
  meta: { company: string; source: string | null; boardToken: string | null; count: number; found: boolean };
  results: { id: string; title: string; company: string | null; location: string | null; date: string | null; url: string }[];
}

describe("ats-direct-search live", () => {
  test("Greenhouse company (GitLab) returns real open roles", async () => {
    const result = await runCLI(["search", "-c", "GitLab", "--limit", "5"]);
    const json = parseJSON<SearchResult>(result);
    expect(json.meta.source).toBe("greenhouse");
    expect(json.meta.found).toBe(true);
    expect(json.results.length).toBeGreaterThan(0);
    for (const job of json.results) {
      expect(job.id).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.url).toMatch(/^https:\/\//);
    }
  }, 30000);

  test("Lever company (Palantir) returns real open roles", async () => {
    const result = await runCLI(["search", "-c", "Palantir", "--limit", "5"]);
    const json = parseJSON<SearchResult>(result);
    expect(json.meta.source).toBe("lever");
    expect(json.meta.found).toBe(true);
    expect(json.results.length).toBeGreaterThan(0);
    for (const job of json.results) {
      expect(job.id).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.url).toMatch(/^https:\/\/jobs\.lever\.co\//);
    }
  }, 30000);

  test("keyword filter narrows results (GitLab, Account Executive)", async () => {
    const all = parseJSON<SearchResult>(await runCLI(["search", "-c", "GitLab"]));
    const filtered = parseJSON<SearchResult>(
      await runCLI(["search", "-c", "GitLab", "-q", "Account Executive"]),
    );
    expect(filtered.results.length).toBeGreaterThan(0);
    expect(filtered.results.length).toBeLessThan(all.results.length);
    for (const job of filtered.results) {
      expect(job.title.toLowerCase()).toContain("account executive");
    }
  }, 30000);

  test("company on neither platform reports cleanly, exit 0", async () => {
    const result = await runCLI(["search", "-c", "zzzznotarealcompanyxyz123abc"]);
    expect(result.exitCode).toBe(0);
    const json = parseJSON<SearchResult>(result);
    expect(json.meta.found).toBe(false);
    expect(json.meta.source).toBeNull();
    expect(json.results).toEqual([]);
  }, 30000);

  test("detail fetches full description for a Greenhouse job", async () => {
    const search = parseJSON<SearchResult>(await runCLI(["search", "-c", "GitLab", "--limit", "1"]));
    const id = search.results[0].id;
    const result = await runCLI(["detail", id, "-c", "GitLab"]);
    const job = parseJSON<{ description: string | null; source: string }>(result);
    expect(job.source).toBe("greenhouse");
    expect(job.description).toBeTruthy();
    expect((job.description ?? "").length).toBeGreaterThan(20);
  }, 30000);

  test("detail fetches full description for a Lever job", async () => {
    const search = parseJSON<SearchResult>(await runCLI(["search", "-c", "Palantir", "--limit", "1"]));
    const id = search.results[0].id;
    const result = await runCLI(["detail", id, "-c", "Palantir"]);
    const job = parseJSON<{ description: string | null; source: string }>(result);
    expect(job.source).toBe("lever");
    expect(job.description).toBeTruthy();
  }, 30000);
});

import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

function parsedStderr(stderr: string): { error?: string; code?: string } {
  try {
    return JSON.parse(stderr);
  } catch {
    return {};
  }
}

describe("ats-direct-search CLI flag validation", () => {
  test("missing --company on search exits 1 with NO_COMPANY", async () => {
    const result = await runCLI(["search"]);
    expect(result.exitCode).not.toBe(0);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("NO_COMPANY");
  });

  test("missing --company on detail exits 1 with NO_COMPANY", async () => {
    const result = await runCLI(["detail", "12345"]);
    expect(result.exitCode).not.toBe(0);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("NO_COMPANY");
  });

  test("detail missing job id exits 1 with NO_ID", async () => {
    const result = await runCLI(["detail", "-c", "GitLab"]);
    expect(result.exitCode).not.toBe(0);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("NO_ID");
  });

  test("non-numeric --limit exits 1 with BAD_ARG", async () => {
    const result = await runCLI(["search", "-c", "GitLab", "--limit", "xyz"]);
    expect(result.exitCode).not.toBe(0);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("BAD_ARG");
  });

  test("unknown command exits 1 with BAD_CMD", async () => {
    const result = await runCLI(["frobnicate"]);
    expect(result.exitCode).not.toBe(0);
    const err = parsedStderr(result.stderr);
    expect(err.code).toBe("BAD_CMD");
  });

  test("no args prints help and exits 1", async () => {
    const result = await runCLI([]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toMatch(/ats-direct-search/);
  });

  test("--help exits 0 and prints help", async () => {
    const result = await runCLI(["search", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/USAGE/);
  });
});

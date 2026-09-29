import { describe, expect, it } from "vitest";
import { loadDataset } from "../src/utils/loader.js";
import { datasetNames, validateDataset } from "../src/utils/schema.js";

describe("data/ files", () => {
  it.each(datasetNames)("%s.json loads and passes validation", (name) => {
    expect(loadDataset(name).length).toBeGreaterThan(0);
  });
});

describe("validateDataset", () => {
  it("accepts a valid entry with a contributor", () => {
    expect(validateDataset("excuses", [{ text: "It's DNS.", contributor: "octocat" }])).toEqual([]);
  });

  it("rejects non-arrays and empty arrays", () => {
    expect(validateDataset("roasts", {})).toHaveLength(1);
    expect(validateDataset("roasts", [])).toHaveLength(1);
  });

  it("reports missing, unknown and malformed fields", () => {
    const errors = validateDataset("titles", [{ title: "The Linter", emoji: "", extra: true }]);
    expect(errors.join("\n")).toMatch(/missing required field "description"/);
    expect(errors.join("\n")).toMatch(/unknown field "extra"/);
    expect(errors.join("\n")).toMatch(/"emoji" must be a non-empty string/);
  });

  it("reports case-insensitive duplicates", () => {
    const errors = validateDataset("excuses", [{ text: "It's DNS." }, { text: "it's dns." }]);
    expect(errors).toEqual([expect.stringMatching(/entry #2 duplicates entry #1/)]);
  });

  it("rejects contributor handles with an @", () => {
    expect(validateDataset("roasts", [{ text: "Nice YAML.", contributor: "@octocat" }])).toHaveLength(1);
  });
});

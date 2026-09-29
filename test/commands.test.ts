import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "../src/commands/base64.js";
import { buildPersona } from "../src/commands/persona.js";
import { loadDataset } from "../src/utils/loader.js";
import { seededRng } from "../src/utils/random.js";

describe("persona", () => {
  it("gives the same name the same persona", () => {
    const titles = loadDataset("titles");
    const roasts = loadDataset("roasts");
    const first = buildPersona(titles, roasts, seededRng("ada"));
    const second = buildPersona(titles, roasts, seededRng("ada"));
    expect(first).toEqual(second);
  });
});

describe("base64", () => {
  it("round-trips unicode text", () => {
    const text = "dev-vibe ⚡ héllo";
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });

  it("rejects invalid input", () => {
    expect(() => decodeBase64("not base64!")).toThrow(/not valid base64/);
  });
});

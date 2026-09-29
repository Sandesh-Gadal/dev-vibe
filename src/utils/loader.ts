import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DatasetName, Datasets } from "../types.js";
import { validateDataset } from "./schema.js";

/**
 * Resolved relative to this module, not `process.cwd()`, so it works from
 * `src/utils/` (tsx), `dist/utils/` (build), and `npx`/global installs alike.
 */
export const DATA_DIR = fileURLToPath(new URL("../../data/", import.meta.url));

export class DataError extends Error {
  override name = "DataError";
}

const cache = new Map<DatasetName, unknown>();

export function loadDataset<K extends DatasetName>(name: K): Datasets[K] {
  const cached = cache.get(name);
  if (cached) return cached as Datasets[K];

  const file = path.join(DATA_DIR, `${name}.json`);
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new DataError(`Could not read data/${name}.json: ${(error as Error).message}`);
  }

  const errors = validateDataset(name, parsed);
  if (errors.length > 0) {
    throw new DataError(`data/${name}.json is invalid:\n  - ${errors.join("\n  - ")}`);
  }

  cache.set(name, parsed);
  return parsed as Datasets[K];
}

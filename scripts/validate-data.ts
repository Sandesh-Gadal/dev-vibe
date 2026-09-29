/**
 * Validates every file in data/ against src/utils/schema.ts.
 * Run with `npm run validate:data`; CI runs it on every pull request.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { DATA_DIR } from "../src/utils/loader.js";
import { datasetNames, validateDataset } from "../src/utils/schema.js";

let failed = false;

for (const name of datasetNames) {
  const file = path.join(DATA_DIR, `${name}.json`);
  let errors: string[];
  try {
    errors = validateDataset(name, JSON.parse(readFileSync(file, "utf8")));
  } catch (error) {
    errors = [`${name}.json could not be parsed: ${(error as Error).message}`];
  }

  if (errors.length > 0) {
    failed = true;
    console.error(`✖ data/${name}.json`);
    for (const message of errors) console.error(`  - ${message}`);
  } else {
    console.log(`✔ data/${name}.json`);
  }
}

if (failed) {
  console.error("\nSee CONTRIBUTING.md for the expected format of each file.");
  process.exitCode = 1;
}

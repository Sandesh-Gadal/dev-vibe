import type { DatasetName } from "../types.js";

interface FieldSpec {
  required: boolean;
  maxLength: number;
}

const contributorField: FieldSpec = { required: false, maxLength: 39 };

/**
 * Allowed fields for each dataset. This is the single source of truth used by
 * both the runtime loader and `npm run validate:data` (which CI runs on every PR).
 * Keep it in sync with `src/types.ts`.
 */
export const schemas: Record<DatasetName, Record<string, FieldSpec>> = {
  titles: {
    emoji: { required: true, maxLength: 16 },
    title: { required: true, maxLength: 60 },
    description: { required: true, maxLength: 200 },
    contributor: contributorField,
  },
  roasts: {
    text: { required: true, maxLength: 200 },
    contributor: contributorField,
  },
  excuses: {
    text: { required: true, maxLength: 200 },
    contributor: contributorField,
  },
};

/** The field that must be unique (case-insensitively) within each dataset. */
export const uniqueFields: Record<DatasetName, string> = {
  titles: "title",
  roasts: "text",
  excuses: "text",
};

export const datasetNames = Object.keys(schemas) as DatasetName[];

const GITHUB_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

/** Returns a list of human-readable problems; an empty list means the data is valid. */
export function validateDataset(name: DatasetName, data: unknown): string[] {
  if (!Array.isArray(data)) {
    return [`${name}.json must contain a JSON array ([ ... ]).`];
  }
  if (data.length === 0) {
    return [`${name}.json must contain at least one entry.`];
  }

  const schema = schemas[name];
  const uniqueField = uniqueFields[name];
  const errors: string[] = [];
  const seen = new Map<string, number>();

  data.forEach((entry: unknown, index) => {
    const where = `${name}.json entry #${index + 1}`;
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      errors.push(`${where} must be an object ({ ... }).`);
      return;
    }
    const record = entry as Record<string, unknown>;

    for (const key of Object.keys(record)) {
      if (!(key in schema)) {
        errors.push(`${where} has unknown field "${key}". Allowed: ${Object.keys(schema).join(", ")}.`);
      }
    }

    for (const [field, spec] of Object.entries(schema)) {
      const value = record[field];
      if (value === undefined) {
        if (spec.required) errors.push(`${where} is missing required field "${field}".`);
        continue;
      }
      if (typeof value !== "string" || value.trim() === "") {
        errors.push(`${where} field "${field}" must be a non-empty string.`);
        continue;
      }
      if (value !== value.trim()) {
        errors.push(`${where} field "${field}" has leading or trailing whitespace.`);
      }
      if (value.length > spec.maxLength) {
        errors.push(`${where} field "${field}" is ${value.length} characters; the maximum is ${spec.maxLength}.`);
      }
      if (field === "contributor" && !GITHUB_USERNAME.test(value)) {
        errors.push(`${where} field "contributor" must be a GitHub username (without "@").`);
      }
    }

    const key = record[uniqueField];
    if (typeof key === "string") {
      const normalized = key.trim().toLowerCase();
      const firstIndex = seen.get(normalized);
      if (firstIndex !== undefined) {
        errors.push(`${where} duplicates entry #${firstIndex + 1} ("${key}").`);
      } else {
        seen.set(normalized, index);
      }
    }
  });

  return errors;
}

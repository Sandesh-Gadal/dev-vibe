# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev -- persona --name Ada   # run the CLI from source (tsx); args go after --
npm run check                       # validate:data + lint + typecheck + test (what CI runs, minus build)
npm run validate:data               # validate data/*.json against the schema
npm test                            # vitest run
npx vitest run test/data.test.ts    # single test file
npx vitest run -t "base64"          # tests matching a name
npm run build                       # tsc -p tsconfig.build.json → dist/
```

Requires Node >= 22.12 (the minimum for commander 15 and chalk 6). The project is ESM (`"type": "module"`, `NodeNext`), so relative imports in TypeScript must use the `.js` extension.

## Architecture

dev-vibe is a `commander` CLI built as a **Hacktoberfest contribution funnel**. It has two kinds of contributions, and the code is shaped to keep each one a small, easy PR:

- **Data PRs (beginners):** jokes live in `data/{titles,roasts,excuses}.json` as flat arrays of objects, never hardcoded in TypeScript. Every entry may have an optional `contributor` (GitHub username), which the CLI shows as credit.
- **Command PRs (intermediate):** one file per command in `src/commands/`. Each file exports a `RegisterCommand` (`(program) => void`, defined in `src/types.ts`) and is added to the alphabetical `commands` array in `src/index.ts`. Command files don't import each other. Testable logic goes in exported pure functions (e.g. `encodeBase64`, `buildPersona`), separate from the commander action.

### Data pipeline

- `src/utils/schema.ts` is the **single source of truth** for dataset shape: allowed fields, required fields, max lengths, the unique key, and the GitHub-username check. Two things use it: `src/utils/loader.ts` (at runtime, where invalid data throws a `DataError`) and `scripts/validate-data.ts` (in CI, where the errors are written for first-time contributors).
- **Changing a dataset's shape means updating three places together:** the interface in `src/types.ts`, the entry in `schemas`/`uniqueFields` in `schema.ts`, and the field tables in `CONTRIBUTING.md`. To add a dataset, also add it to `Datasets` and create the JSON file; `datasetNames` then picks it up automatically in validation and tests.
- `DATA_DIR` is resolved from `import.meta.url` (`../../data/`), not `process.cwd()`. This works from `src/utils/` under tsx, from `dist/utils/` after a build, and from npx or global installs. `package.json` `files` ships `dist` and `data`. Keep that relative depth if you move `loader.ts`.

### Other details

- Errors thrown from command actions are caught in `src/index.ts`, printed in red, and set exit code 1. Commands should throw instead of calling `process.exit`.
- `persona --name` uses `seededRng` (in `src/utils/random.ts`), so the same name always gets the same persona. Tests rely on this for determinism.
- The persona card only has a left border, on purpose: emoji display widths vary, so a right border wouldn't line up.
- `tsconfig.json` (noEmit, covers `src`, `scripts` and `test`) is used for typechecking and the editor. `tsconfig.build.json` only emits `src`.
- CI is `.github/workflows/validate-json.yml`. Despite its name, it runs the full check plus build on every PR.

## Private maintainer notes

`.doc/` is gitignored and never pushed. It holds the maintainer's notes: how the project works, local testing, improvement ideas and interactive-feature designs (quiz, git "Wrapped", repo roast, menu, animations). Read `.doc/interactive-features.md` before building any of those features. Keep `.doc/` in sync when the architecture changes, and never move its content into tracked files unless asked.

## Roadmap

1. Scaffold (done)
2. Data-driven PR funnel: grow `data/`, triage data issues (`.github/ISSUE_TEMPLATE/add-title.md`)
3. Feature-driven PR funnel: more commands (`new-command.md` template)
4. Polish: README, CI and contributor docs

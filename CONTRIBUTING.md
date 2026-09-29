# Contributing to DevVibe 🌟

We love community contributions! Whether you're a seasoned developer or making your very first open-source pull request, here's how you can help.

> **About Hacktoberfest 2026:** this year, [Hacktoberfest](https://hacktoberfest.com/) no longer counts pull requests toward its rewards. We still welcome contributions in October and all year round. Your reward here is credit: add your GitHub username to your entry, and the CLI shows it.

## Way 1: Add Data (Beginner Friendly, No Code Required)

All the jokes live in JSON files in the [`data/`](data/) folder. You can add an entry straight from the GitHub website: open the file, click the ✏️ pencil icon, make your edit and choose **"Propose changes"**.

1. Open one of the files below.
2. Add your entry at the **end** of the list, following the format below. Put a comma after the entry before yours!
3. Optionally add `"contributor": "your-github-username"` (without the `@`). Your name will appear next to your entry in the CLI. 🎉
4. Open a pull request.

### `data/titles.json`: developer archetypes

```json
{
  "emoji": "🐛",
  "title": "The Bug Whisperer",
  "description": "Finds bugs by staring at the code until it confesses.",
  "contributor": "your-github-username"
}
```

| Field | Required | Max length |
| --- | --- | --- |
| `emoji` | yes | one emoji |
| `title` | yes | 60 characters |
| `description` | yes | 200 characters |
| `contributor` | no | your GitHub username |

### `data/roasts.json` (commit-message roasts) and `data/excuses.json` (why the code is broken)

```json
{ "text": "It worked yesterday.", "contributor": "your-github-username" }
```

| Field | Required | Max length |
| --- | --- | --- |
| `text` | yes | 200 characters |
| `contributor` | no | your GitHub username |

### Rules for data entries

- **No duplicates.** Search the file before adding (the check is case-insensitive).
- **Keep it kind.** Roast code habits, not people. No slurs, politics or punching down.
- **One or two entries per PR** is perfect. Quality over quantity!

A GitHub Action checks every PR. If it fails, open the **Details** link to see exactly which entry is wrong and why. To check locally:

```bash
npm install
npm run validate:data
```

## Way 2: Build a CLI Utility (For Developers)

1. Fork the repository and create a branch: `git checkout -b feature/amazing-utility`
2. Add your command in a new file in `src/commands/`. It must export a `RegisterCommand` function. Use [`src/commands/base64.ts`](src/commands/base64.ts) as a template:

   ```ts
   import type { RegisterCommand } from "../types.js";

   export function shout(text: string): string {
     return `${text.toUpperCase()}!`;
   }

   export const registerShout: RegisterCommand = (program) => {
     program
       .command("shout")
       .description("say something loudly")
       .argument("<text>", "what to shout")
       .action((text: string) => {
         console.log(shout(text));
       });
   };
   ```

3. Register it in the `commands` list in [`src/index.ts`](src/index.ts) (keep the list alphabetical).
4. Add a test in `test/` for your command's logic. Keep that logic in an exported function, like `shout` above, so it can be tested without running the CLI.
5. Add your command to the Micro-Utilities table in [`README.md`](README.md).
6. Run the checks and open a pull request:

   ```bash
   npm run dev -- shout hello   # try it out from source
   npm run check                # validate data, lint, typecheck and test
   ```

   To try it as the installed `dev-vibe` command, run `npm run build && npm link`, then `dev-vibe shout hello`. See the "Local development" section of [README.md](README.md) for more.

Guidelines for commands:

- One command per file, with no imports from other command files.
- Throw an `Error` with a helpful message for bad input. The CLI prints it in red and exits with code 1.
- If your command needs a new npm dependency, explain why in the PR.
- Ideas for a new command? Open a **New command** issue first to discuss it.

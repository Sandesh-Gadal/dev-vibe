# ⚡ DevVibe CLI

> The open-source developer persona generator and micro-utility toolbox for the terminal. Built for Hacktoberfest! 🚀

## 📦 Installation & Usage

> **Not on npm yet.** dev-vibe will be published to npm after Hacktoberfest. Until then, install it from source with the steps below.

You need [Node.js](https://nodejs.org) 22.12 or newer and [git](https://git-scm.com). Check your Node version with `node --version`.

**1. Clone the repo**

```bash
git clone https://github.com/Sandesh-Gadal/dev-vibe.git
cd dev-vibe
```

**2. Install dependencies**

```bash
npm install
```

**3. Build it**

```bash
npm run build
```

**4. Link it as a global command**

```bash
npm link
```

**5. Try it from anywhere**

```bash
dev-vibe persona
dev-vibe --help
```

To pick up new jokes and commands later, run `git pull`, then `npm install` and `npm run build`. You don't need to link again.

To uninstall, run `npm unlink -g dev-vibe` and delete the folder.

> **`dev-vibe: command not found`?** npm's global bin folder isn't on your `PATH`. Run `npm prefix -g` and add `<that path>/bin` to your `PATH`. Or skip linking and run `npm run dev -- persona` inside the folder.

## 🌟 Features

### 🧙 Dev Persona Generator

Discover your true developer archetype, complete with a signature roast.

```bash
dev-vibe persona
dev-vibe persona --name Ada   # the same name always gets the same persona
```

```
╭─ ADA'S DEV PERSONA ─────────────────────────────────────
│
│ 🌙  The 3 A.M. Committer
│ Their best code happens after midnight. So does their
│ worst.
│
│ Signature roast:
│ Your commit message is just the ticket number, and the
│ ticket just says 'see commit'.
│
╰─────────────────────────────────────────────────────────
```

### 🤷 The Excuse Generator

Instantly get a sarcastic excuse for why your code isn't working.

```bash
dev-vibe excuse
```

### 🧰 Micro-Utilities

Handy terminal tools contributed by the community.

| Command | What it does |
| --- | --- |
| `dev-vibe base64 <text>` | Encode text to base64 |
| `dev-vibe base64 -d <text>` | Decode base64 back to text |

Want to see your tool here? Build it! See below.

## 🤝 Contributing

Want to add a funny title, a roast, an excuse or a whole new CLI command? Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started and earn your Hacktoberfest badge. Adding a JSON entry takes about two minutes and needs no coding.

## 🛠️ Local development

If you're contributing, fork the repo first and clone your fork:

```bash
git clone https://github.com/<your-username>/dev-vibe.git
cd dev-vibe
npm install
```

### Run from source (no build needed)

Put the command's arguments after `--`:

```bash
npm run dev -- persona --name Ada
npm run dev -- excuse
npm run dev -- base64 "hello"
npm run dev -- --help
```

### Run it as the real `dev-vibe` command

```bash
npm run build          # compile to dist/
npm link               # make `dev-vibe` available globally, pointing at this folder
dev-vibe persona       # rebuild after code changes; no need to re-link
npm unlink -g dev-vibe # remove it when you're done
```

### Checks and tests

```bash
npm run check                # everything CI runs: data validation, lint, typecheck, tests
npm test                     # tests only
npx vitest                   # tests in watch mode
npx vitest run -t "base64"   # only tests whose name matches
npm run validate:data        # only check the data/*.json files
```

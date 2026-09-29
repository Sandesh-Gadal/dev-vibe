#!/usr/bin/env node
import { readFileSync } from "node:fs";
import chalk from "chalk";
import { Command } from "commander";
import { registerBase64 } from "./commands/base64.js";
import { registerExcuse } from "./commands/excuse.js";
import { registerPersona } from "./commands/persona.js";
import type { RegisterCommand } from "./types.js";

/** Add new commands here (keep the list alphabetical to reduce merge conflicts). */
const commands: RegisterCommand[] = [registerBase64, registerExcuse, registerPersona];

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

const program = new Command()
  .name("dev-vibe")
  .description("Developer persona generator and micro-utility toolbox for the terminal.")
  .version(version);

for (const register of commands) register(program);

try {
  await program.parseAsync();
} catch (error) {
  console.error(chalk.red(`✖ ${(error as Error).message}`));
  process.exitCode = 1;
}

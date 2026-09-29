import chalk from "chalk";
import type { RegisterCommand, Roast, Title } from "../types.js";
import { loadDataset } from "../utils/loader.js";
import { pick, seededRng, type Rng } from "../utils/random.js";

export interface Persona {
  title: Title;
  roast: Roast;
}

export function buildPersona(titles: readonly Title[], roasts: readonly Roast[], rng: Rng): Persona {
  return { title: pick(titles, rng), roast: pick(roasts, rng) };
}

function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Left-border card: no right border, so emoji display width never breaks alignment. */
export function renderPersonaCard({ title, roast }: Persona, name?: string): string {
  const width = 56;
  const bar = chalk.magenta("│");
  const heading = name ? ` ${name.toUpperCase()}'S DEV PERSONA ` : " YOUR DEV PERSONA ";
  const credit = (entry: { contributor?: string }) =>
    entry.contributor ? [`${bar} ${chalk.dim(`  — added by @${entry.contributor}`)}`] : [];

  return [
    chalk.magenta(`╭─${heading}${"─".repeat(Math.max(0, width - heading.length))}`),
    bar,
    `${bar} ${title.emoji}  ${chalk.bold.cyan(title.title)}`,
    ...wrap(title.description, width).map((line) => `${bar} ${line}`),
    ...credit(title),
    bar,
    `${bar} ${chalk.yellow("Signature roast:")}`,
    ...wrap(roast.text, width).map((line) => `${bar} ${chalk.italic(line)}`),
    ...credit(roast),
    bar,
    chalk.magenta(`╰${"─".repeat(width + 1)}`),
  ].join("\n");
}

export const registerPersona: RegisterCommand = (program) => {
  program
    .command("persona")
    .description("reveal your true developer archetype")
    .option("-n, --name <name>", "your name; the same name always gets the same persona")
    .action((options: { name?: string }) => {
      const rng = options.name ? seededRng(options.name.trim().toLowerCase()) : Math.random;
      const persona = buildPersona(loadDataset("titles"), loadDataset("roasts"), rng);
      console.log(renderPersonaCard(persona, options.name?.trim()));
    });
};

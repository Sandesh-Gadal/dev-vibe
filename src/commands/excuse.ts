import chalk from "chalk";
import type { RegisterCommand } from "../types.js";
import { loadDataset } from "../utils/loader.js";
import { pick } from "../utils/random.js";

export const registerExcuse: RegisterCommand = (program) => {
  program
    .command("excuse")
    .description("get a sarcastic excuse for why your code isn't working")
    .action(() => {
      const excuse = pick(loadDataset("excuses"));
      const credit = excuse.contributor ? chalk.dim(` (via @${excuse.contributor})`) : "";
      console.log(`${chalk.yellow("🤷")} ${chalk.bold(`"${excuse.text}"`)}${credit}`);
    });
};

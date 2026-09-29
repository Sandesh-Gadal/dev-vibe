import type { Command } from "commander";

/** Fields every community-contributed entry may carry. */
export interface Entry {
  /** GitHub username of the person who added the entry. */
  contributor?: string;
}

export interface Title extends Entry {
  emoji: string;
  title: string;
  description: string;
}

export interface Roast extends Entry {
  text: string;
}

export interface Excuse extends Entry {
  text: string;
}

/** Maps each file in `data/` (without `.json`) to the shape of its entries. */
export interface Datasets {
  titles: Title[];
  roasts: Roast[];
  excuses: Excuse[];
}

export type DatasetName = keyof Datasets;

/** Every command module exports one of these; `src/index.ts` calls it to attach the command. */
export type RegisterCommand = (program: Command) => void;

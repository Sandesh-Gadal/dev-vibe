export type Rng = () => number;

/** Returns a random element; `items` must be non-empty (the loader guarantees this for datasets). */
export function pick<T>(items: readonly T[], rng: Rng = Math.random): T {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error("pick() called with an empty list");
  return item;
}

/** Deterministic RNG (mulberry32) seeded from a string, so the same seed always gives the same results. */
export function seededRng(seed: string): Rng {
  let state = 2166136261;
  for (const char of seed) {
    state = Math.imul(state ^ char.codePointAt(0)!, 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

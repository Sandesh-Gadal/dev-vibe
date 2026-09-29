import type { RegisterCommand } from "../types.js";

const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function encodeBase64(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}

/** Strict decode: Node's own decoder silently ignores invalid characters, so check first. */
export function decodeBase64(encoded: string): string {
  const compact = encoded.replace(/\s+/g, "");
  if (!BASE64.test(compact)) {
    throw new Error("Input is not valid base64.");
  }
  return Buffer.from(compact, "base64").toString("utf8");
}

export const registerBase64: RegisterCommand = (program) => {
  program
    .command("base64")
    .description("encode text to base64 (or decode with --decode)")
    .argument("<text>", "text to encode or decode")
    .option("-d, --decode", "decode base64 back to text")
    .action((text: string, options: { decode?: boolean }) => {
      console.log(options.decode ? decodeBase64(text) : encodeBase64(text));
    });
};

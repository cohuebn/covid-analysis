import { randomUUID, randomBytes } from "node:crypto";

import randomWords from "random-words";

import { range } from "./range";

export function randomUuid(): string {
  return randomUUID();
}

export function randomInt(max = 255): number {
  return Math.floor(Math.random() * (max + 1));
}

type RandomFloatOptions = {
  min?: number;
  max?: number;
  decimals?: number;
};

export function randomFloat(options: RandomFloatOptions = {}): number {
  const min = options.min ?? 0;
  const max = options.max ?? 255;
  const decimals = options.decimals ?? 3;
  const fixedDecimalString = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(fixedDecimalString);
}

export function randomHederaId(): string {
  return `${randomInt()}.${randomInt()}.${randomInt()}`;
}

export function randomItem<T>(items: T[]): T {
  const index = randomInt(items.length - 1);
  return items[index];
}

export function randomSemver(): string {
  const prerelease = randomInt(1) > 0 ? "" : randomItem(["-beta", "-alpha", "-plinkin"]);
  return `${randomInt()}.${randomInt()}.${randomInt()}${prerelease}`;
}

export function randomStrings(wordCount = 1): string[] {
  return randomWords(wordCount);
}

type RandomStringOptions = {
  wordCount?: number;
  wordDelimiter?: string;
};
export function randomString(options: RandomStringOptions = {}): string {
  return randomWords(options.wordCount ?? 3).join(options.wordDelimiter ?? " ");
}

export function randomUrl(): string {
  const protocol = randomItem(["http", "https"]);
  const domain = randomString({ wordDelimiter: "" });
  const tld = randomItem(["com", "gov", "jpn", "tv"]);
  return `${protocol}://${domain}.${tld}`;
}

export function randomHex(length = 64, prefixWithZeroX = true) {
  const prefix = prefixWithZeroX ? "0x" : "";
  const hex = randomBytes(length).toString("hex");
  return `${prefix}${hex}`;
}

export function randomHexAddress(): string {
  return randomHex(40);
}

/**
 * Generate multiple items using the provided generator function
 * @param howMany The amount of the item to generate
 * @param generator The item generator function
 * @returns A list of generated items
 */
export function generate<T>(howMany: number, generator: () => T): T[] {
  return range(1, howMany).map(generator);
}

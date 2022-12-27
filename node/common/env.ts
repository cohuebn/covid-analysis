import { isNotNullOrUndefined } from "./is-not-null-or-undefined";

export function getRequired(envVar: string): string {
  const value = process.env[envVar];
  if (typeof value === "undefined") {
    throw new Error(`${envVar} should be set on the environment`);
  }
  return value;
}

export function getOptional(envVar: string, defaultValue?: string) {
  return process.env[envVar] ?? defaultValue;
}

export function getTransformedOptional<T>(envVar: string, transformer: (value: string) => T) {
  const value = getOptional(envVar);
  return isNotNullOrUndefined(value) ? transformer(value) : value;
}

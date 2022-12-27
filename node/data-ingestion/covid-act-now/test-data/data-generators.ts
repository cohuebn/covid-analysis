/**
 * Convert data to a given type. This is only necesary because we have types that aren't
 * easily creatable in Typescript due to the way Cory created them. This is tech debt that should
 * go away eventually
 * @param data The data to cast as the given type
 * @returns The data cast as that type
 */
export function as<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

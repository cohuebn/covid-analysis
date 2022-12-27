import { County } from "../types";
import { randomItem, randomString, randomInt } from "../../../common/data-generator";

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

export function generateCounty(data: Partial<County> = {}): County {
  return {
    id: data.id ?? randomString(),
    fips: `${randomInt(10000)}`,
    county: data.county ?? randomString(),
    state: data.state ?? randomItem(["IL", "MO", "IN"]),
    country: data.country ?? "US",
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    level: "county",
  };
}

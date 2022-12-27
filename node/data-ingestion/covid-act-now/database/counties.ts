import { County } from "../types";

import { initializeConnection, sql } from "./postgresdb";
import { upsert } from "./upsert";

export async function saveCounties(counties: County[]) {
  await initializeConnection();
  await upsert({ table: "counties", items: counties, keyFields: ["id"] });
}

export async function getCountyByName(state: string, name: string): Promise<County | null> {
  await initializeConnection();
  const results = await sql`
    select id, fips, county, state, country, level, latitude, longitude
    from counties
    where state=${state}
    and county = ${name}
  `;
  return results.length ? (results[0] as County) : null;
}

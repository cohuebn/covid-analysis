import { County } from "../types";

import { initializeConnection, sql } from "./postgresdb";
import { upsert } from "./upsert";

export async function saveCounties(counties: County[]) {
  await initializeConnection();
  await upsert({ table: "counties", items: counties, keyFields: ["id"] });
}

type HasCountyId = { id: string };
type HasStateAndName = {
  state: string;
  name: string;
};
type CountyLookup = HasStateAndName | HasCountyId;

export async function getCountyByName(filterCriteria: CountyLookup): Promise<County | null> {
  await initializeConnection();
  const filter =
    "id" in filterCriteria
      ? sql`where id=${filterCriteria.id}`
      : sql`where state=${filterCriteria.state} and county = ${filterCriteria.name}`;
  const results = await sql`
    select id, fips, county, state, country, level, latitude, longitude
    from counties
    ${filter}
  `;
  return results.length ? (results[0] as County) : null;
}

import split from "just-split";

import { County, CountyMetric } from "../types";

import { initializeConnection, sql } from "./postgresdb";
import { upsert } from "./upsert";

export async function saveCounties(items: County[]) {
  await initializeConnection();
  await upsert({ table: "counties", items, keyFields: ["id"] });
}

type HasCountyId = { id: string };
type HasStateAndName = {
  state: string;
  name: string;
};
type CountyLookup = HasStateAndName | HasCountyId;

export async function getCounty(filterCriteria: CountyLookup): Promise<County | null> {
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

export async function saveCountyMetrics(items: CountyMetric[]) {
  await initializeConnection();
  const batches = split(items, 50);
  await batches.reduce(async (previousBatches, currentBatch) => {
    await previousBatches;
    await upsert({
      table: "county_metrics",
      items: currentBatch,
      keyFields: ["county_id", "metric_name", "time"],
    });
  }, Promise.resolve());
}

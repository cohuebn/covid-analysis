import path from "node:path";

import fetch from "node-fetch";
import unique from "just-unique";
import split from "just-split";

import { createLogger } from "../../common/logger";

import { config } from "./config";
import { HistoricalCountyResponse } from "./types";
import { parseHistoricalCountyResponse } from "./parse-historical-county-response";
import { saveCounties, saveCountyMetrics } from "./database/counties";

const logger = createLogger(path.basename(__filename));

export async function fetchCountyData(state: string) {
  const url = `${config.actNowUrl}/v2/county/${state}.timeseries.json?apiKey=${config.actNowKey}`;
  const response = await fetch(url);
  const items = (await response.json()) as HistoricalCountyResponse[];
  const distinctCounties = unique(items.map((item) => item.county));
  logger.trace({ url, state, distinctCounties, itemCount: items.length }, "Distinct counties");
  return items;
}

export async function ingestCountyData(state: string) {
  const batchSize = 20;
  const countyData = await fetchCountyData(state);
  const countyBatches = split(countyData, batchSize);
  await countyBatches.reduce(async (previousBatches, currentBatch) => {
    await previousBatches;
    const { counties, metrics } = parseHistoricalCountyResponse(currentBatch);
    await saveCounties(Object.values(counties));
    await saveCountyMetrics(metrics);
  }, Promise.resolve());
}

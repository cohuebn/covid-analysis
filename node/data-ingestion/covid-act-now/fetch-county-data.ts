import path from "node:path";

import fetch from "node-fetch";
import unique from "just-unique";

import { createLogger } from "../../common/logger";

import { config } from "./config";
import { HistoricalCountyResponse } from "./types";

const logger = createLogger(path.basename(__filename));

export async function fetchCountyData(state: string) {
  const url = `${config.actNowUrl}/v2/county/${state}.timeseries.json?apiKey=${config.actNowKey}`;
  const response = await fetch(url);
  const items = (await response.json()) as HistoricalCountyResponse[];
  const distinctCounties = unique(items.map((item) => item.county));
  logger.trace({ url, state, distinctCounties, itemCount: items.length }, "Distinct counties");
  return items;
}

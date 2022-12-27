import { parseHistoricalCountyResponse } from "./parse-historical-county-response";
import exampleCountyData from "./test-data/county-metrics.json";
import { as } from "./test-data/data-generators";
import { HistoricalCountyResponse } from "./types";

describe("parseHistoricalCountyResponse", () => {
  it("should parse base county data", () => {
    const result = parseHistoricalCountyResponse(as<HistoricalCountyResponse[]>(exampleCountyData));
    expect(result.counties).toHaveProperty("iso1:us#iso2:us-il#fips:17001");
    const adamsCountyData = result.counties["iso1:us#iso2:us-il#fips:17001"];
    expect(adamsCountyData.county).toBe("Adams");
  });
});

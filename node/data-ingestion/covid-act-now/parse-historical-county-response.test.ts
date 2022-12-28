import { parseISO, isSameDay, startOfDay, compareAsc } from "date-fns";

import { parseHistoricalCountyResponse } from "./parse-historical-county-response";
import exampleCountyData from "./test-data/county-metrics.json";
import { as } from "./test-data/data-generators";
import { HistoricalCountyResponse } from "./types";

describe("parseHistoricalCountyResponse", () => {
  it("should parse county data", () => {
    const result = parseHistoricalCountyResponse(as<HistoricalCountyResponse[]>(exampleCountyData));
    expect(result.counties).toHaveProperty("iso1:us#iso2:us-il#fips:17001");
    const adamsCountyData = result.counties["iso1:us#iso2:us-il#fips:17001"];
    expect(adamsCountyData.county).toBe("Adams");
    expect(adamsCountyData.state).toBe("IL");
    expect(adamsCountyData.country).toBe("US");
    expect(adamsCountyData.level).toBe("county");
    expect(adamsCountyData.latitude).toBeNull();
    expect(adamsCountyData.longitude).toBeNull();
  });

  it("should parse population metric", () => {
    const result = parseHistoricalCountyResponse(as<HistoricalCountyResponse[]>(exampleCountyData));
    const adamsCountyPopulation = result.metrics.filter(
      (metric) =>
        metric.metricName === "population" && metric.countyId === "iso1:us#iso2:us-il#fips:17001"
    );
    expect(adamsCountyPopulation).toHaveLength(2);
    const sortedPopulations = [...adamsCountyPopulation].sort((a, b) => compareAsc(a.time, b.time));
    expect(startOfDay(sortedPopulations[0].time)).toEqual(startOfDay(parseISO("2020-03-06")));
    expect(adamsCountyPopulation[0].val).toBe(65435);
    expect(startOfDay(sortedPopulations[1].time)).toEqual(startOfDay(parseISO("2022-12-23")));
    expect(adamsCountyPopulation[1].val).toBe(65435);
  });

  it("should parse time-based metrics", () => {
    const result = parseHistoricalCountyResponse(as<HistoricalCountyResponse[]>(exampleCountyData));
    const latestAdamsCountyMetrics = result.metrics.filter(
      (metric) =>
        metric.countyId === "iso1:us#iso2:us-il#fips:17001" &&
        isSameDay(metric.time, parseISO("2020-03-08"))
    );
    const latestTestPositivityRatio = latestAdamsCountyMetrics.find(
      (x) => x.metricName === "testPositivityRatio"
    );
    expect(latestTestPositivityRatio?.val).toBe(0.5);

    const latestCaseDensity = latestAdamsCountyMetrics.find((x) => x.metricName === "caseDensity");
    expect(latestCaseDensity?.val).toBe(0.25);

    const latestWeeklyNewCasesPer100k = latestAdamsCountyMetrics.find(
      (x) => x.metricName === "weeklyNewCasesPer100k"
    );
    expect(latestWeeklyNewCasesPer100k?.val).toBe(1);
  });

  it("should parse time-based actuals", () => {
    const result = parseHistoricalCountyResponse(as<HistoricalCountyResponse[]>(exampleCountyData));
    const latestAdamsCountyActuals = result.metrics.filter(
      (metric) =>
        metric.countyId === "iso1:us#iso2:us-il#fips:17001" &&
        isSameDay(metric.time, parseISO("2022-12-23"))
    );

    const latestCases = latestAdamsCountyActuals.find((x) => x.metricName === "cases");
    expect(latestCases?.val).toBe(1535);
    const latestDeaths = latestAdamsCountyActuals.find((x) => x.metricName === "deaths");
    expect(latestDeaths?.val).toBe(32);
    const latestNewCases = latestAdamsCountyActuals.find((x) => x.metricName === "newCases");
    expect(latestNewCases?.val).toBe(1);
    const latestNewDeaths = latestAdamsCountyActuals.find((x) => x.metricName === "newDeaths");
    expect(latestNewDeaths?.val).toBe(0);
  });
});

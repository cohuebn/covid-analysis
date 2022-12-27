import { parseISO } from "date-fns";

import { isNotNullOrUndefined } from "../../common/is-not-null-or-undefined";

import {
  County,
  CountyMetric,
  HistoricalCountyResponse,
  MetricsTimeseriesDatapoint,
} from "./types";

function removeCountySuffix(input: string) {
  return input.replace(/\s+county$/i, "");
}

function getCounty(item: HistoricalCountyResponse): County {
  return {
    id: item.locationId,
    fips: item.fips,
    county: removeCountySuffix(item.county),
    state: item.state,
    country: item.country,
    level: item.level,
    latitude: item.lat,
    longitude: item.long,
  };
}

function getPopulatedTimeseriesMetrics(
  countyId: string,
  dataPoint: MetricsTimeseriesDatapoint
): CountyMetric[] {
  return Object.entries(dataPoint).reduce<CountyMetric[]>((timeseriesMetrics, [key, value]) => {
    if (key === "date" || typeof value !== "number" || !isNotNullOrUndefined(value)) {
      return timeseriesMetrics;
    }
    const timeseriesMetric: CountyMetric = {
      countyId,
      metricName: key,
      val: value as number,
      time: parseISO(dataPoint.date),
    };
    return [...timeseriesMetrics, timeseriesMetric];
  }, []);
}

function getMetrics(item: HistoricalCountyResponse): CountyMetric[] {
  const countyId = item.locationId;
  const populationMetric: CountyMetric = {
    countyId,
    metricName: "population",
    time: new Date(),
    val: item.population,
  };
  const timeSeriesMetrics = item.metricsTimeseries.flatMap((timeseriesDatapoint) =>
    getPopulatedTimeseriesMetrics(countyId, timeseriesDatapoint)
  );
  return [populationMetric, ...timeSeriesMetrics];
}

type ParsedCountyMetrics = {
  counties: Record<string, County>;
  metrics: CountyMetric[];
};

export function parseHistoricalCountyResponse(
  response: HistoricalCountyResponse[]
): ParsedCountyMetrics {
  const counties = response.reduce((_counties, item) => {
    const countyData = getCounty(item);
    return {
      ..._counties,
      [countyData.id]: countyData,
    };
  }, {});
  const metrics = response.flatMap(getMetrics);
  return { counties, metrics };
}

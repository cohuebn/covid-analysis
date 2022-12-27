import { County, HistoricalCountyResponse } from "./types";

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
    latLong: item.lat && item.long ? { latitude: item.lat, longitude: item.long } : null,
  };
}

type ParsedCountyMetrics = {
  counties: Record<string, County>;
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
  return { counties };
}

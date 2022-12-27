type BaseCounty = {
  fips: string;
  country: string;
  state: string;
  county: string;
  level: "county";
};

export type HistoricalCountyResponse = BaseCounty & {
  locationId: string;
  lat: number | null;
  long: number | null;
  population: number;
  hsa: string;
  hsaName: string;
  hsaPopulation: number;
};

export type Point = {
  latitude: number;
  longitude: number;
};

export type County = BaseCounty & {
  id: string;
  latLong: Point | null;
};

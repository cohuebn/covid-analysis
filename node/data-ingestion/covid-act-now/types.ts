import { JSONValue, Serializable } from "postgres";

export type UpsertableValue = Serializable | JSONValue;
export type UpsertableItem = Record<string, UpsertableValue>;

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
  latitude: number | null;
  longitude: number | null;
  // TODO - figure out how to upsert points
  // latLong: Point | null;
};

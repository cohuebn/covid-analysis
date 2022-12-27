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

export type MetricsTimeseriesDatapoint = {
  testPositivityRatio: number | null;
  caseDensity: number | null;
  weeklyNewCasesPer100k: number | null;
  contactTracerCapacityRatio: number | null;
  infectionRate: number | null;
  infectionRateCI90: number | null;
  icuCapacityRatio: number | null;
  bedsWithCovidPatientsRatio: number | null;
  weeklyCovidAdmissionsPer100k: number | null;
  date: string;
};

export type HistoricalCountyResponse = BaseCounty & {
  locationId: string;
  lat: number | null;
  long: number | null;
  population: number;
  hsa: string;
  hsaName: string;
  hsaPopulation: number;
  metricsTimeseries: MetricsTimeseriesDatapoint[];
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

export type Metric = {
  time: Date;
  metricName: string;
  val: number;
};

export type CountyMetric = Metric & {
  countyId: string;
};

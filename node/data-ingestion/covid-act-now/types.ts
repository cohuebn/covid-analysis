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

type NullableNumber = number | null;

export type MetricsTimeseriesDatapoint = {
  testPositivityRatio: NullableNumber;
  caseDensity: NullableNumber;
  weeklyNewCasesPer100k: NullableNumber;
  contactTracerCapacityRatio: NullableNumber;
  infectionRate: NullableNumber;
  infectionRateCI90: NullableNumber;
  icuCapacityRatio: NullableNumber;
  bedsWithCovidPatientsRatio: NullableNumber;
  weeklyCovidAdmissionsPer100k: NullableNumber;
  date: string;
};

export type ActualsTimeseriesDatapoint = {
  cases: NullableNumber;
  deaths: NullableNumber;
  positiveTests: NullableNumber;
  negativeTests: NullableNumber;
  newCases: NullableNumber;
  newDeaths: NullableNumber;
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
  actualsTimeseries: ActualsTimeseriesDatapoint[];
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
  source: string;
};

export type CountyMetric = Metric & {
  countyId: string;
};

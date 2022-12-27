create table if not exists county (
  id text not null,
  fips text,
  country text,
  state text,
  county text,
  level text,
  latlong point,

  primary key (id)
);

create table if not exists countyStatistics (
  countyId text not null,
  population bigint,

  primary key (countyId)
);

create table if not exists countyMetrics (
  countyId text not null,
  time timestamptz not null,
  testPositivityRatio numeric,
  caseDensity numeric,
  weeklyNewCasesPer100k numeric,
  contactTracerCapacityRatio numeric,
  infectionRate numeric,
  infectionRateCI90 numeric,
  icuCapacityRatio numeric,
  bedsWithCovidPatientsRatio numeric,
  weeklyCovidAdmissionsPer100k numeric,

  primary key (countyId, time)
);

select create_hypertable('countyMetrics', 'time', if_not_exists => true);
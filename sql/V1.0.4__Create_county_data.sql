create table if not exists counties (
  id text not null,
  fips text,
  country text,
  state text,
  county text,
  level text,
  latitude numeric,
  longitude numeric,

  primary key (id)
);

create index if not exists ix_counties_county on counties (state, county);

create table if not exists countyMetrics (
  countyId text not null,
  time timestamptz not null,
  metricName text not null,
  val numeric,

  primary key (countyId, time)
);

select create_hypertable('countyMetrics', 'time', if_not_exists => true);

create index if not exists ix_countyMetrics_countyId on countyMetrics (county, time);
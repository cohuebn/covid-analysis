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

create table if not exists county_metrics (
  county_id text not null,
  metric_name text not null,
  time timestamptz not null,
  val numeric,
  source text,

  primary key (county_id, metric_name, time)
);

select create_hypertable('county_metrics', 'time', if_not_exists => true);
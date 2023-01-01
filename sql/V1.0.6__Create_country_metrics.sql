create table if not exists countries (
  id text not null,
  country text,
  primary key (id)
);

create index if not exists ix_countries_country on countries (country);

create table if not exists country_metrics (
  country_id text not null,
  metric_name text not null,
  time timestamptz not null,
  val numeric,
  source text,

  primary key (country_id, metric_name, time)
);

select create_hypertable('country_metrics', 'time', if_not_exists => true);
create or replace function get_country_metrics (_fromTime timestamptz, _toTime timestamptz, _metric_name text, _country_ids text[])
returns table (
  country_id text,
  country text,
  "time" timestamptz,
  metric_name text,
  val numeric
)
as $$
 with filteredCountries as (
  select c.id, c.country
  from countries c
  where _country_ids is null or c.id = any(_country_ids)
),inRangeMetrics as (
  select
    cm.country_id,
    c.country,
    time,
    cm.metric_name,
    cm.val
  from country_metrics cm
  join filteredCountries c on cm.country_id = c.id
  where cm.time between _fromTime and _toTime
  and metric_name = _metric_name
),
firstOutOfRangeMetrics as (
  select
    cm.country_id,
    c.country,
    last(cm.time, cm.time) as time,
    cm.metric_name,
    last(cm.val, cm.time) as val
  from country_metrics cm
  join filteredCountries c on cm.country_id = c.id
  where time < _fromTime
  and metric_name = _metric_name
  group by cm.country_id, c.country, cm.metric_name
),
allMetrics as (
  select country_id, country, time, metric_name, val
  from inRangeMetrics
  union
  select country_id, country, time, metric_name, val
  from firstOutOfRangeMetrics
)
select m.country_id, m.country, m.time, m.metric_name, m.val
from allMetrics m
$$ language sql;
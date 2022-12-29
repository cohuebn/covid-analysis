create or replace function get_county_metrics (_fromTime timestamptz, _toTime timestamptz, _metric_name text, _county_ids text[])
returns table (
  county_id text,
  county text,
  "time" timestamptz,
  metric_name text,
  val numeric
)
as $$
 with filteredCounties as (
  select c.id, c.county || ' - ' || c.state as county
  from counties c
  where _county_ids is null or c.id = any(_county_ids)
),inRangeMetrics as (
  select
    cm.county_id,
    c.county,
    time,
    cm.metric_name,
    cm.val
  from county_metrics cm
  join filteredCounties c on cm.county_id = c.id
  where cm.time between _fromTime and _toTime
  and metric_name = _metric_name
),
firstOutOfRangeMetrics as (
  select
    cm.county_id,
    c.county,
    last(cm.time, cm.time) as time,
    cm.metric_name,
    last(cm.val, cm.time) as val
  from county_metrics cm
  join filteredCounties c on cm.county_id = c.id
  where time < _fromTime
  and metric_name = _metric_name
  group by cm.county_id, c.county, cm.metric_name
),
allMetrics as (
  select county_id, county, time, metric_name, val
  from inRangeMetrics
  union
  select county_id, county, time, metric_name, val
  from firstOutOfRangeMetrics
)
select m.county_id, m.county, m.time, m.metric_name, m.val
from allMetrics m
$$ language sql;
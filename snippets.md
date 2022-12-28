# Snippets

Snippets to reference for future-me to build stuff with

## Local runs

- Docker the infra (Timescale, Grafana, etc.): `docker compose -f local.docker-compose.yml up`

## COVID Act Now

- Export API key: `export ACT_NOW_KEY=<key_here>`
- Get single-state county-data: `curl "https://api.covidactnow.org/v2/county/IL.timeseries.json?apiKey=$ACT_NOW_KEY" | jq > /tmp/act-now-county-data.json`
- Run data ingestion locally from the [node directory](./node/): `ACT_NOW_KEY='<act_now_api_key>' DOTENV_CONFIG_PATH=../.env node -r esbuild-runner/register -r dotenv/config dev.ts`
- Population query:

```
with inRangePopulations as (
  select
    c.county,
    time_bucket_gapfill('1 week', time) as time,
    cm.metric_name,
    cm.val
  from county_metrics cm
  join counties c on cm.county_id = c.id
  where $__timeFilter(time)
  and metric_name = 'population'
  and (coalesce(${county:sqlstring}, '') = '' or county in (${county:sqlstring}))
),
firstOutOfRangePopulation as (
  select
    c.county,
    last(cm.time, cm.time) as time,
    cm.metric_name,
    last(cm.val, cm.time) as val
  from county_metrics cm
  join counties c on cm.county_id = c.id
  where time < '${__from:date:iso:sqlstring}'
  and metric_name = 'population'
  and (coalesce(${county:sqlstring}, '') = '' or county in (${county:sqlstring}))
  group by c.county, cm.metric_name
),
allPopulations as (
  select county, time, metric_name, val
  from inRangePopulations
  union
  select county, time, metric_name, val
  from firstOutOfRangePopulation
)
select county, time, metric_name, val
from allPopulations
```

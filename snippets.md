# Snippets

Snippets to reference for future-me to build stuff with

## COVID Act Now

- Export API key: `export ACT_NOW_KEY=<key_here>`
- Get single-state county-data: `curl "https://api.covidactnow.org/v2/county/IL.timeseries.json?apiKey=$ACT_NOW_KEY" | jq > /tmp/act-now-county-data.json`

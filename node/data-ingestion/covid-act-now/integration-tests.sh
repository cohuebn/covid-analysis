#!/bin/bash

scriptDir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
rootDir="$scriptDir/../../.."
databaseDockerfile="$rootDir/local.docker-compose.yml"
databaseEnvFile="$rootDir/.env"
jestConfig="$rootDir/node/jest.config.js"

# Spin up local dependencies
docker compose -f $databaseDockerfile --env-file $databaseEnvFile up --build --force-recreate -d

# Run the tests against the local dependencies
# Special handling to get the "project" directory regardless of where the script was initiated
project=$(basename $scriptDir)
env $(cat "$databaseEnvFile" | xargs) \
    LOG_LEVEL=${LOG_LEVEL} node $(npm bin)/jest --testMatch="<rootDir>/$PROJECT/**/*.integration-test.ts" \
    --testTimeout=120000 --runInBand --node-options='--trace-warnings' \
    --config="$jestConfig"
testExitCode=$?

# Spin down the local dependencies
docker compose -f $databaseDockerfile --env-file $databaseEnvFile down

exit $testExitCode

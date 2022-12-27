#!/bin/bash

# Set working directory to the script directory to keep relative references intact
originalDir=$(pwd)
scriptDir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$scriptDir"

if [ -z "$PROJECT" ]; then
  # Get all directories containing test scripts in an array
  testScripts=($(ls **/*/integration-tests.sh))
else
  # Just put the requested project into the array
  testScripts=("$PROJECT/integration-tests.sh")
fi

failedTests=()
for testScript in "${testScripts[@]}"; do
  integrationTestScript="$scriptDir/$testScript"
  if [ -f "$integrationTestScript" ]; then
    LOG_LEVEL=${LOG_LEVEL:-warn} $integrationTestScript || failedTests+=("$testScript")
  else
    echo "No integration test script found. Looking for a file named '$integrationTestScript'"
    echo "Skipping integration test run"
  fi
done

# Switch back to the original directory
cd $originalDir

if [ ${#failedTests[@]} -eq 0 ]; then
    echo "Integration tests succeeded"
    exit 0
else
    >&2 echo "Failed tests: ${failedTests[*]}"
    exit 1
fi

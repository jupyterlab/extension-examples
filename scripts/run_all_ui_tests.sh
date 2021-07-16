#!/bin/bash
set -e
HERE=$(dirname $0)
# Run the passed argument; fallback to `npx playwright test` define in docker-compose.yml
## To update all screenshots run ./scripts/run_all_ui_tests.sh npx playwright test -u
COMMAND=$*

declare -a extensions=("command-palette" "commands" "context-menu" "custom-log-console" "datagrid" "hello-world" "kernel-messaging" "kernel-output" "launcher" "log-messages" "main-menu" "react-widget" "settings" "signals" "state" "toolbar-button" "widgets")

# Build docker image
docker-compose -f $HERE/../end-to-end-tests/docker-compose.yml --env-file $HERE/../hello-world/ui-tests/.env build

for ext in ${extensions[@]}; do
    echo Run \`$COMMAND\` on \'$ext\'
    docker-compose -f $HERE/../end-to-end-tests/docker-compose.yml --env-file $HERE/../$ext/ui-tests/.env run --rm e2e $COMMAND || true
    docker-compose -f $HERE/../end-to-end-tests/docker-compose.yml --env-file $HERE/../$ext/ui-tests/.env down
done

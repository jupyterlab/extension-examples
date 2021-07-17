#!/bin/bash
set -e
HERE=$(dirname $0)
# Run the passed argument; fallback to `npx playwright test`
## To update all screenshots run ./scripts/run_all_ui_tests.sh npx playwright test -u
COMMAND=${*:-npx playwright test}

declare -a extensions=("command-palette" "commands" "context-menu" "custom-log-console" "datagrid" "hello-world" "kernel-messaging" "kernel-output" "launcher" "log-messages" "main-menu" "react-widget" "settings" "signals" "state" "toolbar-button" "widgets")

# Build docker image
docker-compose -f $HERE/../end-to-end-tests/docker-compose.yml build --no-cache

for ext in ${extensions[@]}; do
    echo Run \`$COMMAND\` on \'$ext\'
    pushd $HERE/../$ext
    docker-compose -f ../end-to-end-tests/docker-compose.yml --env-file ./ui-tests/.env run --rm e2e $COMMAND || true
    docker-compose -f ../end-to-end-tests/docker-compose.yml --env-file ./ui-tests/.env down
    popd
done

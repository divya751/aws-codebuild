#!/bin/bash
. $DEVTOOLS_HOME/common_functions.sh
set -e

./build.sh && ./deploy.sh "$@"

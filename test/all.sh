#!/usr/bin/env bash

set -e

$(dirname $0)/help.sh
$(dirname $0)/list.sh
$(dirname $0)/show.sh
$(dirname $0)/transform.sh
$(dirname $0)/update.sh

echo -e '\e[32mall tests passed!\e[0m'

#!/usr/bin/env bash

set -e

source $(dirname $0)/helpers.sh

it_can_list() {
  local repo_osb=$(init_repo_osb)
  
  unipipe list "$repo_osb"
}

run it_can_list

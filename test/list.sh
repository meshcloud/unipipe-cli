#!/usr/bin/env bash

set -e

source $(dirname $0)/helpers.sh

it_can_list() {
  local repo_osb=$(init_repo)
  cp -r ./osb-git/ "$repo_osb"
  
  local ref=$(make_commit_with_all_changes "$repo_osb")

  echo "Input repo OSB"
  tree "$repo_osb"

  unipipe list "$repo_osb"
}

run it_can_list

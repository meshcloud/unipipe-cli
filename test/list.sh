#!/usr/bin/env bash

set -e

source $(dirname $0)/helpers.sh

it_can_list() {
  local repo_osb=$(init_repo_osb)
  
  unipipe list "$repo_osb"
}

it_can_list_with_meshmarketplace_columns() {
  local repo_osb=$(init_repo_osb)
  
  out=$(unipipe list --profile meshmarketplace "$repo_osb")
  echo "$out"
  
  cols=$(echo "$out" | head -n 1 | xargs)

  assert_eq "id customer project service plan status deleted" "$cols" "cols match"
}

it_can_list_with_cloudfoundry_columns() {
  local repo_osb=$(init_repo_osb)
  
  out=$(unipipe list --profile cloudfoundry "$repo_osb")
  echo "$out"

  cols=$(echo "$out" | head -n 1 | xargs)

  assert_eq "id organization space service plan status deleted" "$cols" "cols match"
}

it_can_list_with_unknown_profile() {
  local repo_osb=$(init_repo_osb)
  
  out=$(unipipe list --profile xx "$repo_osb" 2>&1) || true
  
  assert_eq "Unrecognized --profile: xx" "$out" "expected error"
}

it_can_list_with_output_json() {
  local repo_osb=$(init_repo_osb)
  
  out=$(unipipe list -o json "$repo_osb" | jq -r .[0].instance.serviceInstanceId)
  
  assert_eq "eed1df43-e63c-40ad-995e-e21068254ef9" "$out" "expected jq pipe works"
}

run it_can_list
run it_can_list_with_meshmarketplace_columns
run it_can_list_with_cloudfoundry_columns
run it_can_list_with_unknown_profile
run it_can_list_with_output_json
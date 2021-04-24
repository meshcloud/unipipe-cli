#!/usr/bin/env bash

set -e

source $(dirname $0)/helpers.sh

it_can_show_generate_help() {
  unipipe generate --help
}

it_can_generate_uuid() {
  local uuid=$(unipipe generate uuid)
  assert_eq 36 ${#uuid} "uuid length matches"
}

it_can_generate_yaml() {
  local catalog=$(unipipe generate catalog)
  
  deno run ./parse-yaml.ts -q <<< "$catalog"
}

run it_can_show_generate_help
run it_can_generate_uuid
run it_can_generate_yaml

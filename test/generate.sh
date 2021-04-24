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

it_can_generate_catalog() {
  local catalog=$(unipipe generate catalog)
  
  # test the generated catalog is valid yaml
  deno run ./parse-yaml.ts -q <<< "$catalog"
}

it_can_generate_transform-handler() {
  local handler=$(unipipe generate transform-handler)
  
  # test the generated handler is valid js
  deno run --no-check - <<< "// deno-lint-ignore-file\n $handler"
}

run it_can_show_generate_help
run it_can_generate_uuid
run it_can_generate_catalog
run it_can_generate_transform-handler
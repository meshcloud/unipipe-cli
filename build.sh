#!/usr/bin/env bash

set -e

mkdir -p bin
deno compile --unstable --lite --allow-read --allow-write --allow-env --output ./bin/unipipe unipipe/main.ts
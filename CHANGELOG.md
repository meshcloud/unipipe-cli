# Changelog

## vNext

- generate aci-deployment: use local backend by default in generated terraform

## v0.5.0

- transform: rename the `-h/--handler` option to `-r/--registry-of-handlers` to avoid a clash with `-h/--help`
- generate: add a command to `generate` an ACI deployment for unipipe-service-broker
- list: add `--status` and `--deleted` filter options

## v0.4.0

- add support for reading service bindings, they are now available in `show`, `list`and `transform` commands
- `show` command format option now defaults to yaml

## v0.3.0

- upgraded deno runtime to 1.9
- improved robustness of command/option parsing
- added a new `generate` command that can generate commonly needed artifacts for working with unipipe-service-broker like catalog files, uuids. More generatable blueprints to follow soon.

## v0.2.0

- list: added `--output-format` option to select text or json output. JSON output is useful for chaining to other tools like jq.
- list: added `--profile` option to display key OSB API profile fields like when using `output-format text`. Currently supports OSB API profiles for meshcloud meshMarketplace and Cloud Foundry.

## v0.1.0

Initial release.

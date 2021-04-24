// a KISS deno script to parse yaml and output it as json
// this allows us to test a) yaml is valid and b) access properties using jq

import * as yaml from 'https://deno.land/std@0.90.0/encoding/yaml.ts';

const stdin = new TextDecoder().decode(
  await Deno.readAll(Deno.stdin),
);

const obj = yaml.parse(stdin);

const quiet = Deno.args.includes("-q");

if (!quiet) {
  console.log(JSON.stringify(obj));
}

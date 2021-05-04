#!/usr/bin/env bash

set -e

deno_flags="--unstable --allow-read --allow-write --allow-env"

mkdir -p bin

compile(){
  target="$1"

  deno compile $deno_flags --lite --target "$target" --output "./bin/unipipe-$target" unipipe/main.ts
}

deno test $deno_flags

compile "x86_64-unknown-linux-gnu"
compile "x86_64-apple-darwin"
compile "x86_64-pc-windows-msvc"


# first grep filters for the first line of the output "deno 1.8.1 (release, x86_64-apple-darwin)"
# second grep extracts the architecture string, but can't get rid of the trailing ): "x86_64-apple-darwin)"
# sed then removes the last trailing character: "x86_64-apple-darwin"
arch=$(deno --version | grep deno | grep -o "[a-z0-9_-]*)" | sed 's/.$//')

echo "currently running on $arch, creating symlink at ./bin/unipipe"
ln -fs "./unipipe-$arch" ./bin/unipipe
chmod +x ./bin/unipipe
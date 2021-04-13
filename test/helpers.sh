#!/usr/bin/env bash

set -e -u

set -o pipefail

source $(dirname $0)/assert.sh

export TMPDIR_ROOT=$(mktemp -d /tmp/git-tests.XXXXXX)
# ensure that tmp directories get cleaned up after tests
# trap "rm -rf $TMPDIR_ROOT" EXIT

run() {
  export TMPDIR=$(mktemp -d ${TMPDIR_ROOT}/git-tests.XXXXXX)

  echo -e 'running \e[33m'"$@"$'\e[0m...'
  eval "$@" 2>&1 | sed -e 's/^/  /g'
  echo ""
}

unipipe() {
  # check if a binary was set via env (e.g. from all.sh)
  local unipipe_bin
  unipipe_bin="${UNIPIPE_BIN:-../unipipe/unipipe.sh}"

  "$unipipe_bin" "$@"
}

init_repo() {
  (
    set -e

    cd $(mktemp -d $TMPDIR/repo.XXXXXX)

    git init -q

    # start with an initial commit
    git \
      -c user.name='test' \
      -c user.email='test@example.com' \
      commit -q --allow-empty -m "init"

    # create some bogus branch
    git checkout -q -b bogus

    git \
      -c user.name='test' \
      -c user.email='test@example.com' \
      commit -q --allow-empty -m "commit on other branch"

    # back to master
    git checkout -q master

    # print resulting repo
    pwd
  )
}

make_commit_to_file_on_branch() {
  local repo=$1
  local file=$2
  local branch=$3
  local msg=${4-}

  # ensure branch exists
  if ! git -C $repo rev-parse --verify $branch >/dev/null; then
    git -C $repo branch $branch master
  fi

  # switch to branch
  git -C $repo checkout -q $branch

  # ensure dir exists
  mkdir -p "$(dirname $repo/$file)"
  # modify file and commit
  echo x >> $repo/$file
  git -C $repo add $file
  git -C $repo \
    -c user.name='test' \
    -c user.email='test@example.com' \
    commit -q -m "commit $(wc -l $repo/$file) $msg"

  # output resulting sha
  git -C $repo rev-parse HEAD
}

make_commit_to_file() {
  make_commit_to_file_on_branch $1 $2 master "${3-}"
}

make_commit_to_branch() {
  make_commit_to_file_on_branch $1 some-file $2
}

make_commit() {
  make_commit_to_file $1 some-file "${2:-}"
}

make_commit_with_all_changes() {
  local repo="$1"

  git -C $repo add .
  git -C $repo \
    -c user.name='test' \
    -c user.email='test@example.com' \
    commit -q -m "commit"

  # output resulting sha
  git -C $repo rev-parse HEAD
}
 
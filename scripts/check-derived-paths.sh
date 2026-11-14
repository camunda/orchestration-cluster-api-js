#!/usr/bin/env bash
# Allowlist for the backport workflow's regeneration patch.
#
#   check-derived-paths.sh --list        print the derived paths, space-separated
#   check-derived-paths.sh < paths       read NUL-separated repo paths on stdin;
#                                        exit 1 if any is not a derived path
#
# The backport workflow regenerates stable-branch backports in a job with no
# credentials, then a trusted job applies the resulting patch and pushes it
# with the automation App's token. This check runs in the trusted job, from the
# workflow's own commit (never from the backport branch), and fails closed:
# an empty, absolute, `..`-containing or unlisted path rejects the whole patch.
#
# Keep DERIVED in sync with the restore list in AGENTS.md
# "Backporting to stable branches".
set -euo pipefail

# Directories end in '/', files are exact.
DERIVED=(
  external-spec/
  branding/branding-metadata.json
  json-body-assertions/responses.json
  src/gen/
  src/facade/operations.gen.ts
)

if [ "${1:-}" = "--list" ]; then
  out=()
  for d in "${DERIVED[@]}"; do out+=("${d%/}"); done
  echo "${out[*]}"
  exit 0
fi
if [ $# -ne 0 ]; then
  echo "usage: $0 [--list] < NUL-separated paths" >&2
  exit 2
fi

is_derived() {
  local p=$1 d
  case "$p" in
    "" | /* | ..* | */../* | */.. | ./* | */./* ) return 1 ;;
  esac
  for d in "${DERIVED[@]}"; do
    if [[ "$d" == */ ]]; then
      [[ "$p" == "$d"?* ]] && return 0
    else
      [[ "$p" == "$d" ]] && return 0
    fi
  done
  return 1
}

bad=0
while IFS= read -r -d '' p; do
  if ! is_derived "$p"; then
    echo "::error::Refusing patch: '$p' is not a derived (generated) path." >&2
    bad=1
  fi
done
exit $bad

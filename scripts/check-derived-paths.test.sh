#!/usr/bin/env bash
# Self-test for scripts/check-derived-paths.sh (run in CI).
set -uo pipefail
here=$(cd "$(dirname "$0")" && pwd)
check="$here/check-derived-paths.sh"
fails=0

expect() { # expect <0|1> <paths...>
  local want=$1; shift
  local got=0
  printf '%s\0' "$@" | "$check" 2>/dev/null || got=$?
  if [ "$got" -ne "$want" ]; then
    echo "FAIL: want exit $want, got $got for: $*"
    fails=1
  fi
}

# Accepted: only generated paths.
expect 0 src/gen/sdk.gen.ts
expect 0 src/gen/types.gen.ts src/facade/operations.gen.ts
expect 0 external-spec/bundled/rest-api.bundle.json external-spec/rest-api.upstream.yaml
expect 0 branding/branding-metadata.json json-body-assertions/responses.json
# Rejected: hand-written and generator code, the workflow itself.
expect 1 scripts/run-pipeline.ts
expect 1 .github/workflows/backport.yml
expect 1 package.json
expect 1 package-lock.json
expect 1 src/index.ts
expect 1 src/facade/other.ts
expect 1 branding/other.json
# Rejected: one bad path poisons an otherwise valid patch.
expect 1 src/gen/sdk.gen.ts scripts/run-pipeline.ts
# Rejected: prefix look-alikes, bare dirs, traversal, odd forms.
expect 1 src/gen
expect 1 src/genx/evil.ts
expect 1 src/gen.ts
expect 1 external-spec
expect 1 external-specx/a
expect 1 src/facade/operations.gen.ts.bak
expect 1 x/src/gen/a.ts
expect 1 src/gen/../../scripts/run-pipeline.ts
expect 1 ../src/gen/a.ts
expect 1 /src/gen/a.ts
expect 1 ./src/gen/a.ts
expect 1 src/gen/./a.ts
expect 1 ""
# Empty input is a no-op patch: accepted.
if ! printf '' | "$check"; then echo "FAIL: empty input rejected"; fails=1; fi
# --list is the restore list used by the regeneration job.
want="external-spec branding/branding-metadata.json json-body-assertions/responses.json src/gen src/facade/operations.gen.ts"
got=$("$check" --list)
[ "$got" = "$want" ] || { echo "FAIL: --list = '$got'"; fails=1; }

[ $fails -eq 0 ] && echo "check-derived-paths: all tests passed"
exit $fails

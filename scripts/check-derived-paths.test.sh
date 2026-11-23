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

# The scaffold hook's outputs. The manifest is a plain path; new scaffolds are
# checked against the index, so these run in a scratch repo where the real
# hook (not a copy of its template) writes the files.
expect 0 tests-integration/methods/manifest.json
expect 1 tests-integration/methods/manifest.json.bak tests-integration/manifest.json

repo=$(cd "$here/.." && pwd)
tsx="$repo/node_modules/.bin/tsx"
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
if [ ! -x "$tsx" ]; then
  echo "FAIL: $tsx not found; run npm ci first"
  fails=1
else
  cd "$scratch" || exit 1
  git init -q
  git config user.email t@example.invalid
  git config user.name test
  mkdir -p src/gen tests-integration/methods
  printf 'export const handWritten = () => {};\n' > src/gen/sdk.gen.ts
  printf "it('real test', () => {});\n" > tests-integration/methods/handWritten.test.ts
  git add -A
  git commit -qm base
  # A stable spec with new operations: the hook adds scaffolds and rewrites the manifest.
  printf 'export const handWritten = () => {};\nexport const newOp = () => {};\nexport const otherOp = () => {};\n' > src/gen/sdk.gen.ts
  if ! "$tsx" "$repo/hooks/post/800-generate-test-scaffolds.ts" > /dev/null ||
    [ ! -f tests-integration/methods/newOp.test.ts ]; then
    echo "FAIL: the scaffold hook did not run"
    exit 1
  fi
  git add -A

  expect 0 tests-integration/methods/newOp.test.ts tests-integration/methods/manifest.json src/gen/sdk.gen.ts
  # Rejected: an existing (hand-written) test, even when replaced by a scaffold.
  git show :tests-integration/methods/newOp.test.ts > tests-integration/methods/handWritten.test.ts
  git add tests-integration/methods/handWritten.test.ts
  expect 1 tests-integration/methods/handWritten.test.ts
  git reset -q HEAD -- tests-integration/methods/handWritten.test.ts
  git checkout -q -- tests-integration/methods/handWritten.test.ts
  # Rejected: a new file whose content differs from the template.
  printf '\n// extra\n' >> tests-integration/methods/otherOp.test.ts
  git add tests-integration/methods/otherOp.test.ts
  expect 1 tests-integration/methods/otherOp.test.ts
  # Rejected: a scaffold renamed to another operation's file.
  git show :tests-integration/methods/newOp.test.ts > tests-integration/methods/thirdOp.test.ts
  git add tests-integration/methods/thirdOp.test.ts
  expect 1 tests-integration/methods/thirdOp.test.ts
  # Rejected: a correct scaffold staged as executable.
  git update-index --chmod=+x tests-integration/methods/newOp.test.ts
  expect 1 tests-integration/methods/newOp.test.ts
  git update-index --chmod=-x tests-integration/methods/newOp.test.ts
  # Rejected: deleting an existing test.
  git rm -q --cached tests-integration/methods/handWritten.test.ts
  expect 1 tests-integration/methods/handWritten.test.ts
  # Rejected: scaffold look-alikes outside the hook's single directory level.
  expect 1 tests-integration/methods/sub/newOp.test.ts tests-integration/newOp.test.ts tests-integration/methods/newOp.test.tsx
  cd "$here" || exit 1
fi

[ $fails -eq 0 ] && echo "check-derived-paths: all tests passed"
exit $fails

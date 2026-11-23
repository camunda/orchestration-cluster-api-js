#!/usr/bin/env bash
# Allowlist for the backport workflow's regeneration patch.
#
#   check-derived-paths.sh --list        print the restore list, space-separated
#   check-derived-paths.sh < paths       read NUL-separated repo paths on stdin;
#                                        exit 1 if any is not a derived path
#
# The backport workflow regenerates stable-branch backports in a job with no
# credentials, then a trusted job applies the resulting patch and pushes it
# with the automation App's token. This check runs in the trusted job, from the
# workflow's own commit (never from the backport branch), and fails closed:
# an empty, absolute, `..`-containing or unlisted path rejects the whole patch.
#
# Run it from the root of the worktree the patch was applied to (with
# `git apply --index`): new integration test scaffolds are accepted only after
# comparing their staged content with the generator's template, read with git.
#
# Keep DERIVED in sync with the restore list in AGENTS.md
# "Backporting to stable branches".
set -euo pipefail

# Restored from the target branch, then regenerated. Directories end in '/',
# files are exact.
DERIVED=(
  external-spec/
  branding/branding-metadata.json
  json-body-assertions/responses.json
  src/gen/
  src/facade/operations.gen.ts
)

# Regenerated but not restored: hooks/post/800-generate-test-scaffolds.ts
# rewrites the manifest on every run (including --no-test) from the
# operations in src/gen/sdk.gen.ts.
GENERATED=(
  tests-integration/methods/manifest.json
)

# The same hook creates tests-integration/methods/<op>.test.ts for operations
# without one. The rest of that directory is hand-written tests, so only a
# file that is new and byte-identical to the template is accepted.
SCAFFOLD_RE='^tests-integration/methods/([A-Za-z0-9_]+)\.test\.ts$'

# Must match the template in hooks/post/800-generate-test-scaffolds.ts
# (scripts/check-derived-paths.test.sh runs the hook to keep them in sync).
scaffold() {
  local op=$1
  printf '%s\n' \
    "// AUTO-GENERATED SCAFFOLD. You can flesh out the test body; file will not be overwritten once it exists." \
    "import { describe, it } from 'vitest';" \
    "import { createCamundaClient } from '../../dist';" \
    "" \
    "describe('$op', () => {" \
    "  it.skip('scaffold', () => {" \
    "    const _camunda = createCamundaClient();" \
    "    void _camunda;" \
    "    // TODO: implement $op test logic" \
    "  });" \
    "});"
}

is_new_scaffold() {
  local p=$1 op mode
  [[ "$p" =~ $SCAFFOLD_RE ]] || return 1
  op=${BASH_REMATCH[1]}
  # New files only: an existing test (scaffold or hand-written) never changes.
  if git cat-file -e "HEAD:$p" 2>/dev/null; then return 1; fi
  # A regular, non-executable file (not a symlink); absent if staged as deleted.
  mode=$(git ls-files --stage -- "$p" | cut -d' ' -f1)
  [ "$mode" = 100644 ] || return 1
  cmp -s <(git cat-file blob ":$p") <(scaffold "$op")
}

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
  for d in "${GENERATED[@]}"; do
    [[ "$p" == "$d" ]] && return 0
  done
  is_new_scaffold "$p"
}

bad=0
while IFS= read -r -d '' p; do
  if ! is_derived "$p"; then
    echo "::error::Refusing patch: '$p' is not a derived (generated) path." >&2
    bad=1
  fi
done
exit $bad

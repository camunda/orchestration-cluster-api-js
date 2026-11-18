#!/usr/bin/env bash
# Usage: api-compat-release-gate.sh <baseline-version>
#
# Release gate for the stable/<N> branch in GITHUB_REF_NAME: compares the build about to be
# published (run `npm run build` first) with <baseline-version> and passes if it is
# compatible or every break is approved. Exit 0 pass, 1 blocked, 2 setup error.
#
# An api-break-approved label approves the API as of that PR's merge. Breaks added after the
# newest approved merge (a later direct push, say) need their own approval.
set -uo pipefail

here=$(dirname "$0")
baseline="$1"
tag="v${baseline}"

if ! git rev-parse -q --verify "refs/tags/${tag}" >/dev/null; then
  echo "::error::Baseline ${baseline} has no ${tag} tag to list the PRs merged since."
  exit 2
fi

rc=0
npm run -s api-compat -- --baseline-version "$baseline" || rc=$?
[ "$rc" -eq 1 ] || exit "$rc"

if [ "${DISPATCH_APPROVED:-false}" = "true" ]; then
  echo "::warning::Breaking API changes approved by the api_break_approved input of this run."
  exit 0
fi

approved=$(bash "$here/api-break-approvals.sh" "$tag" "$GITHUB_REF_NAME") || exit 2
if [ -z "$approved" ]; then
  echo "::error::Release blocked: the public API breaks compatibility with ${tag}. If intended, label the PR that made the change api-break-approved (or re-run this workflow manually with api_break_approved), then re-run."
  exit 1
fi

prs=$(cut -d' ' -f1 <<<"$approved" | xargs)
read -r latest_pr latest <<<"$approved"
if [ "$latest" != "$(git rev-parse HEAD)" ]; then
  dir=$(mktemp -d)
  trap 'rm -rf "$dir"' EXIT
  git archive "$latest" | tar -x -C "$dir" || exit 2
  # The release job holds publishing credentials; the approved revision is built without them.
  (
    cd "$dir" &&
      env -i PATH="$PATH" HOME="$HOME" npm ci --ignore-scripts --no-audit --no-fund &&
      env -i PATH="$PATH" HOME="$HOME" npm run -s build:types
  ) >&2 || exit 2
  rc=0
  npm run -s api-compat -- --baseline "$dir" || rc=$?
  if [ "$rc" -eq 1 ]; then
    echo "::error::Release blocked: breaking API changes were added after ${latest_pr} (${latest}), the newest approved PR. Label the PR that made them api-break-approved (or re-run this workflow manually with api_break_approved), then re-run."
    exit 1
  fi
  [ "$rc" -eq 0 ] || exit "$rc"
fi
echo "::warning::Breaking API changes approved with the api-break-approved label on: ${prs}"

#!/usr/bin/env bash
# Usage: api-compat-release-gate.sh [--prepare] <baseline-version>
#
# Release gate for the stable/<N> branch in GITHUB_REF_NAME. Exit 0 pass, 1 blocked, 2 setup error.
#
# An api-break-approved label approves the API as of that PR's merge, so a labelled break also
# needs the release to match the newest approved merge's API: changes since then, including
# code the release job regenerates from upstream, need their own approval.
#
# --prepare (a job without publishing credentials): build the newest approved merge's type
# declarations into API_COMPAT_BASELINES/<merge sha>. Without it (the publish job, after
# `npm run build`): compare the build with <baseline-version> and, for an approved break, with
# that staged build. The publish job never builds historical code.
set -uo pipefail

here=$(dirname "$0")
prepare=false
if [ "${1:-}" = --prepare ]; then
  prepare=true
  shift
fi
baseline="$1"
tag="v${baseline}"
[ -n "${API_COMPAT_BASELINES:-}" ] || { echo "::error::API_COMPAT_BASELINES is not set."; exit 2; }

if ! git rev-parse -q --verify "refs/tags/${tag}" >/dev/null; then
  echo "::error::Baseline ${baseline} has no ${tag} tag to list the PRs merged since."
  exit 2
fi

if [ "$prepare" = false ]; then
  rc=0
  npm run -s api-compat -- --baseline-version "$baseline" || rc=$?
  [ "$rc" -eq 1 ] || exit "$rc"
  if [ "${DISPATCH_APPROVED:-false}" = "true" ]; then
    echo "::warning::Breaking API changes approved by the api_break_approved input of this run."
    exit 0
  fi
fi

approved=$(bash "$here/api-break-approvals.sh" "$tag" "$GITHUB_REF_NAME") || exit 2
if [ -z "$approved" ]; then
  [ "$prepare" = true ] && exit 0
  echo "::error::Release blocked: the public API breaks compatibility with ${tag}. If intended, label the PR that made the change api-break-approved (or re-run this workflow manually with api_break_approved), then re-run."
  exit 1
fi
prs=$(cut -d' ' -f1 <<<"$approved" | xargs)
read -r latest_pr latest <<<"$approved"
staged="${API_COMPAT_BASELINES}/${latest}"

if [ "$prepare" = true ]; then
  dir=$(mktemp -d)
  trap 'rm -rf "$dir"' EXIT
  git archive "$latest" | tar -x -C "$dir" || exit 2
  (
    cd "$dir" &&
      env -i PATH="$PATH" HOME="$HOME" npm ci --ignore-scripts --no-audit --no-fund &&
      env -i PATH="$PATH" HOME="$HOME" npm run -s build:types
  ) >&2 || exit 2
  mkdir -p "$staged" && cp "$dir/package.json" "$staged/" && cp -R "$dir/dist" "$staged/" || exit 2
  echo "Staged the API of ${latest_pr} (${latest})."
  exit 0
fi

if [ ! -f "${staged}/package.json" ]; then
  echo "::error::No staged build of ${latest_pr} (${latest}), the newest approved PR."
  exit 2
fi
rc=0
npm run -s api-compat -- --baseline "$staged" || rc=$?
if [ "$rc" -eq 1 ]; then
  echo "::error::Release blocked: breaking API changes were added after ${latest_pr} (${latest}), the newest approved PR. Label the PR that made them api-break-approved (or re-run this workflow manually with api_break_approved), then re-run."
  exit 1
fi
[ "$rc" -eq 0 ] || exit "$rc"
echo "::warning::Breaking API changes approved with the api-break-approved label on: ${prs}"

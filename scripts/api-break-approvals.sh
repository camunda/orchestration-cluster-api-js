#!/usr/bin/env bash
# Usage: api-break-approvals.sh <baseline-tag> <release-branch>
#
# Prints `#N <merge-sha>` for each PR labelled api-break-approved that was merged into
# <release-branch> after <baseline-tag>, newest merge first. A label on a PR merged elsewhere
# (say `main`, whose commits a backport shares), before the baseline, or on a history that
# diverged before it (a reset release branch) approves nothing here.
# Exits non-zero if a lookup fails, so the caller can tell "none" from "unknown".
set -euo pipefail

tag="$1"
branch="$2"
shas=$(git log --ancestry-path --format=%H "${tag}..HEAD")

# A file, not `$(...)`: command substitution does not inherit `set -e`, so a failed lookup
# on any but the last commit would be swallowed.
approved=$(mktemp)
trap 'rm -f "$approved"' EXIT
for sha in $shas; do
  gh api "repos/${GITHUB_REPOSITORY}/commits/${sha}/pulls" \
    --jq '.[] | select(.merged_at != null) | select(any(.labels[]; .name == "api-break-approved")) | "\(.number) \(.base.ref) \(.merge_commit_sha)"' \
    | while read -r number base merge_sha; do
        if [ "$base" = "$branch" ] && grep -qx "$merge_sha" <<<"$shas"; then
          echo "#${number} ${merge_sha}"
        fi
      done
done > "$approved"

for sha in $shas; do
  grep " ${sha}$" "$approved" || true
done | awk '!seen[$0]++'

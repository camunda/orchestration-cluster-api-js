#!/usr/bin/env bash
# Usage: api-break-approvals.sh <baseline-tag> <release-branch>
#
# Prints `#N <merge-sha>` for each PR labelled api-break-approved that was merged into
# <release-branch> after <baseline-tag>, newest merge first. A label on a PR merged elsewhere
# (say `main`, whose commits a backport shares) or before the baseline approves nothing here,
# and nothing does unless the tag is on HEAD's first-parent line (a reset or merged-back
# release branch); the manual override still covers that.
# Exits non-zero if a lookup fails, so the caller can tell "none" from "unknown".
set -euo pipefail

tag="$1"
branch="$2"
tag_sha=$(git rev-parse --verify "${tag}^{commit}")
line=$(git rev-list --first-parent HEAD)
if ! grep -qx "$tag_sha" <<<"$line"; then
  echo "::notice::${tag} is not on the first-parent history of HEAD; no label can approve this release." >&2
  exit 0
fi
shas=$(git log --first-parent --format=%H "${tag}..HEAD")

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

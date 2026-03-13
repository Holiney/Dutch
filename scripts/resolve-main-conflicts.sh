#!/usr/bin/env bash
set -euo pipefail

# Resolves the known recurring conflicts for this project after syncing with origin/main.
# Keeps the feature-branch versions of App/Menu where new practice modes are wired.

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Run this script inside a git repository." >&2
  exit 1
fi

current_branch="$(git branch --show-current)"
if [[ -z "$current_branch" ]]; then
  echo "Could not detect current branch." >&2
  exit 1
fi

echo "[1/5] Fetching origin/main..."
git fetch origin main

echo "[2/5] Merging origin/main into $current_branch..."
set +e
git merge origin/main
merge_exit=$?
set -e

if [[ $merge_exit -eq 0 ]]; then
  echo "Merge completed without conflicts."
  exit 0
fi

echo "[3/5] Merge produced conflicts. Applying project conflict strategy..."

# Keep branch versions for known conflict hotspots.
git checkout --ours src/App.tsx src/components/Menu.tsx

# Stage conflict resolutions.
git add src/App.tsx src/components/Menu.tsx

# Check for any unresolved conflicts left.
if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Still unresolved conflicts remain in:"
  git diff --name-only --diff-filter=U
  echo "Please resolve remaining files manually, then commit."
  exit 2
fi

echo "[4/5] Creating merge commit..."
git commit -m "Resolve merge conflicts with origin/main (App/Menu strategy)"

echo "[5/5] Done. Push your branch: git push"

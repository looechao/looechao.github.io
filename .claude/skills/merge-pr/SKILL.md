---
name: merge-pr
description: Merge the current branch's PR into main and delete the branch.
---

# Merge PR

## Workflow

1. Detect open PR for current branch: `gh pr list --head <branch> --json number --jq '.[0].number'`; exit with error if none found
2. Merge with `gh pr merge <number> --squash --delete-branch`
3. Pull latest main: `git checkout main && git pull`
4. Display confirmation

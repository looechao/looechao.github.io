---
name: push-pr
description: Push current branch and create a PR to main.
---

# Push and Create PR

## Workflow

1. Verify not on `main`; exit with error if so
2. Push branch: `git push -u origin <branch>` (or `git push` if upstream exists)
3. Generate PR title (`<type>: <description>`) and a short body (bullet summary of commits) from `git log origin/main..HEAD --oneline`
4. Create PR with `gh pr create` targeting `main`
5. Display PR URL and suggest `/merge-pr` when ready

---
name: commit-locally
description: Commit local changes following Conventional Commits spec.
---

# Commit Locally

## Rules

- No Co-Authored-By
- Format: `<type>[(<scope>)]: <description>` (Conventional Commits)
- Stage specific files by name, never `git add -A` or `git add .`

## Workflow

1. Run `git status` and `git diff` to inspect changes
2. If changes span multiple unrelated concerns, propose a split plan to the user and wait for confirmation before committing
3. Commit each logical unit with the appropriate type and scope

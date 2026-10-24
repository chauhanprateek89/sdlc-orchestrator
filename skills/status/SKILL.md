---
name: status
description: "Show where the sdlc pipeline stands in this repository: track, stage, gate waiting, your actions, tasks and whether they pass. Read-only. Use when the user runs /sdlc:status or asks where the pipeline is."
allowed-tools:
  - Read
  - Bash(cat *)
  - Bash(git *)
---

# Pipeline status

- Status: !`cat .sdlc/STATUS.md 2>/dev/null || echo "NOT ONBOARDED"`
- Tasks: !`cat .sdlc/features.json 2>/dev/null || echo "{}"`
- Branch: !`git branch --show-current 2>/dev/null`

If the status says NOT ONBOARDED, reply with one line: this repo isn't in the pipeline yet; run `/sdlc:orchestrate onboard`.

Otherwise reply in at most 15 lines, and change nothing:

1. Track, stage and branch, on one line.
2. The gate waiting, if any, and what it needs from the user.
3. "Your actions", copied as they are.
4. A table of tasks: id, title, model, review, passes. Omit it if there are no tasks.
5. The next step.

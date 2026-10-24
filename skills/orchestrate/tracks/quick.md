# Quick track

For a bug fix, a small change, or finishing work that is already written (an open PR). There are no requirements, design or mockup stages, and only Gate 3.

## 1. Intake

- Restate the request in one line.
- For an existing PR: fetch and check out its branch. Rebase it onto main only if it is behind and the rebase is clean. Otherwise work on it as it is.
- Otherwise create `sdlc/quick-<slug>` from main.
- STATUS: Track Quick, Stage Plan.

## 2. Plan: `sdlc:architect`, mode plan

The architect reads the request (and the PR diff, if any), `docs/requirements.md`, `docs/HLD.md` and the constitution. Then it:

- adds or updates, in `docs/requirements.md`, the requirements this change implements: EARS criteria, new R-numbers, marked `track: quick`. QA tests against these.
- writes tasks to `.sdlc/features.json`, with a model for each per the routing rules. For work already written, there is one "verify and finish" task per requirement.
- flags anything that touches the UI or the architecture. You then move the work to the Full track and tell the user.
- flags any conflict with the constitution. You then stop and ask.

## 3. Build: workflow `sdlc:build`

Launch it with args `{repoRoot, branch, tasks}`, where `tasks` are the tasks in `.sdlc/features.json` that don't pass yet, in order. It runs in the background and you are notified when it finishes. Set each task's `review` field in `.sdlc/features.json` (`passed`, `failed` or `blocked`) from the results, and record them in STATUS.

A task that comes back `failed-review` or `blocked`: show the user the findings, then ask whether to retry with changes, drop the task, or stop.

## 4. QA: workflow `sdlc:qa`

Launch it with args `{repoRoot, baseUrl, startCommand, items}`:

- `baseUrl` is `urls.local` from `.sdlc/project.json`;
- `startCommand` is `commands.start`;
- `items` has one entry per requirement touched: `{requirement, criteria, taskIds, mockups}`.

QA flips `passes` in `.sdlc/features.json`. A failed criterion goes back to step 3 with the failing step attached. After one round of fixes, ask the user instead of looping.

## 5. Release: `sdlc:release`, mode pr

The release agent pushes the branch and opens or updates the PR. The PR lists the summary, the requirements covered, the review verdicts, the QA evidence paths and the CI status. It waits for CI.

## 6. Gate 3

Show the gate screen. On "Merge now", merge with `gh pr merge`, using the repo's usual merge style (check recent merges with `gh pr list --state merged`).

## 7. Live check: `sdlc:release`, mode live-check

The release agent waits for the release pipeline and the deploy, loads the live URL in a fresh browser profile, confirms the change is visible, and reports back. Update STATUS: done, plus a log line.

# Onboard track

Purpose: write down what an existing app is today, so every later stage starts from facts. This runs once per repository.

## 1. Preflight

- If the working tree has uncommitted changes, stop and ask. The user may have work in progress.
- If `.sdlc/` already exists, the repo was onboarded before. Ask whether to re-onboard or resume.
- Fetch main (use the HTTPS fallback in SKILL.md if SSH fails). Create `sdlc/onboard` from the up-to-date main, whatever branch is checked out. Tell the user which branch they were on; it is left untouched.

## 2. Bootstrap

Copy from `${CLAUDE_SKILL_DIR}/templates/`:

| Template | Goes to | Notes |
| --- | --- | --- |
| `STATUS.md` | `.sdlc/STATUS.md` | Track: Onboard, Stage: Map |
| `features.json` | `.sdlc/features.json` | |
| `project.json` | `.sdlc/project.json` | The architect fills it in |
| `decisions.md` | `docs/decisions.md` | Only if absent |
| `constitution.md` | `docs/constitution.md` | Only if absent. If one exists, keep it and list the differences at Gate 0 |

Find any old instruction files: `agent.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `docs/*instructions*`. Commit nothing yet.

## 3. Map: two agents in parallel, sent in one message

- **`sdlc:architect`, mode onboard.** Writes `docs/HLD.md` as built, fills in `.sdlc/project.json`, and writes `.sdlc/init.sh` (starts the app locally and waits until it is healthy). Writes `CLAUDE.md` from `${CLAUDE_SKILL_DIR}/templates/CLAUDE.md`. If an old `CLAUDE.md` exists, it merges in what is still true. Proposes app-specific rules under "App-specific rules" in the constitution, each marked "Proposed". Returns a 5-line summary plus any conflicts between old instruction files and the code.
- **`sdlc:product`, mode onboard.** Writes `docs/requirements.md` as built, from the code, tests, README, old instruction files and merged PR history. Each requirement is marked `as-built` (the code or tests show it) or `inferred` (only docs or PRs say it). Returns the number of requirements, the inferred list, and every place an old instruction file contradicts the app.

Give both agents the template paths in `${CLAUDE_SKILL_DIR}/templates/` and the list of old instruction files.

## 4. Check

Skim what they wrote; don't rewrite it. Check that every file exists, requirements are numbered, `CLAUDE.md` is under 40 lines and points to the docs, and `init.sh` is executable. Send each gap back once, to the agent that owns the file.

## 5. Gate 0

Show the gate screen (gates.md). Open points always include:

- The `inferred` requirements. List them in the message, then ask one question: "Confirm all inferred" or "I'll mark the wrong ones".
- Each contradiction between old instruction files and the app: which one is right?
- What to do with old instruction files: archive to `docs/archive/` (Recommended), delete, or keep.
- The proposed app-specific constitution rules.

## 6. After approval

- Apply the decisions: mark confirmed requirements `as-built`, remove struck ones, move old files, and drop the "Proposed" marks from accepted rules.
- Commit on `sdlc/onboard` with the message "docs: onboard to the sdlc pipeline".
- Push the branch and open a PR to main with the gate summary as its body. If merging to main triggers the release pipeline, say so in the PR: a docs-only merge still cuts a release.
- Ask: "Merge now", "I'll merge it myself" or "Leave it open". Merge only on "Merge now".
- Update STATUS: the Onboard track is done, and "Next step" is whatever the user names next.

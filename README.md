# sdlc-orchestrator

A Claude Code plugin (`sdlc`) that runs homelab apps through a software pipeline. Your main Opus session is the orchestrator: it plans, hands each stage to an Opus or Sonnet subagent, keeps state in files in the app's repo, and stops for your sign-off at four gates. Design: [SDLC Orchestrator design doc](https://claude.ai/artifact/Fd1koJakVA8fR4zP4imdbz).

## Use

```text
/sdlc:orchestrate onboard            # once per existing repo
/sdlc:orchestrate <what to build>    # picks the Full or Quick track
/sdlc:orchestrate resume             # continue from .sdlc/STATUS.md
/sdlc:status                         # where things stand
```

| Track | For | Gates |
| --- | --- | --- |
| Onboard | An existing repo, once | 0 |
| Full | A new app, or any change users can see or to the system's shape | 1, 2, 3 |
| Quick | A fix, a small change, or finishing an open PR | 3 |

## Install

```bash
claude plugin marketplace add ~/src/sdlc-orchestrator
claude plugin install sdlc@homelab
```

Restart Claude Code to load it. After changing the plugin, run `claude plugin marketplace update homelab && claude plugin update sdlc@homelab` and restart.

## Layout

| Path | What |
| --- | --- |
| `skills/orchestrate/` | The orchestrator: `SKILL.md`, the gate protocol, one recipe per track, and the templates copied into each app |
| `skills/status/` | A read-only status summary |
| `agents/` | product, architect (Opus) · uiux, builder, qa, release (Sonnet) · reviewer (the model of the task it reviews) |
| `workflows/` | `build.js` (build, then two-stage review per task, with escalation to Opus) and `qa.js` (each requirement against the running app) |

## Requires

Workflows switched on: `"env": {"CLAUDE_CODE_WORKFLOWS": "1"}` in `~/.claude/settings.json`. Without it there is no Workflow tool, and the orchestrator stops at Build and QA.

User-scope MCP servers `playwright` and `chrome-devtools` (QA, UI/UX, release), the `context7` plugin (architect, builder), the `frontend-design` plugin (UI/UX), and an authenticated `gh` CLI.

# Requirements

Each requirement has a number, a status, and EARS criteria that QA can test. Numbers are never reused or renumbered.

| Status | Meaning |
| --- | --- |
| `as-built` | Exists today; the code or tests show it |
| `inferred` | Believed to exist from docs or PRs only. Needs the user's confirmation |
| `planned` | Agreed, not built yet |
| `done` | Built and passed QA |
| `dropped` | Struck by the user; kept so the number is never reused |

EARS forms: `THE SYSTEM SHALL …` (always) · `WHEN <trigger>, THE SYSTEM SHALL …` (event) · `WHILE <state>, THE SYSTEM SHALL …` (state) · `IF <unwanted condition>, THEN THE SYSTEM SHALL …` (error) · `WHERE <feature is present>, THE SYSTEM SHALL …` (option).

## <Area>

### R-001 <Short name>

Status: as-built · Track: onboard · UI: no · Source: `<file, test or PR>`

- WHEN <trigger>, THE SYSTEM SHALL <observable behaviour, with concrete values>.

# Gate protocol

A gate is the only place the pipeline waits for the user. There are four.

| Gate | Comes after | The user decides |
| --- | --- | --- |
| 0 | Onboard | Is this what the app is? Which rules apply? What happens to old instruction files? |
| 1 | Requirements (Full) | Scope, track, anything that costs money |
| 2 | Design and mockups (Full) | The design, and every mockup screen |
| 3 | Release PR (every track) | The merge, which deploys |

## The gate screen

First set "Gate waiting" in `.sdlc/STATUS.md`. Then show one message with these parts, in this order:

1. **Decision needed:** one line.
2. **What was decided or built:** 3–6 bullets, with links (doc paths, PR URL, artifact URL).
3. **What it costs:** new services or paid anything (it should be "nothing"), plus the agents and models used since the last gate.
4. **Changed since the last gate:** bullets.
5. **Open points:** numbered items that need a yes or no.
6. **Your actions:** anything only the user can do (a tunnel hostname, a sudo command, making a package public), or "none".

Then call AskUserQuestion once, with the gate's question first and up to three open points as extra questions, each with concrete options. A typed answer comes back as "Other": treat it as a change request.

| Gate | Options |
| --- | --- |
| 0 | Approve (Recommended) · Approve with changes · Stop |
| 1 | Approve scope (Recommended) · Change scope · Switch to Quick track · Stop |
| 2 | Approve design (Recommended) · Change the mockups · Change the design · Stop |
| 3 | Merge now, which deploys · I'll merge it myself · Changes needed · Stop |

Gate 3 has no recommended option: deploying is the user's call.

## After the answer

- Record it in `docs/decisions.md`: date, gate, decision, and the user's own words if they typed any.
- **Approve:** update STATUS (the stage, "Next step" and a log line), then end the session. Say that the decision is saved and that the user should run `/clear`, then `/sdlc:orchestrate resume`, to start the next stage in a fresh session. Don't start the next stage here. A fresh session starts from STATUS alone, while this one re-reads everything said so far on every turn, and has to rebuild its whole cache whenever the user has been away for a while.
- **Merge now (Gate 3):** merge, run the live check and finish the track in this session; the remaining steps are short.
- **Changes:** send the change to the stage that owns it (product, architect or uiux), then come back to the same gate.
- **Stop:** set STATUS to "Stopped at Gate N" and end.
- Silence or a vague reply is never approval.

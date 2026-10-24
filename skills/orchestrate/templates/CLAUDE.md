# <App name>

<One sentence: what the app does and for whom.>

Read before changing anything:

- `docs/constitution.md`: rules no change may break
- `docs/requirements.md`: what the app must do, by R-number
- `docs/HLD.md`: how it is built
- `.sdlc/STATUS.md`: where current work stands

Changes go through the sdlc pipeline (`/sdlc:orchestrate`): features on the Full track, fixes on the Quick track. `/sdlc:status` shows where things stand.

## Commands

| Task | Command |
| --- | --- |
| Run locally | `.sdlc/init.sh` |
| Test | `<command>` |
| Lint | `<command>` |
| Format | `<command>` |

## Conventions

- <Language and framework version, and the key libraries>
- <Where tests live and how they are named>
- <Anything a newcomer would get wrong>

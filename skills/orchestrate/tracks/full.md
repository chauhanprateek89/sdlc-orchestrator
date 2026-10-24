# Full track

For a new app, a change users can see, or a change to the system's shape.

1. **Branch.** Create `sdlc/full-<slug>` from main. STATUS: Track Full, Stage Requirements.
2. **Requirements: `sdlc:product`, mode requirements.** Quote the user's own words in the prompt; they are the source. The agent writes new or changed R-numbers in EARS form, marked `track: full`, and marks each `UI: yes` or `UI: no`. It returns a scope summary and open questions. Put those questions to the user at Gate 1 rather than guessing.
3. **Gate 1.**
4. **Design: `sdlc:architect`, mode design.** Updates `docs/HLD.md` and writes one ADR per significant decision in `docs/adr/`.
5. **Mockups: `sdlc:uiux`.** Only when a requirement is `UI: yes`. Run it in parallel with Design when the UI doesn't depend on design decisions, otherwise after Design. The agent writes `docs/design/mockups/*.html` and renders each one to PNG in `docs/design/`. It publishes one Artifact page with the screens for the user, and records the links in `docs/design/README.md`. Mockups cover every screen and state the change touches (default, empty, error, loading, 390 px wide), not a single component. If the agent couldn't publish the page, publish `docs/design/gallery.html` yourself with the Artifact tool.
6. **Gate 2.** Show the HLD summary, the ADR titles, the mockup page link and the PNG paths.
7. **Plan: `sdlc:architect`, mode plan.** Tasks go into `.sdlc/features.json` with a model for each. Tasks that touch the UI name their mockup file.
8. **Build, QA, Release, Gate 3, Live check:** exactly as Quick track steps 3–7. For UI requirements, QA compares its screenshots with the approved mockups.

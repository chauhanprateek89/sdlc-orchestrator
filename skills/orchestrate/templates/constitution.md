# Constitution

Rules no plan, change or release may break. The architect checks each plan against them, the reviewer checks each diff, and release checks each PR. If a change needs to break a rule, the pipeline stops at a gate and names the rule's number. Only the user changes this file.

## Homelab rules

1. Deploy only to homelab-server, behind the existing cloudflared systemd tunnel. Never a second tunnel, a cloudflared sidecar, or a cloud host.
2. Free only. Any paid service, plan or usage-billed resource stops at a gate.
3. App ports bind to `127.0.0.1`. Databases are never published.
4. Delivery is pull-based: merge to main, CI, image to GHCR, smoke test, release; watchtower on the server pulls `:latest`. No inbound path to the server, no deploy keys, no self-hosted runners. The repos are public.
5. Only the app container auto-updates (watchtower label). Databases never do. Infrastructure images are pinned to a version.
6. Merging to main needs the user's sign-off, because merging deploys.
7. Secrets live in a `chmod 600` `.env` on the server, never in git.
8. In production, unknown `Host` headers are rejected, and the app honours `X-Forwarded-Proto` behind the tunnel.
9. HTML responses send a `Cache-Control` header, so a deploy shows on the next page load.
10. A UI change isn't done until QA has seen it in a real browser and compared it with the approved mockup.

## App-specific rules

<!-- Added at onboarding (marked "Proposed" until the user confirms them at Gate 0) and when the user decides one at a later gate. -->

# Klyvo POD

Klyvo is an existing Next.js streetwear/POD storefront. The public design, branding, routes, responsive behavior and Clerk user flows are preserved while the deployment architecture is adapted for a lightweight Debian VPS.

## Stack and runtime decision

- Next.js 16 App Router + React 19 + TypeScript
- Bun for development/build tooling
- Tailwind CSS
- Clerk authentication
- local product catalog
- optional CJ supplier integration
- Next.js `standalone` production output

The previously declared libSQL/Turso dependency was not referenced by the application and has been removed. Klyvo does **not** receive a PostgreSQL database merely for architectural consistency; add one only when a real persistent feature requires it.

## Local development

```bash
bun install
bun run dev
```

Copy `.env.example` to `.env.local`. Never commit Clerk secrets, CJ credentials or admin configuration.

## Production architecture

```text
Internet -> Caddy -> 127.0.0.1:3010 -> klyvo.service -> Next.js standalone
```

Recommended filesystem layout:

```text
/srv/apps/klyvo-pod/
  current -> releases/<release-id>
  releases/
/etc/klyvo/env
```

Run the service as the dedicated Linux user/group `klyvo`; do not run it as root and do not expose port 3010 publicly. A hardened service example is in `deploy/klyvo.service.example` and a Caddy example is in `deploy/Caddyfile.example`.

## CI/CD

`.github/workflows/build-production.yml` performs install, lint, typecheck and production build in GitHub Actions, then packages the Next.js standalone artifact. Routine production builds must not run on the VPS.

After downloading an artifact to the host, `scripts/install-standalone-release.sh` installs it into a versioned release directory, atomically switches `current`, restarts systemd, checks `/api/health`, rolls back on failure and retains only five releases.

The GitHub repository variable `PRODUCTION_SITE_URL` should contain Klyvo's own canonical origin. It is mapped to `NEXT_PUBLIC_SITE_URL` during production builds.

## Security and persistence

Klyvo currently needs no database credential or persistent writable app directory. Clerk/CJ/admin secrets belong in `/etc/klyvo/env` with restrictive ownership and permissions. Caddy is the only public entry point. Falco, firewalling, Fail2ban/CrowdSec policy and encrypted host backups are infrastructure responsibilities, not packages embedded in this app.

## Frontend preservation

No existing component markup, CSS, imagery, navigation, typography or interaction has been replaced during this infrastructure pass.

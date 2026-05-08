# Local Development Setup

A walkthrough for getting Linkhub running on a fresh checkout. Assumes Node 22+, Docker, and a
Unix-like shell.

## 1. Install Node dependencies

```bash
npm install
```

`postinstall` runs `nuxt prepare`, which generates `.nuxt/` types. You'll see a couple of
deprecation warnings from transitive dependencies — they're cosmetic.

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | Postgres connection string consumed by Drizzle and the runtime pool. | `postgresql://linkhub:linkhub@localhost:5432/linkhub` (matches `docker-compose.yml`) |
| `BETTER_AUTH_SECRET` | Signing secret for session cookies. Replace the placeholder. | — |
| `BETTER_AUTH_URL` | Base URL the auth handler trusts. | `http://localhost:3000` |

Generate a real secret:

```bash
openssl rand -base64 32
```

Paste it into `BETTER_AUTH_SECRET`.

## 3. Bring up Postgres

```bash
docker compose up -d
```

Wait for `linkhub-postgres` to report `(healthy)`:

```bash
docker ps --filter name=linkhub-postgres
```

The container exposes Postgres on `localhost:5432` (creds `linkhub` / `linkhub` / `linkhub`) and
persists data to a named Docker volume `linkhub-postgres-data`. Stop with `docker compose down`;
keep data with `down`, wipe data with `down -v`.

## 4. Apply migrations

```bash
npm run db:migrate
```

This applies every SQL file in `server/db/migrations/` in order. After the first run you'll have
five tables: `user`, `session`, `account`, `verification`, `link`.

## 5. Run the dev server

```bash
npm run dev
```

Hot-reload at <http://localhost:3000>. Sign-up at `/register`, then your public profile lives at
`/<username>`.

## Common workflows

### Editing the schema

1. Edit `server/db/schema.ts`.
2. `npm run db:generate` — drizzle-kit emits a new SQL migration into `server/db/migrations/`.
3. Review the generated SQL.
4. `npm run db:migrate`.

Commit the generated SQL files. They are the source of truth for schema state across machines.

### Inspecting data

```bash
npm run db:studio          # Drizzle Studio at localhost:4983
docker exec -it linkhub-postgres psql -U linkhub -d linkhub
```

### Resetting the database

```bash
docker compose down -v && docker compose up -d
npm run db:migrate
```

### Tests / lint / typecheck

```bash
npm test
npm run lint
npm run typecheck
```

The Vitest suite is unit-only (no DB required). The lint config is the Nuxt flat preset with a
few overrides — see `eslint.config.mjs`.

## Production deployment — TODO

Local file uploads under `public/uploads/` work great in dev but **don't persist in serverless
environments** (the FS resets on each boot). Before deploying:

1. Swap the upload handler in `server/api/uploads.post.ts` for an object-store backend (S3,
   R2, Tigris, GCS, etc.) and serve URLs that go through the CDN rather than `/uploads/...`.
2. Switch `DATABASE_URL` to a managed Postgres (Neon, Supabase Postgres, RDS) and update
   `BETTER_AUTH_URL` to the production origin.
3. Generate a fresh `BETTER_AUTH_SECRET` (at least 32 bytes of entropy) and store it as a
   secret, not in `.env`.

This is intentionally out of scope for the rewrite.

## Troubleshooting

- **`Vite Node IPC socket path not configured` on dev boot**: known to happen with `ssr: false`
  on Nuxt 3.21.4. The repo ships with `ssr: true`, which avoids the issue. If you ever flip to
  `ssr: false`, expect this error.
- **`401 Unauthorized` on dashboard during SSR**: the dashboard fetches link/profile data via
  `$fetch` from a Pinia action, and `$fetch` doesn't forward cookies during SSR. We work around
  this by running the initial fetch in `onMounted`. If you add new authenticated `$fetch` calls
  to a page's setup, either move them into `onMounted` or use `useFetch` (which forwards cookies).
- **Username unique-violation**: the API maps Postgres error code `23505` to a friendly 409. If
  you ever see a raw stack trace, check that `server/api/profile.patch.ts` still has the
  try/catch.

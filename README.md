# ატეხილი (Atexili) — "Tinder for animals" 🐾

Georgian-language, mobile-first pet-matchmaking web app. Owners create profiles
for their **animals**, swipe on other animals on their pet's behalf, and a
mutual right-swipe opens a chat between the two owners.

**Status:** full-stack — Next.js frontend + API routes backed by Prisma on
**PostgreSQL** (dev/prod parity), containerized with Docker. The full hifi
design handoff lives in [`design/`](design/README.md) and is the source of
truth for all screens and tokens.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — UI and the REST API (route
  handlers under `src/app/api/`)
- **Prisma 7** + **PostgreSQL** via `@prisma/adapter-pg`, with real migrations
  (`prisma/migrations/`)
- **Auth:** email/password (bcrypt) + JWT session in an httpOnly cookie (jose)
- **Photo storage:** S3 (AWS SDK) via presigned direct-to-bucket uploads —
  works with any S3-compatible service; falls back to placeholders when unset
- **Docker:** multi-stage build (standalone output); `docker compose up`
  brings up Postgres + the app, migrates on boot
- **Tailwind CSS v4** — design tokens mapped 1:1 from the handoff
  (`src/app/globals.css` `@theme` block)
- **Framer Motion** — swipe deck physics, match spring-pop, bottom sheets
- **Zustand** — client cache over the API (only launch flags persist locally)
- **Lucide** icons, **Noto Sans/Serif Georgian** via `next/font`

## Run

### Docker (everything, one command)

```bash
docker compose up --build      # Postgres + app on http://localhost:3000
```

The app waits for Postgres to be healthy, applies migrations, and seeds the
demo account on first run (`SEED_ON_START=true` in `docker-compose.yml`).

### Local dev

Needs a Postgres. The quickest is the compose DB:

```bash
docker compose up -d db        # Postgres on localhost:5432 (matches .env)
npm install                    # also runs prisma generate
npm run setup                  # migrate deploy + seed
npm run dev                    # http://localhost:3000
```

`npm run db:migrate` to create a new migration; `npm run db:seed` to reload the
demo data; `npm run build` for a production build.

## Demo accounts

- **შესვლა (login)** → `nika@example.ge` / `123456789` — seeded showcase
  account: owner ნიკა with ლუნა (cat) and ბობი (dog), 4 matches, a live chat
  thread with თომა, real per-pet counters.
- **რეგისტრაცია (register)** → creates a real account and walks the full
  onboarding: age gate → intro → register → phone → OTP → owner profile →
  add-pet wizard → notification priming.

Liking **თომა** in the deck triggers the scripted mutual match (his profile is
flagged `mutualLike` in the seed) → match overlay → chat. Everything you do —
swipes, matches, messages, new pets, blocks, reports — persists in the DB.

## Where things live

```
design/                  — hifi handoff (README + per-screen .dc.html mocks)
Dockerfile, docker-compose.yml, docker-entrypoint.sh — containerized deploy
prisma/
  schema.prisma          — data model (PostgreSQL)
  migrations/            — SQL migration history
  seed.mjs               — demo dataset (ნიკა, ლუნა, candidates, chats)
prisma.config.ts         — Prisma 7 config (connection URL, seed command)
src/server/
  db.ts                  — PrismaClient singleton (@prisma/adapter-pg)
  auth.ts                — bcrypt password hashing + JWT cookie sessions
  serialize.ts           — DB rows → client shapes (ages, ka relative times)
  http.ts                — route-handler helpers (auth guard, JSON errors)
src/app/api/
  auth/{register,login,logout}
  bootstrap              — owner + pets(+stats) + matches + settings
  deck                   — filtered candidate queue for the active pet
  swipes(+rewind)        — like/nope; creates matches on mutual like
  matches/[id]/{messages,read}
  pets, pets/[id]        — CRUD
  me(+verification)      — profile, settings, account deletion
  blocks, reports        — safety
src/lib/
  types.ts               — shared domain types
  api.ts                 — fetch wrapper
  store.ts               — zustand client cache over the API
src/components/          — HeartCat (SVG logo), ui primitives, Sheet,
                           BottomNav, swipe/ (drag physics + MatchOverlay)
src/app/                 — all screens (age gate → auth → tabs → …)
```

Pet "photos" fall back to mock placeholders (emoji on warm gradients) until S3
is configured — see below.

## Deployment (Docker)

`Dockerfile` is a multi-stage build using Next's standalone output;
`docker-compose.yml` runs Postgres + the app together. On boot the app runs
`prisma migrate deploy` via `docker-entrypoint.sh`, then starts the server.
Set real values for production:

- `DATABASE_URL` — managed Postgres connection string
- `JWT_SECRET` — required; the compose default is a placeholder
- `SEED_ON_START` — `true` seeds demo data on first boot; unset it for real use
- S3 vars (below) for real photo uploads

The image bundles the Prisma CLI + engines so migrations run in-container; for
multi-replica deploys, run `migrate deploy` as a one-shot release step instead
of on every app boot.

## Photo storage (S3)

Pet photos and chat images upload straight to an S3 bucket via presigned PUT
URLs — the Next server signs the request, the browser uploads the bytes, and
the returned public URL is stored on the pet/message. Configure in
`.env.local` (see `.env` for the full list):

```
S3_BUCKET=…  S3_REGION=…  S3_ACCESS_KEY_ID=…  S3_SECRET_ACCESS_KEY=…
# S3_ENDPOINT / S3_FORCE_PATH_STYLE / S3_PUBLIC_URL for R2 · MinIO · Spaces
```

Leave it unset and uploads transparently fall back to the gradient-emoji
placeholders, so dev needs no bucket. `src/server/storage.ts` +
`/api/uploads` (presign) + `src/lib/upload.ts` (client) are the whole path.

## Not built yet (deliberately)

OAuth (Google/Apple buttons are visual), real SMS OTP (any 6-digit code
passes), realtime chat updates (messages load on navigation), verification
review tooling, password change/reset persistence. `JWT_SECRET` and real S3
credentials must be set outside dev.

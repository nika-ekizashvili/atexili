# ატეხილი (Atexili) — "Tinder for animals" 🐾

Georgian-language, mobile-first pet-matchmaking web app. Owners create profiles
for their **animals**, swipe on other animals on their pet's behalf, and a
mutual right-swipe opens a chat between the two owners.

**Status:** full-stack — Next.js frontend + API routes backed by Prisma. Dev
runs on SQLite with zero setup; the schema is written for a one-line switch to
Postgres. The full hifi design handoff lives in [`design/`](design/README.md)
and is the source of truth for all screens and tokens.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — UI and the REST API (route
  handlers under `src/app/api/`)
- **Prisma 7** + **SQLite** (dev) via `@prisma/adapter-better-sqlite3` —
  swap the adapter + provider for **Postgres** in production
- **Auth:** email/password (bcrypt) + JWT session in an httpOnly cookie (jose)
- **Photo storage:** S3 (AWS SDK) via presigned direct-to-bucket uploads —
  works with any S3-compatible service; falls back to placeholders when unset
- **Tailwind CSS v4** — design tokens mapped 1:1 from the handoff
  (`src/app/globals.css` `@theme` block)
- **Framer Motion** — swipe deck physics, match spring-pop, bottom sheets
- **Zustand** — client cache over the API (only launch flags persist locally)
- **Lucide** icons, **Noto Sans/Serif Georgian** via `next/font`

## Run

```bash
npm install     # also runs prisma generate
npm run setup   # creates dev.db (SQLite) + seeds the demo data
npm run dev     # http://localhost:3000
```

`npm run build` for production; `npm run db:seed` to reset the demo data.

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
prisma/
  schema.prisma          — data model (SQLite dev; Postgres-ready shapes)
  seed.mjs               — demo dataset (ნიკა, ლუნა, candidates, chats)
prisma.config.ts         — Prisma 7 config (connection URL, seed command)
src/server/
  db.ts                  — PrismaClient singleton (better-sqlite3 adapter)
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

Pet "photos" are intentionally the mock placeholders (emoji on warm gradients)
— they swap for real uploads once storage exists.

## Moving to Postgres

1. `datasource db { provider = "postgresql" }` in `prisma/schema.prisma`
2. Point `DATABASE_URL` at your Postgres instance (`.env.local`)
3. Replace the adapter in `src/server/db.ts` with `@prisma/adapter-pg`
4. `npx prisma migrate dev` (and promote the JSON-string columns to `Json`)

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

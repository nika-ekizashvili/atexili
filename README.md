# ატეხილი (Atexili) — "Tinder for animals" 🐾

Georgian-language, mobile-first pet-matchmaking web app. Owners create profiles
for their **animals**, swipe on other animals on their pet's behalf, and a
mutual right-swipe opens a chat between the two owners.

**Status:** frontend complete against a mock data layer (no backend yet). The
full hifi design handoff lives in [`design/`](design/README.md) and is the
source of truth for all screens and tokens.

## Stack

- **Next.js 16** (App Router) + **TypeScript** — will also host the API routes
  when the backend lands (planned: Prisma + Postgres)
- **Tailwind CSS v4** — design tokens mapped 1:1 from the handoff
  (`src/app/globals.css` `@theme` block)
- **Framer Motion** — swipe deck physics, match spring-pop, bottom sheets
- **Zustand** (persisted to `localStorage`) — session, pets, deck, matches,
  chats, filters, settings
- **Lucide** icons, **Noto Sans/Serif Georgian** via `next/font`

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Demo accounts

- **შესვლა (login)** → seeded showcase account: owner ნიკა with ლუნა (cat) and
  ბობი (dog), 4 matches, a live chat thread with თომა.
- **რეგისტრაცია (register)** → fresh account walking the full onboarding:
  age gate → intro → register → phone → OTP → owner profile → add-pet wizard →
  notification priming → empty states everywhere.

Liking **თომა** in the deck triggers the scripted mutual match → match
overlay → chat.

## Where things live

```
design/                  — hifi handoff (README + per-screen .dc.html mocks)
src/lib/
  types.ts               — domain model (Pet, Candidate, Conversation, Filters…)
  data.ts                — seed fixtures (all mock content)
  store.ts               — zustand store + deck filtering selector
src/components/
  HeartCat.tsx           — the logo, rebuilt as SVG (angry/calm variants)
  ui.tsx                 — Button/Input/Toggle/Chip/WizardProgress/… primitives
  Sheet.tsx              — bottom sheet with scrim
  BottomNav.tsx          — persistent 4-tab bar
  swipe/                 — SwipeCard (drag physics) + MatchOverlay
src/app/
  age-gate, intro, auth/* (welcome…OTP…success), onboarding/profile,
  (tabs)/{discover,matches,chats,pets}, pets/new (6-step wizard),
  pets/[id]/edit, pet/[id] (detail), chats/[id] (thread + attachments),
  filters, verification, report/[id], settings(+delete), profile/edit,
  notifications (permission priming)
```

Pet "photos" are intentionally the mock placeholders (emoji on warm gradients)
— they swap for real uploads once storage exists.

## Backend (next phase)

Planned per the stack decision: Next.js API routes + Prisma + Postgres —
auth (email + phone OTP + OAuth), pets/matches/messages persistence, photo &
document storage, verification review queue, report/block moderation. The mock
repository layer in `src/lib` is shaped so screens don't change when the real
API replaces it.

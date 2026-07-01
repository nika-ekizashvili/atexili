# Handoff: ატეხილი (Atexili) — "Tinder for animals"

## Overview
Atexili is a **Georgian-language, mobile-first pet-matchmaking app**. Owners create profiles for their **animals** (not themselves), swipe on other animals on their pet's behalf, and a **mutual right-swipe opens a chat between the two owners**. The product's core promise is trust: verified profiles, health info, and safety tooling.

Market: Georgia only (🇬🇪). Primary language: **Georgian (ka)**. Platform target: **iOS / mobile-first** (design is drawn at 402×874, iPhone-class).

This bundle documents the **full screen set** for a v1 build. (An interactive click-through prototype existed during design but is intentionally **excluded** — it omitted the persistent bottom navigation and other cross-screen chrome. Treat this README + the per-screen files as the source of truth, not the prototype.)

---

## About the Design Files
The files in `screens/` are **design references authored in HTML** (a small component runtime — `support.js` — renders `.dc.html` files; the iPhone bezel comes from `frames/ios-frame.jsx`). They are **prototypes that show intended look and behavior, not production code to ship**.

Your task: **recreate these designs in the target codebase's environment** using its established patterns and component library. If there is no codebase yet, choose an appropriate stack — **React Native or Expo** is the natural fit given the iOS/mobile-first, gesture-driven design (swipe deck), with a Georgian-first i18n layer.

**Do NOT reproduce the iPhone bezel / status bar / home indicator** — that is presentation chrome from the mock harness, not part of the product. Build against the real device safe-areas.

To view a reference: open any `screens/*.dc.html` in a browser (they are self-contained — `support.js`, `HeartCat.dc.html`, and `frames/` are included alongside).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and interactions are specified below with exact values. Recreate pixel-faithfully using the codebase's libraries. Where the mocks use an **emoji or a gradient block as a stand-in for a pet photo**, that is a placeholder — wire real image assets in their place (see Assets).

---

## Design Tokens

### Color
**Brand**
| Token | Hex | Use |
|---|---|---|
| `primary` | `#E2643B` | Terracotta — primary buttons, active states, accents |
| `primary-hover` | `#C44F2C` | Primary pressed/hover, emphasis text on light |
| `secondary` | `#F5BFA6` | Peach — soft fills, photo-gradient start |
| `accent` | `#E8A93C` | Honey/gold — **verified badge**, rewind, photo-gradient end |

**Terracotta scale:** 50 `#FDF3EE` · 100 `#FADFD2` · 200 `#F5BFA6` · 300 `#EF9E7B` · 400 `#E97E54` · 500 `#E2643B` · 600 `#C44F2C` · 700 `#9E3E22` · 800 `#78301B` · 900 `#521F12`

**Warm neutrals**
| Token | Hex | Use |
|---|---|---|
| `bg` | `#FBF5EF` | App background (neutral-50) |
| `surface` | `#FFFFFF` | Cards, sheets, nav |
| `border-subtle` | `#EBE1D6` | Hairline dividers, card borders (neutral-100) |
| `border` | `#DDCFC0` | Input borders (neutral-200) |
| `text-muted` | `#7F6C58` | Secondary text (neutral-500) |
| `text` | `#2E2620` | Primary text (neutral-800) |
| extra | `#453931` body-alt · `#5F4F3E` label · `#A5917D` placeholder/mono · `#B0A092` disabled/nope · `#8A7866` caption |

**Status:** success `#2FA36B` · warning `#E6A020` · danger `#D64C41`
**Swipe semantics:** like `#34B27B` · nope `#B0A092` · rewind `#E8A93C`
**Tag surfaces:** success chip bg `#E9F6EE` / text `#1F7A4D` · gold chip bg `#FBF0D6` / text `#9A6B12` · terracotta chip bg `#FDF3EE` / text `#C44F2C`

### Typography
- **UI / body / headings:** `Noto Sans Georgian` (weights 300–900). This is the workhorse — it is the only full-weight Georgian family on Google Fonts, chosen for complete ქართული coverage. `system-ui, sans-serif` fallback.
- **Display / brand only:** `Noto Serif Georgian` (600/700) — used for the wordmark "ატეხილი", big "დამთხვევა!" moments, and hero numerals. Do not use for body.
- **Mono (specimen/labels only, not in-product):** `Space Mono` — only appears in the style-guide/handoff chrome; not part of the app UI.

**Type scale** (px / weight / line-height):
| Role | Size | Weight | LH |
|---|---|---|---|
| display | 64 | 700 (serif) | 1.0 |
| h1 | 40 | 800 | 1.1 |
| h2 (screen title) | 30 | 800 | 1.15 |
| h3 | 22 | 700 | 1.2 |
| body-lg | 18 | 500 | 1.55 |
| body | 16 | 400–500 | 1.6 |
| body-sm | 14 | 500 | 1.5 |
| overline | 12 | 700 | 1.0, `letter-spacing:0.06–0.08em`, uppercase |

Mobile minimum body text is **14px**; tap targets **≥44px**.

### Spacing (4px base)
`xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 · 4xl 64`. Screen horizontal padding is typically **22–26px**; top padding accounts for status bar (~62–70px in mock, use safe-area inset in build).

### Radius
`sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · full 999`. Buttons/inputs use **14–16px**; cards **20–28px**; pills/avatars **999px**.

### Elevation (warm-tinted — shadows use brown `rgba(82,31,18,·)`, not black)
- `sm` `0 1px 2px rgba(82,31,18,0.08)` — chips, list rows
- `md` `0 4px 12px -2px rgba(82,31,18,0.12)` — raised cards, menus
- `lg` `0 12px 28px -8px rgba(82,31,18,0.20)` — sheets
- `xl` `0 24px 48px -12px rgba(82,31,18,0.28)` — swipe card, modals
- Primary-button glow: `0 10px 20px -8px rgba(226,100,59,0.6)` (rest) → `0 16px 28px -10px rgba(196,79,44,0.62)` (hover)

### Motion
- Durations: `instant 120ms` (tap feedback) · `base 220ms` (UI transitions) · `swipe 350ms` (card exit) · `match 600ms` (celebrate)
- Easing: `standard cubic-bezier(0.4,0,0.2,1)` · `spring cubic-bezier(0.34,1.56,0.64,1)` (match pop, toggles)
- Hover/press on all controls transition at **0.16s ease** (background, box-shadow, transform).

### Iconography
Rounded/soft **outline** set, 2px stroke, round caps/joins, 24×24 grid. Two weights: outline (default) + filled (active). **Recommended: Phosphor or Lucide (rounded variant).** Sizes: 16 / 20 / 24 / 32 / 44(tap). The mocks use **emoji as icon stand-ins** (🐈 🐕 💛 💬 🔥 🐾 ✓ ✕ ♥ ↺ 📍 💉 🧬 📄 🛡️ 🔔) — replace with the real icon set; keep emoji only where genuinely intended (e.g. user-authored chat text).

---

## Shared Components
Specify these once; screens below reference them.

### Bottom Navigation Bar ⚠️ (the missing piece — build this as persistent chrome)
Persistent tab bar shown on the **four top-level destinations**. Not present on modal/stack screens (onboarding, wizards, chat thread, detail, filters, match overlay).
- Container: `background:#FFFFFF`, `border-top:1px solid #EFE4D8`, padding `10px 12px` + bottom safe-area (mock uses 30px), 4 items `justify-content:space-around`.
- Item: vertical stack, `gap:3px`; icon 21px; label 11px, weight 700 (800 when active).
- **Tabs (L→R):** `აღმოჩენა` (Discover/Swipe, 🔥) · `დამთხვევები` (Matches, 💛) · `ჩატები` (Chats, 💬) · `ჩემი` (My Pets, 🐾).
- Active color `#E2643B`; inactive `#B0A092` (mock desaturates the emoji with `filter:grayscale(1)` — use the filled vs outline icon instead).
- Note: the mock's "My Pets" screen predates the nav and shows a profile avatar top-right instead; in the real app **My Pets is the `ჩემი` tab**.

### Buttons (height 54px unless noted; radius 16px; font 17px/700; transition 0.16s)
- **Primary:** bg `#E2643B`, text `#fff`, shadow `0 10px 20px -8px rgba(226,100,59,0.6)`. Hover: bg `#C44F2C`, `translateY(-1px)`, shadow `0 16px 28px -10px rgba(196,79,44,0.62)`. Active: `translateY(0)`.
- **Secondary (peach):** bg `#FADFD2`, text `#C44F2C`. Hover bg `#F6CDB9`.
- **Outline:** border `2px solid #DDCFC0`, text `#5F4F3E`, transparent bg (height ~50px).
- **Ghost/tertiary:** transparent, text `#7F6C58`, 15px/700 (e.g. "მოგვიანებით" / later, "გაუქმება" / cancel).
- **Destructive:** bg `#D64C41`, text `#fff`, shadow `…rgba(214,76,65,0.55)` (report/block confirm).
- **Circular actions (swipe):** nope ✕ = 64px, white, `border:1px solid #EBE1D6`, icon `#B0A092`; like ♥ = 64–72px, bg `#34B27B`, white icon; rewind ↺ / super ★ = 50px, white, icon `#E8A93C`/`#E2643B`. All with `xl`-ish drop shadow; hover lifts, active scales ~0.95.
- **Back chevron:** 40×40, radius 12, bg `#fff`, border `1px #EBE1D6`, `‹` 20px `#5F4F3E`. Hover tints peach (`bg #FADFD2`, border `#F5BFA6`, text `#C44F2C`).

### Inputs
Height 52px, padding `0 16px`, `border:1.5px solid #DDCFC0`, radius 14, bg `#fff`, text 16px/500–600. **Focus:** `border-color:#E2643B`. Label above: 13px/700 `#5F4F3E`, `margin-bottom:7px`. Placeholder `#A5917D`. Select/stepper rows use the same shell with a trailing `›` or emoji affordance.

### Chips / Tags (pill, radius 999)
Padding `6–8px 12–14px`, 12–13px/600–700. Health/success: bg `#E9F6EE` text `#1F7A4D` (`✓ ვაქცინირებული`). Breed/terracotta: bg `#FDF3EE` text `#C44F2C`. Gold/verified: bg `#FBF0D6` text `#9A6B12`. Over-photo info pills: bg `rgba(255,255,255,0.94)`, text `#5F4F3E`, 12px/700 (e.g. `🐈 კატა · ბრიტანული`, `📍 2.4 კმ`).

### Verified badge
Gold disc `#E8A93C`, white `✓` (weight 900). Sizes: 16px inline next to names, 20–24px on cards. Signals a document-verified profile.

### Toggle (switch)
50×30 pill, knob 24px white. On `#2FA36B` (knob right), off `#DDCFC0` (knob left). Spring easing.

### Wizard progress bar
Row of equal segments, `gap:5px`, each `height:6px` radius 999; completed/active `#E2643B`, remaining `#EBE1D6`. Paired with a `n/total` mono counter.

### Pet Card (the swipe unit)
Radius 24–28, bg `#fff`, shadow `xl`. Top: photo area (in mock a `linear-gradient(135deg,#F5BFA6,#E8A93C)` block with a big emoji — **replace with real photo**), with over-photo info pills bottom-left and (on summary cards) a verified pill top-right or inline. Body: name (24px/800) + age (20px/600 muted) + verified badge + gender tag (`♂ მამრი` / `♀ მდედრი`, 13px/700 `#C44F2C`); one-line bio (14px/500 `#5F4F3E`); health chips row.

### Match overlay
Full-bleed `radial-gradient(120% 60% at 50% 30%, #E2643B, #78301B)`. "დამთხვევა!" in Noto Serif 52px `#fff`; subtitle in `#FADFD2`; two overlapping 112px avatar circles (rotated ∓6°) with a 56px white heart disc between; primary white CTA "გაუგზავნე შეტყობინება" (send message) + outline CTA "განაგრძე ათვალიერება" (keep browsing). Enters with spring pop (600ms).

---

## Screens / Views
Files live in `screens/`. Each `.dc.html` may contain several screens laid out side-by-side (ids noted). All copy is Georgian; English glosses in parentheses.

### A. How it works — `Atexili Intro.dc.html` (onboarding, 3 slides)
Full-bleed peach radial bg. Skip link top-right; dot pager + primary CTA bottom.
1. **პროფილი შენი ცხოველია** (Your profile is your animal) — a pet card with a "= ცხოველი 🐾" tag. Explains the card represents the animal, you are the owner.
2. **ათვალიერებ მისი სახელით** (You browse on its behalf) — card flanked by ✕ and ♥; right=like, left=skip.
3. **ორმხრივი მოწონება = დამთხვევა** (Mutual like = match) — two cat avatars + heart + two chat bubbles; mutual like opens owner-to-owner chat. CTA "დავიწყოთ 🐾" (let's start).

### B. Auth — `Atexili Auth.dc.html` (8 screens: s1–s8)
- **s1 Welcome** — HeartCat logo (108px), wordmark, tagline; primary "რეგისტრაცია" + secondary "შესვლა"; divider "ან"; Google + Apple buttons (white, `1.5px #DDCFC0` border, brand glyph); 18+ terms/privacy note (12px `#A5917D`).
- **s2 Register** — name / email / password inputs; **password strength meter** = 4 segments (2×`#2FA36B`, 1×`#E8A93C`, 1×`#EBE1D6`); terms checkbox (checked = 22px `#E2643B` rounded square, white ✓); primary "გაგრძელება"; footer link to login.
- **s3 Login** — 72px logo, email + password (password row has right-aligned "დაგავიწყდა?" / forgot), primary "შესვლა", social row, link to register.
- **s4 Phone** — country field `🇬🇪 +995` + number input; privacy reassurance banner (bg `#FBEFDA`, text `#9A6B12`, 🔒); primary "კოდის გაგზავნა" (send code).
- **s5 OTP** — 6 boxes (60px, radius 14; filled show digit; active box `2px #E2643B` + focus ring `0 0 0 4px rgba(226,100,59,0.12)` with a caret bar); "ხელახლა გაგზავნა 0:24" resend countdown; primary "დადასტურება".
- **s6 Forgot** — key icon tile `🔑` on `#FADFD2`; email input; primary "აღდგენის ბმულის გაგზავნა" (send reset link); link back to login.
- **s7 Reset** — new password (strength meter) + confirm (valid = green ✓ in field); primary "პაროლის შენახვა".
- **s8 Success** — 112px HeartCat (**mood=calm**) with a `#2FA36B` ✓ badge; "ანგარიში მზადაა!" (account ready); primary "ცხოველის დამატება" (add pet) + ghost "მოგვიანებით".

### C. Owner Profile & My Pets — `Atexili Profile.dc.html`
- **pr1 Profile creation (owner)** — 2-step progress; circular avatar (initial „ნ" on `#E2643B`, 📷 edit fab); **name** input + **location** row (`📍 თბილისი, საქართველო`) with a "📡 მიმდინარე მდებარეობის გამოყენება" (use current location) peach chip; privacy banner ("ზუსტ მისამართს არასდროს ვაჩვენებთ" — exact address never shown, only approximate distance); primary "გაგრძელება".
- **pr2 My Pets hub** — screen title + owner avatar; **pet card** (76px thumb, name+age+verified, "კატა · ბრიტანული · მდედრი", intent chip) with a 3-stat footer (მოწონება/დამთხვევა/ახალი ჩატი = likes/matches/new chats); dashed "＋ კიდევ ცხოველის დამატება" (add another pet); primary "🔥 დაიწყე swipe ლუნას სახელით". In the real app this is the `ჩემი` nav tab (see Bottom Nav note).

### D. Add Pet wizard — `Atexili Add Pet.dc.html` (6 steps: p1–p6, progress 1/6→6/6)
1. **Species** — 2×2 grid: კატა 🐈 (selected, `2px #E2643B`, ✓) / ძაღლი 🐕 / ფრინველი 🐦 / სხვა 🐾. Deck is filtered by species.
2. **Basics** — name; breed select row; **gender** segmented (♀ მდედრი selected / ♂ მამრი); birthdate row (shows derived age).
3. **Photos** — 3-col grid of 3:4 slots; first tagged "მთავარი" (cover); empty slots dashed with ＋; min 1 / 3+ recommended; tip banner.
4. **Health** — three toggle rows: ვაქცინაცია (vaccination, on), ჯანმრთელობის ტესტები (tests, on), დოკუმენტი/რეგისტრაცია (docs, off); + health-tag chips with a "＋ დამატება".
5. **Intent** — two selectable cards: **ეძებს დაწყვილებას** (looking to mate, selected) / **ხელმისაწვდომია** (available). These are the two PRD intent states.
6. **Publish** — live preview of the finished pet card, then primary "გამოქვეყნება" + ghost "რედაქტირება".

### E. Swipe deck — `Atexili Swipe.dc.html` (sw1 deck, sw2 switcher)
- **sw1 Deck** — top bar: **pet switcher** ("ათვალიერებ როგორც ლუნა ▾" — browsing as, with avatar) + filter/settings icons (badge "3" on filter); card stack (front card draggable, faded back card peeking); action row ↺ / ✕ / ♥ / ★; **bottom nav** (Discover active). Filtering rule: browsing as Luna (♀ British cat) → deck shows ♂ cats nearby. Empty state: 🐾 tile + "ამ წრეში ესაა ყველა" (that's everyone in range) + "ფილტრების შეცვლა".
- **sw2 Switcher** — bottom sheet (grabber handle) listing the owner's pets (Luna ✓ / ბობი dog) + "＋ ცხოველის დამატება"; picking one refilters the deck.

### F. Pet Profile detail — `Atexili Profile Detail.dc.html`
Tap-to-expand full profile. Photo header (468px) with **story segments** (top progress ticks for multiple photos), back + report (⚑) controls on translucent discs, gradient scrim, name/age/verified + info pills over the photo. Details sheet (pulled up, radius 26): **ბიო** (bio), **ჯანმრთელობა** (health list: vaccination/genetic tests/pedigree doc, each `#2FA36B ✓`), **დეტალები** grid (species/breed/gender/age), **owner** row (avatar + verified). Sticky bottom action bar: ✕ / ↺ / ♥.

### G. Matches & Chat — `Atexili Chat.dc.html` (ch1 list, ch2 thread)
- **ch1 Matches** — screen title; **"ახალი დამთხვევები"** horizontal avatar rail (66px circles, `3px #E2643B` ring); **"მიმოწერა"** conversation list on a white rounded top-sheet: 56px avatar, name (+verified), last-message preview (bold if unread), timestamp, unread count pill (`#E2643B`); bottom nav (Matches active).
- **ch2 Chat thread** — header: back, 44px avatar, name+verified, "მფლობელი · გიორგი" (owner name); ⋯ menu (→ report/block, see Safety). Match banner "💛 თქვენ დაემთხვიეთ · დღეს". Bubbles: incoming bg `#EBE1D6` text `#2E2620` radius `18 18 18 5`; outgoing bg `#E2643B` text `#fff` radius `18 18 5 18`; read receipt "წაკითხულია · 14:32". Input bar: ＋ attach (42px `#F5EEE6`), pill text field "მესიჯი...", send ➤ (46px `#E2643B`). **Attachment flow is in `Atexili Chat Attach.dc.html` (section L).**

### H. Filters — `Atexili Filters.dc.html` (fl1)
Header "ფილტრები" + "განულება" (reset). Sections: **species** (4-tile, კატა selected), **breed** ("open to compatible breeds" toggle, off = same breed only), **gender** (segmented, defaults to opposite of the browsing pet), **distance** (single slider, "10 კმ-მდე", range 1–50km, track fill `#E2643B`, 26px thumb white/`2px #E2643B`), **age** (dual-handle slider "1–6 წელი"), **verified-only** toggle (on). Sticky primary "28 კანდიდატის ჩვენება" (show N candidates — live count).

### I. Verification — `Atexili Verification.dc.html` (v1 request, v2 pending)
- **v1 Request** — 🛡️ tile on `#FBF0D6`; value prop ("verified profiles get 3× more likes"); **required docs** list: owner ID (uploaded, `2px #2FA36B`, ✓) + pet document (dashed, "ატვირთვა" upload chip); privacy banner (docs used for review only, never shown on profile); primary "გაგზავნა განსახილველად" (submit for review).
- **v2 Pending** — ⏳ disc on `#E8A93C`; "განხილვაშია" (under review, 24–48h); **status timeline** (გაგზავნილია ✓ → მიმდინარეობს განხილვა ◔ → badge-ის მინიჭება ★); outline "დახურვა".

### J. Safety — `Atexili Safety.dc.html` (sf1 report, sf2 block)
- **sf1 Report** — header "საჩივარი"; 6 single-select reason rows (fake/misleading selected): ყალბი პროფილი / აგრესიული ქცევა / სპამი / არასათანადო შინაარსი / არ არის რეალური ცხოველი / სხვა; destructive "საჩივრის გაგზავნა". Anonymous.
- **sf2 Block** — dark scrim with an iOS-style action sheet (report / **block** destructive / cancel) behind a **centered confirm dialog**: 🚫 on `#FBE3E0`, "დაბლოკო თომა?", explanation (you won't see each other; chat closes; reversible in settings), destructive "დიახ, დაბლოკვა" + ghost "გაუქმება".

### K. Notifications & Empty states — `Atexili Notifications & Empty.dc.html`
- **nt1 Permission priming** — 🔔 tile (badge "3"); "არ გამოტოვო დამთხვევა" (don't miss a match); two benefit rows (💛 new match / 💬 messages); primary "შეტყობინებების ჩართვა" (enable) + ghost "მოგვიანებით". Show **before** the OS permission prompt.
- **nt2 Push / lock screen** — dark lock screen with date + 9:41 clock and two glass notification cards (match + message) from "ატეხილი". Copy for a match push: "🎉 ახალი დამთხვევა! ლუნა და თომა ერთმანეთს მოეწონენ."
- **nt3 Empty · Matches** — 🐾 tile, "ჯერ დამთხვევა არ გაქვს", CTA "🔥 swipe-ის დაწყება". (Matches tab active.)
- **nt4 Empty · Chats** — 💬 tile, "ჯერ მიმოწერა არ არის". (Chats tab active.)
- **nt5 Empty · Pets** — cat-gradient tile, "ჯერ ცხოველი არ დაგიმატებია", CTA "＋ ცხოველის დამატება". (My/ჩემი tab active.)

### L. Chat attachments — `Atexili Chat Attach.dc.html` (ca1 sheet, ca2 result)
Opened from the chat input's ＋ button.
- **ca1 Attachment sheet** — bottom sheet (grabber handle) over a dimmed chat + scrim. 2×2 grid of options, each a white rounded tile (46px colored icon square + label): **🖼️ ფოტოები** (photo library, `#FADFD2`), **📷 კამერა** (camera, `#E9F6EE`), **📄 ჯანმ. დოკუმენტი** (health document, `#FBF0D6`), **📍 შეხვედრის ადგილი** (meeting location, `#EAF1FB`). Full-width "გაუქმება" (cancel) below. When open, the ＋ button rotates 45° into an ✕.
- **ca2 Result** — how attachments render in the thread: an **image message** (rounded bubble, photo fills, timestamp below) and a **location message** (map-preview card with 📍 over a grid pattern + place name "ვეტ-კლინიკა „ჯანმო"" + address/distance). Both right-aligned (outgoing) with the outgoing radius. Wire the location card to open the device map app.

### M. Settings & Account — `Atexili Settings.dc.html` (st1 settings, st2 delete)
- **st1 Settings** — header "პარამეტრები" + back. Grouped list sections (12px/800 uppercase muted labels; rows on white `1px #EBE1D6` rounded-16 cards, `1px #F5EEE6` dividers, trailing `›` or toggle):
  - **ანგარიში** (Account): ✉️ ელ. ფოსტა (email) · 📱 ტელეფონი (phone, masked) · 🔑 პაროლის შეცვლა (change password).
  - **შეტყობინებები** (Notifications): ახალი დამთხვევა (new match, on) · ახალი მესიჯი (new message, on) · რჩევები და სიახლეები (tips, off) — toggles.
  - **კონფიდენციალურობა** (Privacy): მდებარეობის გაზიარება (share location, on) · 🚫 დაბლოკილები (blocked, count → list) · ⬇️ ჩემი მონაცემების გადმოწერა (**download my data** — GDPR-style export).
  - **სამართლებრივი** (Legal): მოხმარების პირობები (terms) · კონფიდენციალურობის პოლიტიკა (privacy policy).
  - Footer: outline **გასვლა** (logout) + destructive-text **ანგარიშის წაშლა** (delete account → st2).
- **st2 Delete account** — ⚠️ tile on `#FBE3E0`; "ანგარიშის წაშლა", warns the action is **შეუქცევადი** (irreversible). Lists what is permanently deleted (🐾 pets ×2, 💛 matches ×5, 💬 chats & history, 📄 uploaded documents). Compliance banner (`#FBEFDA`): data fully erased from servers within **30 days** (satisfies the privacy policy's deletion right). Destructive "სამუდამოდ წაშლა" (delete permanently) + ghost "გაუქმება". Production: gate behind password/OTP re-auth before the destructive call.

### N. Age gate (18+) — `Atexili Age Gate.dc.html` (ag1 gate, ag2 blocked)
Shown **on launch, before onboarding/auth** — a legal requirement (app is 18+).
- **ag1 Age gate** — peach radial bg; big `18+` mark on a terracotta rounded-square; "ეს აპლიკაცია 18+ არის"; **date-of-birth** row; consent checkbox "ვადასტურებ, რომ ვარ 18 წლის ან მეტის" (+ terms link); primary "დადასტურება"; small note that age is checked to filter bots/minors. Persist the pass so it isn't shown again.
- **ag2 Blocked (<18)** — shown if DOB < 18: 🚧 tile on `#FBE3E0`, "ჯერ ვერ შემოხვალ" (can't enter yet), explanation that use is 18+ only; outline "დახურვა". Dead-ends the flow (no bypass).

### O. Edit flows — `Atexili Edit.dc.html` (ed1 owner, ed2 pet)
Reached from profile/pet screens; **fields pre-filled** with current values; top bar has back + a bold **შენახვა** (save) action.
- **ed1 Edit owner** — editable avatar (📷 fab), name, location row, an "ჩემ შესახებ" (about me) multiline field, and a verification status row (→ verification flow). Mirrors owner profile creation (section C, pr1) in edit mode.
- **ed2 Edit pet** — photo grid (reorder/add/remove; first = cover), name, bio, intent segmented (დაწყვილება / ხელმისაწვდომი). Ends with a destructive-text **🗑 ცხოველის წაშლა** (delete pet) — confirm before removing; deleting the last pet lands on the My Pets empty state (nt5). Mirrors the add-pet wizard (section D) collapsed into one editable screen.

### Reference-only files
- `Atexili Design Tokens.dc.html` — the living style guide (all tokens visualized; motion demos).
- `Atexili Logo.dc.html` — logo exploration board (final = the angry HeartCat).
- `HeartCat.dc.html` — the **logo as a parametric component** (props: `size`, `bg`, `fg`, `ink`, `mood: angry|calm`, `shadow`). The face is a heart (chin = the heart's point) with pointed notched ears; `angry` adds brows + slanted eyes. Reproduce as an SVG asset in-app (two variants: angry for brand/marks, calm for success/celebration).

---

## Interactions & Behavior
- **Swipe deck (core):** drag the front card; it translates with `rotate(dx/18)` and a slight vertical drift. Passing a ±100px threshold commits like (right) / nope (left); the card animates out over ~350ms (`standard` ease), next card promotes. **"მოწონება"/"გამოტოვება" stamps** fade in proportionally to drag distance (opacity = |dx|/90, clamped 0–1), green on the right, muted on the left. Buttons (✕/♥) trigger the same commit programmatically. ↺ rewinds one card.
- **Match:** a mutual like shows the Match overlay with a spring pop (600ms). Primary → open chat; secondary → resume deck. In the mock, "თომა" is a scripted mutual match.
- **Pet switcher:** changing the active pet re-runs the deck filter (species + opposite gender + distance/age/verified filters).
- **Hover/press:** every control has hover + active states (0.16s). Primaries darken + lift; icon buttons lift + slightly scale on press; chevrons tint peach. (On touch these map to press states.)
- **Toggles/sliders:** immediate; sliders update the live candidate count on Filters.
- **Forms:** password strength meter reacts to input; confirm-password shows a ✓ when it matches; terms checkbox gates the register CTA.
- **Verification:** submit → pending timeline; on approval the profile gains the gold ✓ badge everywhere it appears.
- **Report/Block:** report is anonymous, single-select → confirmation; block is a destructive confirm that closes the chat and removes both from each other's decks (reversible in settings).

## State Management
- **Session/auth:** launch → **18+ age gate** (ag1; fail → ag2 dead-end) → onboarding intro → auth stack → (phone/OTP) → success. Persist auth token **and** the age-gate pass; gate the app on 18+ consent.
- **Owner:** profile {name, avatar, location(approx), verified}.
- **Pets[]:** each {species, name, breed, gender, birthdate→age, photos[], health{vaccinated, tested, docs}, intent: mate|available, verified}. **Active pet** selection drives the deck. Created via the add-pet wizard, changed via **edit pet** (ed2, incl. delete), empty pets → nt5.
- **Deck:** filtered candidate queue for the active pet; index pointer; per-card like/nope; rewind stack; empty state when exhausted.
- **Filters:** {species, sameBreedOnly, gender, distanceKm, ageRange[min,max], verifiedOnly} → recompute candidates + count.
- **Matches[]:** created on mutual like; each opens a **conversation** {messages[], unreadCount, lastMessageAt, readReceipts}. **Messages** are text, **image** (from library/camera), **document** (health doc), or **location** (place + coords). Empty → nt3/nt4.
- **Verification:** none | pending | verified (drives the badge).
- **Notifications:** permission {undetermined|granted|denied}; push types: new_match, new_message.
- **Blocks/reports[]:** hide blocked users from deck + matches; close their chats.
- **Settings:** notification prefs {newMatch, newMessage, tips}, privacy {shareLocation}, blocked[] (managed here). **Data export** produces a downloadable archive of the user's data. **Account deletion** is irreversible: wipes pets, matches, chats, and documents; server-side erasure completes within 30 days (privacy-policy compliance). Gate deletion behind re-authentication.

## Responsive Behavior
Designed for a single mobile column at ~402pt width. Use real safe-area insets (the mock's fixed 62–70px top / 30–44px bottom paddings approximate the notch + home indicator). Cards and sheets are full-width minus 20–26px gutters. No tablet/desktop layout is specified.

## Localization
**All UI copy is Georgian.** Wire an i18n layer (keys → ka strings) even if launching ka-only, so numerals, dates ("ორშაბათი, 14 ივლისი"), distances ("2.4 კმ"), and counters localize. Names/breeds shown are sample data.

## Assets
- **Fonts:** Noto Sans Georgian (300–900), Noto Serif Georgian (600/700) — Google Fonts, embed for offline. (Space Mono is handoff-chrome only; not needed in-app.)
- **Logo:** rebuild `HeartCat` as an SVG (angry + calm variants) from `HeartCat.dc.html`.
- **Icons:** adopt Phosphor or Lucide (rounded). Replace all placeholder emoji used as icons.
- **Pet photos:** every 🐈/🐕 emoji on a peach→gold gradient is a **placeholder for a user-uploaded photo**. Real profiles carry a photo array (cover + up to 6).
- **Social glyphs:** Google "G" (`#4285F4`) + Apple mark for sign-in buttons.
- No proprietary/brand imagery is used; nothing to license beyond the fonts + icon set.

## Files
```
screens/
  Atexili Intro.dc.html            — how-it-works (3 slides)
  Atexili Auth.dc.html             — welcome, register, login, phone, OTP, forgot, reset, success
  Atexili Profile.dc.html          — owner profile creation, My Pets hub
  Atexili Add Pet.dc.html          — 6-step add-pet wizard
  Atexili Swipe.dc.html            — swipe deck + pet switcher
  Atexili Profile Detail.dc.html   — full pet profile
  Atexili Chat.dc.html             — matches list + chat thread
  Atexili Chat Attach.dc.html      — attachment sheet + photo/location messages
  Atexili Filters.dc.html          — filter sheet
  Atexili Verification.dc.html     — verification request + pending
  Atexili Safety.dc.html           — report + block
  Atexili Notifications & Empty.dc.html — priming, push, empty states
  Atexili Settings.dc.html         — settings + account/data deletion
  Atexili Age Gate.dc.html         — 18+ age gate + blocked state
  Atexili Edit.dc.html             — edit owner profile + edit pet (with delete)
  Atexili Design Tokens.dc.html    — living style guide (reference)
  Atexili Logo.dc.html             — logo exploration (reference)
  HeartCat.dc.html                 — parametric logo component
  support.js, frames/ios-frame.jsx — mock runtime + device bezel (presentation only; do NOT ship)
```
Open any `.dc.html` in a browser to view. The bottom-nav bar is documented above (Shared Components) because it is cross-screen chrome not fully captured inside individual mock files.

# System Design — Adrak (OSS Journey Dashboard)

The design system for the dashboard, **as implemented** from the Claude Design
handoff (Direction **"Sprout"**, mascot **Adrak the orange cat**). This file is
the source of truth; values below match the live code (`src/index.css`,
`src/components/`, `src/lib/`).

> Medium: **inline styles + CSS custom properties** (no CSS framework), custom
> div-based charts (no chart lib). Light theme is the default.

## 1. Direction & principles

Cozy, Gen-Z, **full-Duolingo** — habit-forming, not a corporate dev tool.
Duotone (warm neutral + one screaming accent), rounded everything, a quirky
display font, juicy springy motion, and a mascot that reacts to you.

1. **Momentum, gamified.** XP, levels, streaks, daily quests, leagues — every
   action visibly moves a number and (often) rains confetti.
2. **Adrak is the heartbeat.** The cat bobs, blinks, wags, sleeps when you lapse,
   cheers when you win. He carries the emotional through-line.
3. **One-tap wins.** Checking a roadmap item / bumping a chapter / logging study
   is one click and immediately rewarding.
4. **Duotone calm + loud.** Cream canvas, acid-lime accent reserved for progress,
   primary actions, and "you're winning" moments.

## 2. Color tokens

Defined as CSS variables in `:root` (light) and `[data-theme="dark"]`, applied
to `<html>` by `src/lib/theme.ts`. Components only reference `var(--token)`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FBF7EC` | `#14110B` | page canvas |
| `--surface` | `#FFFFFF` | `#1C1810` | cards |
| `--surface-2` | `#F4EEDF` | `#262017` | insets, inputs, chips |
| `--surface-blur` | `rgba(255,253,247,.82)` | `rgba(20,17,11,.82)` | nav (blurred) |
| `--hero-panel` | `#FBF6E8` | `#1F1A11` | overview hero right panel |
| `--line` | `#ECE4D2` | `#342D20` | borders |
| `--text` / `--muted` / `--faint` | `#2A2520 / #8A8170 / #B3AB99` | `#F2ECDD / #A99D85 / #6E654F` | text ramp |
| `--heat-empty` | `#ECE5D4` | `#2A2418` | empty heatmap cell |

**Accent (lime):** `--accent #86CB12`, `--accent-deep #4E810A`,
`--accent-soft #EAF7CE` (dark: lime-tinted), `--on-accent #1f3300`.
**Mascot/warm:** `--cat #F7853A` (dark `#FF9A4D`).
**Tracks:** rust `--track-rust` (= cat orange), C/Linux `--track-c #1F9FC4`,
Rust-for-Linux `--track-rfl #8B5CF6` (brighter in dark).
**Status:** `--success #1F9D57`, `--warn #C98A00`, `--danger #E04A38`,
`--info #1F8FB5` (all brighter in dark).

Theme switching is `data-theme="light|dark"` on `<html>`; `color-scheme` is set
per theme so native controls adapt. `theme.ts` also recomputes `--accent-soft`
for dark (lime mixed into the dark bg). Translucent fills use
`color-mix(in srgb, <color> N%, transparent)`.

## 3. Typography

- **Display** (`--font-display`): **Fredoka** — rounded, characterful; used for
  all headings, stat numbers, buttons.
- **Body** (`--font-body`): **Nunito**.
- **Mono** (`--font-mono`): **JetBrains Mono** — counts, dates, XP, `kbd`,
  ranks. `.tabular` enables tabular figures.
- Base size 14px. Headings 16–26px. Micro-labels 9.5–12px, often uppercase.

## 4. Shape, spacing, elevation

- **Radius:** cards `22` (stat cards `18`), buttons `13`, inputs/chips `12`,
  badges/pills `999`, heatmap cells `4`.
- **Spacing:** page sections stack at `gap: 18`; card padding `15–22`; content
  column `max-width: 1080`, padded `30×32` (desktop) / `18×16` (mobile).
- **Elevation:** mostly flat with 1px `--line` borders. Floating layers get soft
  shadows (modal, toast); nav bars use `backdrop-filter: blur(16px)` over
  `--surface-blur`. Cards lift `-2px` + lime border on hover.

## 5. Motion (juicy & springy)

Keyframes in `index.css`, easing `cubic-bezier(.22,1,.36,1)`:
`fade-in`, `page-in` (route change), `slide-up` (modals/toast), `pop`,
`hm-pop` (heatmap cells stagger in), `flame-flick` (streak), `float-y` (Adrak
bob), `blink` / `tail-wag` (Adrak), `glow-pulse`. Buttons scale `0.96` on press;
progress bars/rings animate `.7–.9s`. **Confetti** (`lib/confetti.ts`) fires on
completions, level-ups, and cleared quests. All respect
`prefers-reduced-motion`.

## 6. Components (`src/components/`)

`Adrak` (mascot, moods happy/sleepy/cheer), `Icon` (inline SVG set),
`Card`, `Button` (primary lime / secondary / ghost / danger / **warm** cat),
`Badge`, `ProgressBar`, `Ring`, `StatCard`, `Modal` (portal, Esc, blur backdrop),
`Field`/`Input`/`Textarea`/`Select`, `Switch`, `EmptyState`, `PageHeader`,
`Heatmap`, `StackedBars`/`Bars` (custom charts), `Toast`, and the
Log/Contrib/Reading/Goal modals. Row actions reveal on hover (`.row-hover`),
always visible on touch.

## 7. Gamification model (`src/lib/calc.ts`)

- **XP:** study `20/hr`, reading `25/chapter`, roadmap item `40`, contributions
  `merged 150 / issue 70 / submitted 60 / changes 40 / rejected 10`, plus a
  `+120` all-daily-quests bonus.
- **Levels:** reach level *L* at `60·(L−1)²` cumulative XP.
- **Streak:** consecutive days with activity (study minutes or a contribution);
  today-not-yet-logged is a grace day. Longest streak tracked too.
- **Daily quests:** 3/day (log study · read a chapter · tick a roadmap item),
  reset each day; clearing all 3 → bonus + celebration.
- **Leagues:** this week's XP maps Bronze→Silver→Gold→Sapphire→Ruby→Diamond;
  shown on a 6-row leaderboard vs. rival cats (kernelcat, ferris_fan, …).
- **Activity heatmap:** `activity` is a `{ isoDate: minutes }` map; cells bucket
  into 5 lime-opacity levels.

## 8. Layout & navigation

- **Desktop (≥768px):** fixed left sidebar `232px` (Adrak brand, "Log time" +
  `N`, nav, streak/level chips, phase, theme toggle); content offset `248px`.
- **Mobile (<768px):** blurred top bar (brand, streak, theme, `+`) + bottom tab
  bar (7 sections). State-based routing; pages animate in with `page-in`.

## 9. Pages

Overview (hero + XP + phase stepper + heatmap + quests + league + pick-up),
Roadmap (tracks→groups→items, hide-done, inline add), Study (stat tiles +
hours-by-track stacked bars + sessions), Contributions (tiles + monthly bars +
filterable log + GitHub sync), Reading (cards with chapter steppers, status
cycle), Goals (countdown cards), Settings (GitHub, journey + dates, appearance,
data export/import/reset).

## 10. Implementation notes

- State is one typed `AppState` (`src/types.ts`) in `useStore`
  (`src/lib/store.ts`), persisted to `localStorage` on every change; mutations go
  through `update(s => …)` on a `structuredClone` draft. Seed data + the real
  GSoC/LFX/internship dates live in `store.ts`.
- Re-skin in one place: change the CSS variables at the top of `src/index.css`
  (or `--accent` via `theme.ts`) and the whole app follows.
- Ships with **no fabricated personal history** — empty study log, contributions,
  and activity (streak/level/XP start at zero and grow as you use it). The seed
  keeps only real scaffolding: the curriculum roadmap (all unstarted), the book
  list, and the real GSoC/LFX/internship dates. Set your name + GitHub username
  in Settings; the dashboard fills in from there.

---

### Provenance

Implemented from the Claude Design handoff bundle (`oss-dashboard/`): chat
transcript → Direction A "Sprout" + mascot **Adrak**. The HTML/JSX prototype was
recreated faithfully in this React + TypeScript + Vite project using its own
medium (inline styles + CSS variables), with the GitHub "Sync" wired to the real
public GitHub API.

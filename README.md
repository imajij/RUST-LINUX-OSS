# Adrak — OSS Journey Dashboard 🐱

A cozy, **Gen-Z, Duolingo-style** dashboard for tracking your journey into
open-source contribution (Rust + the Linux kernel). Built to be *habit-forming*:
**Adrak the orange cat** levels up as you study, a streak flame begs you not to
break the chain, daily quests and leagues keep you coming back, and finishing
things rains confetti.

Local-first — everything lives in your browser's `localStorage`. No backend, no
account, no tracking. Export to JSON anytime.

> Design: implemented from a [Claude Design](https://claude.ai/design) handoff —
> Direction **"Sprout"** (warm cream + acid-lime, rounded Fredoka type, juicy
> springy motion). See `systemdesign.md` for the full design system.

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
```

```bash
npm run build      # type-check + production build
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

## What's inside

- **Overview** — Adrak + level/XP bar, phase journey, a 26-week animated
  "don't break the chain" heatmap, daily quests, your league + leaderboard,
  countdowns, and one-tap "pick up where you left off".
- **Roadmap** — tracks → collapsible groups → checkable items (Rust, C/Linux,
  Rust for Linux). Ticking one fires confetti and feeds your quests.
- **Study Log** — fast logging (press <kbd>N</kbd> anywhere), hours-by-track
  chart, streak + longest streak.
- **Contributions** — PR/issue log with filters, monthly chart, starred main
  project, and one-click **GitHub sync** (imports your PRs by username).
- **Reading List** — books/docs with chapter progress (each chapter = XP).
- **Goals** — deadlines with day countdowns (LFX, GSoC 2027, internships…).
- **Settings** — GitHub username/token, journey dates, light/dark, export/import/reset.

### Gamification model

- **XP**: study `20/hr` · reading `25/chapter` · roadmap item `40` ·
  contribution `merged 150 / issue 70 / submitted 60 / changes 40` · all-quests
  bonus `120`.
- **Level**: reach level *L* at `60·(L−1)²` XP.
- **Streak**: consecutive days with any logged activity (today-not-yet-logged is
  a grace day).
- **League**: this week's XP → Bronze → Diamond, ranked against rival cats.

## Keyboard

- <kbd>N</kbd> — log study time · <kbd>Esc</kbd> — close a dialog ·
  <kbd>⌘/Ctrl</kbd>+<kbd>Enter</kbd> — save the log form

## Tech

React 18 · TypeScript · Vite. The design system is **inline styles + CSS custom
properties** (themed via `data-theme` on `<html>`) — no CSS framework, and
**custom div-based charts** (no chart library). Fonts: Fredoka (display), Nunito
(body), JetBrains Mono (numbers).

## Make it yours

- **Starter content + the XP/level/league rules** live in `src/lib/`
  (`store.ts` seed, `calc.ts` calculators) — tweak freely.
- **Design tokens** (every color, light + dark) are CSS variables at the top of
  `src/index.css`. Change `--accent` / `--bg` and the whole app re-skins.

## Project structure

```
src/
  types.ts              typed app state
  index.css             design tokens (light/dark) + animations + globals
  App.tsx               shell: sidebar / mobile nav, modals, celebrations, N key
  main.tsx
  lib/
    store.ts            seed data + useStore (localStorage)
    calc.ts             XP / levels / streak / leagues / progress
    date.ts, github.ts, theme.ts, confetti.ts
  components/
    Adrak.tsx           the cat mascot (animated SVG)
    Icon.tsx, ui.tsx, charts.tsx, Heatmap.tsx, modals.tsx, shared.tsx
  pages/                Overview, Roadmap, Study, Contributions, Reading, Goals, Settings
```

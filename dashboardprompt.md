# Project: Open Source Journey Dashboard (Rust + Linux)

You are building a personal, local-first dashboard for a 2nd-year engineering student tracking their journey into open source contribution, focused on Rust and the Linux kernel. The end goals are: sustained contributions to one or two major projects, applying to LFX Mentorship and GSoC 2027, and using this work for internship applications.

## Tech stack (keep it simple)

- React + Vite + TypeScript, single-page app
- Tailwind CSS for styling
- Data persistence: localStorage (with JSON export/import buttons so data is never lost)
- Charts: recharts
- No backend, no auth, no database server. It must run with `npm install && npm run dev` and nothing else.
- GitHub API integration to auto-fetch my PRs by username

## Dashboard sections

### 1. Overview (home)
- Current phase indicator (Phase 1: Fundamentals → Phase 2: Workflow → Phase 3: First Contributions → Phase 4: Going Deep)
- Key stats cards: total study hours, current streak (days with any logged activity), PRs opened, PRs merged, kernel patches sent
- A countdown to the next GSoC / LFX Mentorship application window (make these dates editable in settings)
- "This week" summary: hours logged, items completed

### 2. Roadmap tracker
A checklist tree organized by track, with progress bars per track. Pre-populate with:

**Rust track:**
- The Rust Programming Language (3rd ed) — one checkbox per chapter (21 chapters)
- Rustlings — track % complete
- Rust by Example (mark as reference)
- Project: CLI tool with clap
- Project: grep clone
- Project: key-value store
- Programming Rust (2nd ed) — per-chapter checkboxes
- Rust for Rustaceans — per-chapter checkboxes
- Rustonomicon (advanced)
- Writing an OS in Rust (os.phil-opp.com) — per-post checkboxes

**C / Linux track:**
- K&R The C Programming Language — per-chapter checkboxes
- The Linux Command Line (Shotts)
- Git: format-patch / send-email practice
- Build + boot a custom kernel in QEMU
- KernelNewbies "First Kernel Patch" tutorial
- Linux Kernel Development (Love) — per-chapter
- The Linux Programming Interface — per-chapter (64 chapters, collapsible)
- LDD3 — selected chapters
- First checkpatch.pl cleanup patch in drivers/staging
- First patch ACCEPTED into staging

**Rust for Linux track (unlocks later):**
- Read Documentation/rust/ in kernel tree
- Rust for Linux mailing list subscribed
- First Rust-for-Linux contribution

Each item supports: done/in-progress/not-started, a notes field, and a date completed. Let me add/edit/delete/reorder items — the pre-population is just a starting point.

### 3. Contribution log
A table of contributions with fields: date, project (e.g. clippy, tokio, linux/staging), type (PR / kernel patch / issue triage / review / docs), title, link, status (draft / submitted / changes-requested / merged-accepted / rejected), and notes (what I learned, reviewer feedback).
- Filter by project and status
- A chart of contributions over time (monthly bar chart)
- Highlight the "main project" I'm committing to long-term

### 4. Study log
- Quick-add entry: date, track (Rust / C-Linux / Rust-for-Linux), hours, what I did
- Weekly hours chart by track
- Streak calculation comes from this log + contribution log

### 5. Reading list
- The book/resource list with status (owned / reading / done), format (hardcopy / online), and current chapter
- Pre-populate with the books above

### 6. Goals & deadlines
- Editable milestones with target dates. Pre-populate with placeholders:
  - First merged ecosystem PR (target: +3 months)
  - First accepted kernel patch (target: +3 months)
  - LFX Mentorship application
  - GSoC 2027 application
  - Internship application season (3rd-year summer)
- Show days remaining, color-code overdue items

## Design requirements

- Dark theme by default with a toggle; clean, dense, developer-tool aesthetic (think Grafana/Linear, not a corporate SaaS landing page)
- Fully responsive — I'll check this on my phone
- Keyboard-friendly quick-add (e.g. a "+" button or `n` shortcut to log study time fast — logging friction kills habit trackers)
- Empty states should explain what each section is for

## Code quality

- Sensible component structure, typed data models in one `types.ts`
- All state changes go through one storage module so export/import stays consistent
- Seed the pre-populated data from a `seedData.ts` file so it's easy for me to edit

## Build order

1. Data models + storage module + export/import
2. Roadmap tracker (this is the core) ( add all the topics too here )
3. Study log + streaks
4. Contribution log + charts
5. Overview page (composes the rest)
6. Goals, reading list, settings, polish

Start by showing me the data model and your plan before writing the full app.

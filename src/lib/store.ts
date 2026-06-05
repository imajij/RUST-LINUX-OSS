// store.ts — starter scaffolding (NO fabricated personal history), default
// state, and the localStorage-backed useStore hook. Your real data accrues as
// you log study, tick the roadmap, and sync GitHub.

import { useCallback, useEffect, useState } from 'react'
import type { AppState, LeafItem, Quest, QuestKind } from '../types'
import { todayISO } from './date'

const STORE_KEY = 'adrak.v2'

/* ---------- scaffolding (real curriculum, all unstarted) ---------- */
function seedRoadmap(): AppState['roadmap'] {
  const leaf = (id: string, t: string, ref?: string): LeafItem => ({ id, type: 'leaf', title: t, status: 'todo', ref })
  return [
    {
      id: 'tr-rust', track: 'rust', name: 'Rust Language', locked: false,
      groups: [
        { id: 'g-book', title: 'The Book', open: true, items: [
          leaf('b1', 'Ch. 1–10 · foundations'), leaf('b2', 'Ch. 11–14 · testing + cargo'),
          leaf('b3', 'Ch. 15 · smart pointers'), leaf('b4', 'Ch. 16 · fearless concurrency'),
          leaf('b5', 'Ch. 19–20 · advanced + final project'),
        ] },
        { id: 'g-prac', title: 'Practice', open: true, items: [
          leaf('p1', 'Rustlings · 96 exercises'), leaf('p2', 'Exercism · 15 problems'), leaf('p3', 'Build a CLI tool (clap)'),
        ] },
        { id: 'g-async', title: 'Async & Macros', open: false, items: [
          leaf('a1', 'tokio runtime model'), leaf('a2', 'declarative macros'),
        ] },
      ],
    },
    {
      id: 'tr-c', track: 'c', name: 'C & Linux Kernel', locked: false,
      groups: [
        { id: 'g-c', title: 'C Refresher', open: true, items: [
          leaf('c1', 'Pointers & memory'), leaf('c2', 'Makefiles + gdb'), leaf('c3', 'Data structures in C'),
        ] },
        { id: 'g-kernel', title: 'Kernel Basics', open: true, items: [
          leaf('k1', 'Build & boot in QEMU'), leaf('k2', 'LKMP: first module'),
          leaf('k3', 'Char device driver'), leaf('k4', 'Subsystem deep-dive'),
        ] },
      ],
    },
    {
      id: 'tr-rfl', track: 'rfl', name: 'Rust for Linux', locked: false,
      groups: [
        { id: 'g-rfl', title: 'Getting Started', open: true, items: [
          leaf('r1', 'Set up RfL tree + toolchain'), leaf('r2', 'Read kernel Rust docs'),
          leaf('r3', 'First doc/cleanup patch'), leaf('r4', 'Send to mailing list'),
        ] },
      ],
    },
  ]
}

function seedReading(): AppState['reading'] {
  const r = (id: string, title: string, track: AppState['reading'][number]['track'], format: string, total: number): AppState['reading'][number] =>
    ({ id, title, url: '', track, format, status: 'todo', done: 0, total })
  return [
    r('rd0', 'The Rust Programming Language', 'rust', 'Book', 20),
    r('rd1', 'Rust for Rustaceans', 'rust', 'Book', 12),
    r('rd2', 'The Linux Kernel Module Programming Guide', 'c', 'Guide', 9),
    r('rd3', 'Rust for Linux — official docs', 'rfl', 'Docs', 6),
    r('rd4', 'Asynchronous Programming in Rust', 'rust', 'Book', 8),
  ]
}

function seedGoals(): AppState['goals'] {
  return [
    { id: 'go0', title: 'LFX Mentorship — Fall 2026 application', notes: 'Window opens. Pick a Rust/kernel project, draft proposal.', date: '2026-07-30', done: false },
    { id: 'go1', title: 'Internship applications open', notes: 'Resume + 3 merged PRs as proof-of-work.', date: '2026-09-01', done: false },
    { id: 'go2', title: 'GSoC 2027 — org list drops', notes: 'Shortlist orgs, reach out to mentors early.', date: '2027-03-16', done: false },
    { id: 'go3', title: 'Ship 1 merged PR to rust-lang/rust', notes: 'The big one. Pick a good-first-issue.', date: '2026-06-20', done: false },
  ]
}

// Real contributions for @imajij, fetched from the GitHub API. The live
// "Sync GitHub" button refreshes/extends these (deduped by these gh-<id> keys).
function seedContribs(): AppState['contribs'] {
  return [
    { id: 'gh-4569615178', date: '2026-06-02', project: 'imajij/scribble_clone', main: false, type: 'pr', status: 'merged', title: 'Revamp platform: glassmorphism redesign, bug fixes, 5 new games', url: 'https://github.com/imajij/scribble_clone/pull/1' },
    { id: 'gh-3833522189', date: '2026-01-20', project: 'imajij/Ecom-assignment-ajij', main: false, type: 'pr', status: 'submitted', title: 'Upgrade Java version from 17 to 21', url: 'https://github.com/imajij/Ecom-assignment-ajij/pull/1' },
    { id: 'gh-2585145911', date: '2024-10-14', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'Co-authored-by: Bibek Jyoti Charah <SammyUrfen@users.noreply.github.com>', url: 'https://github.com/pixelforgers/rasoi/pull/50' },
    { id: 'gh-2584078278', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'forgot update', url: 'https://github.com/pixelforgers/rasoi/pull/45' },
    { id: 'gh-2583963839', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'linked', url: 'https://github.com/pixelforgers/rasoi/pull/42' },
    { id: 'gh-2583963146', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'forgot password page', url: 'https://github.com/pixelforgers/rasoi/pull/40' },
    { id: 'gh-2583887082', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'upd3', url: 'https://github.com/pixelforgers/rasoi/pull/39' },
    { id: 'gh-2583886221', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'updates', url: 'https://github.com/pixelforgers/rasoi/pull/38' },
    { id: 'gh-2583847468', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'sign up form update', url: 'https://github.com/pixelforgers/rasoi/pull/37' },
    { id: 'gh-2583779602', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'rejected', title: 'Revert "Sign up page created and js added"', url: 'https://github.com/pixelforgers/rasoi/pull/32' },
    { id: 'gh-2583775824', date: '2024-10-13', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'rejected', title: 'Revert "firebase"', url: 'https://github.com/pixelforgers/rasoi/pull/31' },
    { id: 'gh-2577626673', date: '2024-10-10', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'firebase', url: 'https://github.com/pixelforgers/rasoi/pull/28' },
    { id: 'gh-2574698901', date: '2024-10-09', project: 'zenika-open-source/the-duck-gallery', main: false, type: 'pr', status: 'rejected', title: 'the duck', url: 'https://github.com/zenika-open-source/the-duck-gallery/pull/373' },
    { id: 'gh-2572103051', date: '2024-10-08', project: 'zero-to-mastery/Animation-Nation', main: false, type: 'pr', status: 'rejected', title: 'imajij-pendulum/', url: 'https://github.com/zero-to-mastery/Animation-Nation/pull/2697' },
    { id: 'gh-2570967248', date: '2024-10-07', project: 'pixelforgers/rasoi', main: false, type: 'pr', status: 'merged', title: 'update readme', url: 'https://github.com/pixelforgers/rasoi/pull/26' },
  ]
}

export function defaultQuests(): Quest[] {
  return [
    { id: 'q-study', icon: '⏱️', label: 'Log 30 min of study', xp: 30, kind: 'study', done: false },
    { id: 'q-practice', icon: '🧩', label: 'Solve a practice problem', xp: 35, kind: 'practice', done: false },
    { id: 'q-read', icon: '📖', label: 'Read a chapter', xp: 40, kind: 'read', done: false },
    { id: 'q-roadmap', icon: '✅', label: 'Tick off a roadmap item', xp: 50, kind: 'roadmap', done: false },
  ]
}

export function defaultState(): AppState {
  return {
    profile: { name: 'Ajij', username: 'imajij', mainProject: '', githubToken: '' },
    settings: {
      theme: 'light', accent: 'lime', font: 'fredoka', density: 'cozy', partialCredit: true,
      dates: { gsoc: '2027-03-16', lfx: '2026-07-30', internship: '2026-09-01' },
    },
    phase: 0,
    activity: {},
    study: [],
    contribs: seedContribs(),
    roadmap: seedRoadmap(),
    reading: seedReading(),
    goals: seedGoals(),
    quests: { date: todayISO(), items: defaultQuests(), claimed: [] },
    practice: {},
    notesRead: {},
    xpBonus: 0,
    seenLevel: null,
  }
}

/* ---------- quest helper ---------- */
export function questComplete(s: AppState, kind: QuestKind): boolean {
  let changed = false
  ;(s.quests.items || []).forEach((q) => { if (q.kind === kind && !q.done) { q.done = true; changed = true } })
  return changed
}

/* ---------- hook ---------- */
export type Updater = (fn: (s: AppState) => AppState) => void

export function useStore(): [AppState, Updater, React.Dispatch<React.SetStateAction<AppState>>] {
  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        if (!parsed.quests || parsed.quests.date !== todayISO()) {
          parsed.quests = { date: todayISO(), items: defaultQuests(), claimed: [] }
        }
        return { ...defaultState(), ...parsed }
      }
    } catch { /* ignore */ }
    return defaultState()
  })

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const update = useCallback<Updater>((fn) => {
    setState((prev) => ({ ...fn(structuredClone(prev)) }))
  }, [])

  return [state, update, setState]
}

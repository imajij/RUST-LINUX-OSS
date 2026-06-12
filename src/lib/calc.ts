// calc.ts — constants + derived calculators (XP, levels, streaks, leagues, progress).
// Pure functions over AppState; nothing is stored.

import type { AppState, Difficulty, LearnTrack, ProblemKind, TrackId, TrackNode } from '../types'
import { daysUntil, todayISO, daysAgo } from './date'

const DAY = 86_400_000

export const TRACKS: Record<TrackId, { id: TrackId; name: string; color: string; short: string }> = {
  rust: { id: 'rust', name: 'Rust', color: 'var(--track-rust)', short: 'RS' },
  c: { id: 'c', name: 'C / Linux', color: 'var(--track-c)', short: 'C' },
  rfl: { id: 'rfl', name: 'Rust for Linux', color: 'var(--track-rfl)', short: 'RfL' },
}

export const PHASES = ['Fundamentals', 'Workflow', 'First Contributions', 'Going Deep']
export const PHASE_BLURB = ['build the base', 'learn the workflow', 'land your first patches', 'go deep & mentor']

/* ---------- XP ---------- */
export const XP_PER_HOUR = 20
const XP_CHAPTER = 25
const XP_ROADMAP = 40
const XP_CONTRIB: Record<string, number> = { merged: 150, submitted: 60, changes: 40, rejected: 10, issue: 70 }

/* ---------- practice problems ---------- */
export const PROBLEM_XP: Record<ProblemKind, Record<Difficulty, number>> = {
  coding: { intro: 15, easy: 25, medium: 40, hard: 60 },
  thinking: { intro: 12, easy: 20, medium: 35, hard: 55 },
}
export function problemXP(kind: ProblemKind, difficulty: Difficulty): number {
  return PROBLEM_XP[kind][difficulty]
}

// minutes credited to the activity heatmap/streak when a problem is solved
export const PRACTICE_MINUTES: Record<ProblemKind, number> = { coding: 12, thinking: 7 }

// XP + activity for marking a chapter's study notes as read
export const NOTE_XP = 25
export const NOTE_MINUTES = 12

export function totalXP(s: AppState): number {
  let xp = 0
  s.study.forEach((e) => { xp += e.hours * XP_PER_HOUR })
  s.contribs.forEach((c) => { xp += XP_CONTRIB[c.status] || (c.type === 'issue' ? XP_CONTRIB.issue : 40) })
  s.reading.forEach((r) => { xp += r.done * XP_CHAPTER })
  s.roadmap.forEach((t) => t.groups.forEach((g) => g.items.forEach((it) => { if (it.status === 'done') xp += XP_ROADMAP })))
  Object.values(s.practice || {}).forEach((p) => { if (p.status === 'solved') xp += p.xp || 0 })
  xp += Object.keys(s.notesRead || {}).length * NOTE_XP
  return Math.round(xp + (s.xpBonus || 0))
}

/* ---------- practice progress (derived from the sparse progress map) ---------- */
// ids look like 'rs-ch04-c-012' (rust coding) / 'lx-ch08-t-005' (linux thinking)
// / 'ds-ch07-c-012' (DSA coding).
export function solvedCount(s: AppState, filter: { track?: LearnTrack; kind?: ProblemKind; chapter?: number } = {}): number {
  const { track, kind, chapter } = filter
  const mark = kind === 'coding' ? '-c-' : kind === 'thinking' ? '-t-' : null
  const tp = track === 'linux' ? 'lx-' : track === 'rust' ? 'rs-' : track === 'dsa' ? 'ds-' : null
  const NN = chapter != null ? (chapter < 10 ? '0' + chapter : '' + chapter) : null
  const startPrefix = tp && NN ? `${tp}ch${NN}-` : tp
  const chSub = !tp && NN ? `ch${NN}-` : null
  let n = 0
  for (const id in s.practice) {
    if (s.practice[id].status !== 'solved') continue
    if (mark && !id.includes(mark)) continue
    if (startPrefix && !id.startsWith(startPrefix)) continue
    if (chSub && !id.includes(chSub)) continue
    n++
  }
  return n
}
export function totalSolved(s: AppState): number {
  return solvedCount(s)
}
export function notesReadCount(s: AppState): number {
  return Object.keys(s.notesRead || {}).length
}

// cumulative xp needed to reach level L (L>=1)
const xpToReach = (L: number) => 60 * (L - 1) * (L - 1)

export interface LevelInfo { xp: number; level: number; into: number; span: number; pct: number; toNext: number }
export function levelInfo(s: AppState): LevelInfo {
  const xp = totalXP(s)
  let L = 1
  while (xpToReach(L + 1) <= xp) L++
  const base = xpToReach(L), next = xpToReach(L + 1)
  return { xp, level: L, into: xp - base, span: next - base, pct: (xp - base) / (next - base), toNext: next - xp }
}

/* ---------- streaks / activity ---------- */
const activityMinutes = (s: AppState, isoStr: string): number => s.activity[isoStr] || 0

export function streak(s: AppState): number {
  let n = 0
  let i = activityMinutes(s, todayISO()) > 0 ? 0 : 1
  for (; ; i++) {
    if (activityMinutes(s, daysAgo(i)) > 0) n++
    else break
    if (i > 400) break
  }
  return n
}

export function longestStreak(s: AppState): number {
  const dates = Object.keys(s.activity).filter((d) => s.activity[d] > 0).sort()
  let best = 0, cur = 0, prev: string | null = null
  dates.forEach((d) => {
    if (prev && new Date(d).getTime() - new Date(prev).getTime() === DAY) cur++
    else cur = 1
    best = Math.max(best, cur)
    prev = d
  })
  return best
}

export function activeDays(s: AppState, withinDays?: number): number {
  return Object.keys(s.activity).filter((d) => s.activity[d] > 0 && (!withinDays || daysUntil(d) > -withinDays)).length
}

export function hoursThisWeek(s: AppState): number {
  let mins = 0
  for (let i = 0; i < 7; i++) mins += activityMinutes(s, daysAgo(i))
  return mins / 60
}

export function weeklyXP(s: AppState): number {
  let xp = hoursThisWeek(s) * XP_PER_HOUR
  s.contribs.forEach((c) => { if (daysUntil(c.date) > -7) xp += XP_CONTRIB[c.status] || 40 })
  xp += (s.quests.items || []).filter((q) => q.done).reduce((a, q) => a + q.xp, 0)
  Object.values(s.practice || {}).forEach((p) => { if (p.status === 'solved' && p.solvedDate && daysUntil(p.solvedDate) > -7) xp += p.xp || 0 })
  Object.values(s.notesRead || {}).forEach((date) => { if (date && daysUntil(date) > -7) xp += NOTE_XP })
  return Math.round(xp)
}

/* ---------- leagues ---------- */
export interface League { id: string; name: string; color: string; min: number }
export const LEAGUES: League[] = [
  { id: 'bronze', name: 'Bronze', color: '#b97a3a', min: 0 },
  { id: 'silver', name: 'Silver', color: '#9aa3b0', min: 150 },
  { id: 'gold', name: 'Gold', color: '#e0a020', min: 350 },
  { id: 'sapphire', name: 'Sapphire', color: 'var(--track-c)', min: 600 },
  { id: 'ruby', name: 'Ruby', color: '#e5533d', min: 900 },
  { id: 'diamond', name: 'Diamond', color: 'var(--track-rfl)', min: 1300 },
]
export function leagueFor(xp: number): League {
  let lg = LEAGUES[0]
  for (const l of LEAGUES) if (xp >= l.min) lg = l
  return lg
}

export interface LeaderRow { name: string; xp: number; me?: boolean; rank: number }
export function leaderboard(s: AppState): LeaderRow[] {
  const my = weeklyXP(s)
  const bots = [
    { name: 'kernelcat', xp: my + 180 }, { name: 'ferris_fan', xp: my + 70 },
    { name: 'oxide_owl', xp: Math.max(20, my - 40) }, { name: 'segfault_sam', xp: Math.max(10, my - 130) },
    { name: 'borrowck_bea', xp: Math.max(5, my - 210) },
  ]
  const rows = [...bots, { name: s.profile.username, xp: my, me: true }].sort((a, b) => b.xp - a.xp)
  return rows.map((r, i) => ({ ...r, rank: i + 1 }))
}

/* ---------- roadmap progress ---------- */
export function trackProgress(t: TrackNode): { done: number; total: number; pct: number } {
  let done = 0, total = 0
  t.groups.forEach((g) => g.items.forEach((it) => { total++; if (it.status === 'done') done++ }))
  return { done, total, pct: total ? done / total : 0 }
}

export function overallProgress(s: AppState): { done: number; total: number; pct: number } {
  let done = 0, total = 0
  s.roadmap.forEach((t) => { const p = trackProgress(t); done += p.done; total += p.total })
  return { done, total, pct: total ? done / total : 0 }
}

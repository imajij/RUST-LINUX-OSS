// problemsLoader.ts — lazily loads a chapter's bundled problems on demand.
// The 2000 problems live in per-chapter TS modules (problems/chNN-c1.ts,
// chNN-c2.ts, chNN-t.ts). Vite code-splits each via import.meta.glob, so the
// content for a chapter is only fetched the first time it's opened.

import type { Problem } from '../types'

type Mod = { default: Problem[] }
const modules = import.meta.glob('./problems/ch*.ts') as Record<string, () => Promise<Mod>>

const cache = new Map<number, Problem[]>()

const pad2 = (n: number): string => (n < 10 ? '0' + n : '' + n)

/** Load (and cache) every problem for a chapter, sorted by id. */
export async function loadChapter(n: number): Promise<Problem[]> {
  const hit = cache.get(n)
  if (hit) return hit
  const key = `/ch${pad2(n)}-`
  const paths = Object.keys(modules).filter((p) => p.includes(key))
  const mods = await Promise.all(paths.map((p) => modules[p]()))
  const all = mods
    .flatMap((m) => (Array.isArray(m.default) ? m.default : []))
    .sort((a, b) => a.id.localeCompare(b.id))
  cache.set(n, all)
  return all
}

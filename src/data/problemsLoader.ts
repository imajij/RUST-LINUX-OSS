// problemsLoader.ts — lazily loads a chapter's bundled problems on demand.
// Rust problems live in problems/chNN-{c1,c2,t}.ts; Linux problems in
// problems/lxNN-{c1,c2,t}.ts. Vite code-splits each file via import.meta.glob,
// so a chapter's content is only fetched the first time it's opened.

import type { LearnTrack, Problem } from '../types'

type Mod = { default: Problem[] }
const modules = import.meta.glob('./problems/*.ts') as Record<string, () => Promise<Mod>>

const cache = new Map<string, Problem[]>()
const pad2 = (n: number): string => (n < 10 ? '0' + n : '' + n)
const prefix = (track: LearnTrack): string => (track === 'linux' ? 'lx' : 'ch')

/** Load (and cache) every problem for a track's chapter, sorted by id. */
export async function loadChapter(track: LearnTrack, n: number): Promise<Problem[]> {
  const ck = `${track}:${n}`
  const hit = cache.get(ck)
  if (hit) return hit
  const key = `/${prefix(track)}${pad2(n)}-`
  const paths = Object.keys(modules).filter((p) => p.includes(key))
  const mods = await Promise.all(paths.map((p) => modules[p]()))
  const all = mods
    .flatMap((m) => (Array.isArray(m.default) ? m.default : []))
    .sort((a, b) => a.id.localeCompare(b.id))
  cache.set(ck, all)
  return all
}

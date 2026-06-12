// notesLoader.ts — lazily loads a chapter's study notes on demand.
// Notes live in notes/rs-chNN.ts (Rust) and notes/lx-chNN.ts (Linux), each a
// default-exported ChapterNote. Vite code-splits each so a note is only fetched
// when its chapter is opened in Notes mode.

import type { ChapterNote, LearnTrack } from '../types'

type Mod = { default: ChapterNote }
const modules = import.meta.glob('./notes/*.ts') as Record<string, () => Promise<Mod>>

const cache = new Map<string, ChapterNote | null>()
const pad2 = (n: number): string => (n < 10 ? '0' + n : '' + n)

/** Load (and cache) the note for a track's chapter, or null if none exists. */
export async function loadNote(track: LearnTrack, n: number): Promise<ChapterNote | null> {
  const ck = `${track}:${n}`
  if (cache.has(ck)) return cache.get(ck)!
  // DSA has no study notes yet -> 'ds-chNN.ts' won't exist -> resolves to null.
  const file = `/${track === 'linux' ? 'lx' : track === 'dsa' ? 'ds' : 'rs'}-ch${pad2(n)}.ts`
  const path = Object.keys(modules).find((p) => p.endsWith(file))
  const note = path ? (await modules[path]()).default : null
  cache.set(ck, note)
  return note
}

// registry.ts — auto-collects every scene under ./scenes/*.ts by its `id`, so a
// new animation is added simply by dropping a file in that folder (no central
// edit). Eager glob is fine: scene files are tiny pure-data modules, and this
// whole module is only pulled in lazily by AnimationPlayer.

import type { Scene } from './types'

const mods = import.meta.glob('./scenes/*.ts', { eager: true }) as Record<string, { default?: Scene }>

const REGISTRY: Record<string, Scene> = {}
for (const m of Object.values(mods)) {
  const s = m.default
  if (s && s.id) REGISTRY[s.id] = s
}

export const getScene = (id: string): Scene | undefined => REGISTRY[id]
export const allScenes = (): Scene[] => Object.values(REGISTRY)

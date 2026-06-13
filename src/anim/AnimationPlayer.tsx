// AnimationPlayer.tsx — embeds a scene as an interactive Remotion player inline
// in a note. Looked up by `id` from the registry; picks the right template; the
// whole module (and Remotion itself) is lazy-loaded by Learn.tsx, so it only
// ships to the browser when a learner actually opens an animated note.

import { useMemo } from 'react'
import type { ComponentType } from 'react'
import { Player } from '@remotion/player'
import { getScene } from './registry'
import { TEMPLATES } from './templates'
import { COLORS } from './theme'

export default function AnimationPlayer({ id }: { id: string }) {
  const scene = useMemo(() => getScene(id), [id])
  if (!scene) {
    return (
      <div style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 12.5 }}>
        Animation “{id}” not found.
      </div>
    )
  }

  const Comp = TEMPLATES[scene.template] as ComponentType<Record<string, unknown>>
  const fps = scene.fps ?? 30
  const stepFrames = scene.stepFrames ?? 42
  const stepCount = Math.max(1, (scene.data as { steps: unknown[] }).steps.length)
  const durationInFrames = Math.max(1, stepCount * stepFrames)
  const width = scene.width ?? 720
  const height = scene.height ?? 430

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid var(--line)`, background: COLORS.bg, boxShadow: '0 10px 30px -18px rgba(0,0,0,0.6)' }}>
        <Player
          component={Comp}
          inputProps={{ data: scene.data, stepFrames, title: scene.title }}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={width}
          compositionHeight={height}
          style={{ width: '100%' }}
          controls
          loop
          autoPlay
          clickToPlay
          doubleClickToFullscreen
          renderLoading={() => (
            <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: COLORS.muted, fontSize: 13 }}>Loading animation…</div>
          )}
        />
      </div>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>▶ Animation</span>
        <span>{scene.title} — press play, drag the bar to scrub, or loop it.</span>
      </figcaption>
    </figure>
  )
}

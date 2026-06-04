import type { MouseEvent } from 'react'
import type { AppState, QuestKind, ReadingItem } from '../types'
import type { Updater } from '../lib/store'
import { TRACKS } from '../lib/calc'
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui'
import { Icon } from '../components/Icon'
import { RowActions, chip, stepBtn } from '../components/shared'

const READING_META: Record<string, { label: string; color: string }> = {
  todo: { label: 'To read', color: 'var(--muted)' },
  reading: { label: 'Reading', color: 'var(--info)' },
  done: { label: 'Finished', color: 'var(--success)' },
}
const CYCLE: Record<string, ReadingItem['status']> = { todo: 'reading', reading: 'done', done: 'todo' }

export function Reading({ state, update, openReadingModal, award }: {
  state: AppState; update: Updater; openReadingModal: (r: ReadingItem | null) => void; award: (kind: QuestKind, e?: MouseEvent) => void
}) {
  const cycleStatus = (id: string) => update((s) => { const r = s.reading.find((x) => x.id === id)!; r.status = CYCLE[r.status]; return s })
  const bump = (id: string, delta: number, e: MouseEvent) => {
    update((s) => {
      const r = s.reading.find((x) => x.id === id)!
      r.done = Math.max(0, Math.min(r.total, r.done + delta))
      if (r.done === r.total) r.status = 'done'
      else if (r.done > 0 && r.status === 'todo') r.status = 'reading'
      return s
    })
    if (delta > 0) award('read', e)
  }
  const del = (id: string) => update((s) => { s.reading = s.reading.filter((x) => x.id !== id); return s })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="reading" title="Reading List" subtitle="Books, docs & guides on the path" accent="var(--info)"
        action={<Button icon="plus" onClick={() => openReadingModal(null)}>Add</Button>} />
      {state.reading.length === 0
        ? <Card><EmptyState icon="reading" title="Nothing on the shelf" body="Add the books, docs, and guides you're working through. Track chapters and earn XP for each one." action={<Button icon="plus" onClick={() => openReadingModal(null)}>Add a book</Button>} /></Card>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {state.reading.map((r) => {
            const sm = READING_META[r.status]
            return (
              <Card key={r.id} hover className="row-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge color={TRACKS[r.track].color} dot>{TRACKS[r.track].name}</Badge>
                    <Badge color="var(--faint)">{r.format}</Badge>
                  </div>
                  <RowActions onEdit={() => openReadingModal(r)} onDelete={() => del(r.id)} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text)', lineHeight: 1.25, marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  {r.title} <Icon name="link" size={13} style={{ color: 'var(--faint)', marginTop: 4, flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                  <ProgressBar value={r.total ? r.done / r.total : 0} color={TRACKS[r.track].color} height={8} />
                  <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{r.done}/{r.total}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => cycleStatus(r.id)} style={{ ...chip(false), color: sm.color, borderColor: `color-mix(in srgb, ${sm.color} 35%, transparent)` }}>{sm.label}</button>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button onClick={(e) => bump(r.id, -1, e)} style={stepBtn}>−</button>
                    <button onClick={(e) => bump(r.id, 1, e)} style={{ ...stepBtn, background: 'var(--accent)', color: 'var(--on-accent)', borderColor: 'transparent' }}>+</button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>}
    </div>
  )
}

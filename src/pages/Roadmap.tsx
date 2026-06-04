import { useState } from 'react'
import type { MouseEvent } from 'react'
import type { AppState } from '../types'
import type { Updater } from '../lib/store'
import { TRACKS, trackProgress } from '../lib/calc'
import { Card, Input, PageHeader, ProgressBar, Switch, Button } from '../components/ui'
import { Icon } from '../components/Icon'
import { RowActions, checkBtn, linkBtn2 } from '../components/shared'

export function Roadmap({ state, update, toggleLeaf }: {
  state: AppState; update: Updater; toggleLeaf: (trackId: string, groupId: string, leafId: string, e: MouseEvent) => void
}) {
  const [hideDone, setHideDone] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const [text, setText] = useState('')

  const addItem = (trackId: string, groupId: string) => {
    if (!text.trim()) return
    update((s) => {
      const g = s.roadmap.find((x) => x.id === trackId)!.groups.find((x) => x.id === groupId)!
      g.items.push({ id: 'l' + Date.now(), type: 'leaf', title: text.trim(), status: 'todo' })
      return s
    })
    setText(''); setAdding(null)
  }
  const delItem = (trackId: string, groupId: string, leafId: string) => update((s) => {
    const g = s.roadmap.find((x) => x.id === trackId)!.groups.find((x) => x.id === groupId)!
    g.items = g.items.filter((i) => i.id !== leafId)
    return s
  })
  const toggleGroup = (trackId: string, groupId: string) => update((s) => {
    const g = s.roadmap.find((x) => x.id === trackId)!.groups.find((x) => x.id === groupId)!
    g.open = !g.open
    return s
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="roadmap" title="Roadmap" subtitle="Your path from fundamentals to upstream contributor"
        action={<Switch checked={hideDone} onChange={setHideDone} label="Hide done" />} />
      {state.roadmap.map((t) => {
        const p = trackProgress(t)
        const tc = TRACKS[t.track]
        return (
          <Card key={t.id} pad={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13, borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 999, background: tc.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{p.done} of {p.total} done</div>
              </div>
              <div style={{ width: 130, display: 'flex', alignItems: 'center', gap: 9 }}>
                <ProgressBar value={p.pct} color={tc.color} height={9} />
                <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: tc.color, width: 34, textAlign: 'right' }}>{Math.round(p.pct * 100)}%</span>
              </div>
            </div>
            <div style={{ padding: '8px 18px 16px' }}>
              {t.groups.map((g) => {
                const items = hideDone ? g.items.filter((i) => i.status !== 'done') : g.items
                if (hideDone && items.length === 0) return null
                return (
                  <div key={g.id} style={{ marginTop: 8 }}>
                    <button onClick={() => toggleGroup(t.id, g.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', width: '100%' }}>
                      <Icon name={g.open ? 'chevdown' : 'chevright'} size={15} style={{ color: 'var(--faint)' }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{g.title}</span>
                      <span className="tabular" style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{g.items.filter((i) => i.status === 'done').length}/{g.items.length}</span>
                    </button>
                    {g.open && items.map((it) => (
                      <div key={it.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0 7px 22px' }}>
                        <button onClick={(e) => toggleLeaf(t.id, g.id, it.id, e)} style={checkBtn(it.status === 'done', tc.color)}>
                          {it.status === 'done' && <Icon name="check" size={13} stroke={3} />}
                        </button>
                        <span style={{ flex: 1, fontSize: 14, color: it.status === 'done' ? 'var(--faint)' : 'var(--text)', textDecoration: it.status === 'done' ? 'line-through' : 'none', fontWeight: 500 }}>{it.title}</span>
                        <RowActions onDelete={() => delItem(t.id, g.id, it.id)} />
                      </div>
                    ))}
                    {g.open && adding === t.id + g.id && (
                      <div style={{ display: 'flex', gap: 8, padding: '6px 0 6px 22px' }}>
                        <Input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="New item…" onKeyDown={(e) => e.key === 'Enter' && addItem(t.id, g.id)} style={{ flex: 1 }} />
                        <Button size="sm" onClick={() => addItem(t.id, g.id)}>Add</Button>
                      </div>
                    )}
                    {g.open && adding !== t.id + g.id && (
                      <button onClick={() => { setAdding(t.id + g.id); setText('') }} style={{ ...linkBtn2, marginLeft: 22, marginTop: 2 }}>+ Add an item</button>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

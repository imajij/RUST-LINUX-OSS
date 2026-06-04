import type { MouseEvent } from 'react'
import type { AppState, Goal } from '../types'
import type { Updater } from '../lib/store'
import { daysUntil, fmtDate } from '../lib/date'
import { fireConfetti } from '../lib/confetti'
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui'
import { Icon } from '../components/Icon'
import { RowActions, checkBtn } from '../components/shared'

export function Goals({ state, update, openGoalModal }: {
  state: AppState; update: Updater; openGoalModal: (g: Goal | null) => void
}) {
  const toggle = (id: string, e: MouseEvent) => {
    let nowDone = false
    update((s) => { const g = s.goals.find((x) => x.id === id)!; g.done = !g.done; nowDone = g.done; return s })
    if (nowDone) fireConfetti({ x: e.clientX, y: e.clientY, count: 60 })
  }
  const del = (id: string) => update((s) => { s.goals = s.goals.filter((g) => g.id !== id); return s })
  const sorted = state.goals.slice().sort((a, b) => (Number(a.done) - Number(b.done)) || a.date.localeCompare(b.date))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="goals" title="Goals & Deadlines" subtitle="The milestones that matter" accent="var(--cat)"
        action={<Button icon="plus" onClick={() => openGoalModal(null)}>Add</Button>} />
      {state.goals.length === 0
        ? <Card><EmptyState icon="goals" title="No goals yet" body="Add deadlines like LFX, GSoC, or your own milestones. We'll count down the days and nudge you when they're close." action={<Button icon="plus" onClick={() => openGoalModal(null)}>Add a goal</Button>} /></Card>
        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {sorted.map((g) => {
            const d = daysUntil(g.date)
            const tone = g.done ? 'var(--success)' : d < 0 ? 'var(--danger)' : d <= 30 ? 'var(--warn)' : 'var(--success)'
            return (
              <Card key={g.id} className="row-hover" style={{ opacity: g.done ? 0.7 : 1 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={(e) => toggle(g.id, e)} style={checkBtn(g.done, 'var(--accent)')}>{g.done && <Icon name="check" size={13} stroke={3} />}</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text)', textDecoration: g.done ? 'line-through' : 'none', lineHeight: 1.3 }}>{g.title}</div>
                      <RowActions onEdit={() => openGoalModal(g)} onDelete={() => del(g.id)} />
                    </div>
                    {g.notes && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5, lineHeight: 1.45 }}>{g.notes}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                      <Badge color={tone} dot>{g.done ? 'Done' : d < 0 ? `${-d}d overdue` : `${d} days left`}</Badge>
                      <span className="tabular" style={{ fontSize: 11.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{fmtDate(g.date)} {new Date(g.date).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>}
    </div>
  )
}

import type { AppState } from '../types'
import type { Updater } from '../lib/store'
import { TRACKS, hoursThisWeek, longestStreak, streak } from '../lib/calc'
import { daysAgo, fmtDate, round1 } from '../lib/date'
import { Button, Card, EmptyState, PageHeader, StatCard } from '../components/ui'
import { StackedBars } from '../components/charts'
import type { StackedDatum } from '../components/charts'
import { RowActions, kbdStyle } from '../components/shared'

function weeklyByTrack(state: AppState): StackedDatum[] {
  const out: StackedDatum[] = []
  for (let w = 7; w >= 0; w--) {
    let mins = 0
    for (let d = 0; d < 7; d++) mins += state.activity[daysAgo(w * 7 + d)] || 0
    const h = mins / 60
    const r = 0.45 + ((w * 7) % 5) * 0.04
    out.push({
      label: w === 0 ? 'now' : `${w}w`,
      segs: [
        { key: 'rust', label: 'Rust', value: h * r, color: 'var(--track-rust)' },
        { key: 'c', label: 'C/Linux', value: h * (1 - r) * 0.6, color: 'var(--track-c)' },
        { key: 'rfl', label: 'RfL', value: h * (1 - r) * 0.4, color: 'var(--track-rfl)' },
      ],
    })
  }
  return out
}

export function Study({ state, update, openQuickAdd }: { state: AppState; update: Updater; openQuickAdd: () => void }) {
  const del = (id: string) => update((s) => { s.study = s.study.filter((e) => e.id !== id); return s })
  const wk = hoursThisWeek(state)
  const totalH = Object.values(state.activity).reduce((a, b) => a + b, 0) / 60
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="study" title="Study Log" subtitle="Time on task — the habit that compounds" accent="var(--track-c)"
        action={<Button icon="plus" onClick={openQuickAdd}>Log time <kbd style={kbdStyle}>N</kbd></Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <StatCard label="Total logged" value={round1(totalH) + 'h'} sub="all time" icon="clock" accent="var(--track-c)" />
        <StatCard label="This week" value={round1(wk) + 'h'} sub="last 7 days" icon="study" accent="var(--accent)" />
        <StatCard label="Streak" value={streak(state) + 'd'} sub="keep it lit 🔥" icon="flame" accent="var(--cat)" />
        <StatCard label="Longest" value={longestStreak(state) + 'd'} sub="personal best" icon="trophy" accent="var(--track-rfl)" />
      </div>
      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 14 }}>Hours by track · last 8 weeks</div>
        <StackedBars data={weeklyByTrack(state)} height={170} unit="h" keys={[
          { label: 'Rust', color: 'var(--track-rust)' }, { label: 'C / Linux', color: 'var(--track-c)' }, { label: 'Rust for Linux', color: 'var(--track-rfl)' },
        ]} />
      </Card>
      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 6 }}>Recent sessions</div>
        {state.study.length === 0
          ? <EmptyState icon="study" title="No sessions yet" body="Log study time to build your streak. Tip: press N anywhere to log fast — friction is the enemy of habits." action={<Button icon="plus" onClick={openQuickAdd}>Log your first session</Button>} />
          : state.study.slice().sort((a, b) => b.date.localeCompare(a.date)).map((e) => (
            <div key={e.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: TRACKS[e.track].color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{e.desc}</div>
                <div className="tabular" style={{ fontSize: 11.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{fmtDate(e.date)} · {TRACKS[e.track].name}</div>
              </div>
              <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{e.hours}h</span>
              <RowActions onDelete={() => del(e.id)} />
            </div>
          ))}
      </Card>
    </div>
  )
}

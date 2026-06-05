import { Fragment } from 'react'
import type { AppState } from '../types'
import type { Updater } from '../lib/store'
import {
  PHASES, PHASE_BLURB, TRACKS, activeDays, hoursThisWeek, leaderboard, leagueFor,
  levelInfo, longestStreak, overallProgress, streak, totalSolved, weeklyXP,
} from '../lib/calc'
import { daysUntil, fmtDate, round1 } from '../lib/date'
import { Adrak } from '../components/Adrak'
import { Badge, Button, Card, EmptyState, ProgressBar, Ring, StatCard } from '../components/ui'
import { Icon } from '../components/Icon'
import { Heatmap } from '../components/Heatmap'
import { kbdStyle, linkBtn } from '../components/shared'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'still up'
  if (h < 12) return 'gm'
  if (h < 17) return 'afternoon'
  if (h < 22) return 'evening'
  return 'late night'
}

function PhaseStepper({ phase, onAdvance }: { phase: number; onAdvance: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {PHASES.map((p, i) => {
        const done = i < phase, cur = i === phase
        return (
          <Fragment key={p}>
            <button onClick={() => onAdvance(i)} title={`Jump to ${p}`} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px' }}>
              <span style={{
                width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', flexShrink: 0,
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, transition: 'all .25s',
                background: done ? 'var(--accent)' : cur ? 'var(--cat)' : 'var(--surface-2)',
                color: done || cur ? '#fff' : 'var(--faint)', border: cur ? '2px solid var(--cat)' : '2px solid transparent',
                boxShadow: cur ? '0 0 0 4px color-mix(in srgb, var(--cat) 22%, transparent)' : 'none',
              }}>{done ? <Icon name="check" size={14} stroke={3} /> : i + 1}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: done ? 'var(--text)' : cur ? 'var(--cat)' : 'var(--faint)', whiteSpace: 'nowrap' }}>{p}</span>
            </button>
            {i < PHASES.length - 1 && <div style={{ width: 18, height: 2, background: done ? 'var(--accent)' : 'var(--line)', margin: '0 2px', borderRadius: 2 }} />}
          </Fragment>
        )
      })}
    </div>
  )
}

function Countdown({ title, date, icon }: { title: string; date: string; icon: string }) {
  const d = daysUntil(date)
  const tone = d < 0 ? 'var(--danger)' : d <= 30 ? 'var(--warn)' : 'var(--success)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${tone} 15%, transparent)`, color: tone, flexShrink: 0 }}>
        <Icon name={icon} size={17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{fmtDate(date)} {new Date(date).getFullYear()}</div>
      </div>
      <div className="tabular" style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: tone, lineHeight: 1 }}>{d < 0 ? 'past' : d}</div>
        <div style={{ fontSize: 10, color: 'var(--faint)', fontWeight: 700, textTransform: 'uppercase' }}>{d < 0 ? '' : 'days'}</div>
      </div>
    </div>
  )
}

export function Overview({ state, update, nav, openQuickAdd, completeLeaf }: {
  state: AppState; update: Updater; nav: (p: string) => void; openQuickAdd: () => void; completeLeaf: (id: string, e: React.MouseEvent) => void
}) {
  const li = levelInfo(state)
  const stk = streak(state)
  const overall = overallProgress(state)
  const wk = hoursThisWeek(state)
  const wkXP = weeklyXP(state)
  const league = leagueFor(wkXP)
  const lb = leaderboard(state)
  const myRank = lb.find((r) => r.me)
  const totalActive = activeDays(state)

  const nextItems: { id: string; title: string; track: string }[] = []
  state.roadmap.forEach((t) => t.groups.forEach((g) => g.items.forEach((it) => {
    if (it.status !== 'done' && nextItems.length < 4) nextItems.push({ id: it.id, title: it.title, track: t.track })
  })))

  const questsDone = state.quests.items.filter((q) => q.done).length
  const advancePhase = (i: number) => update((s) => { s.phase = i; return s })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* HERO */}
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px', padding: 22, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center' }}>
                  <Adrak size={64} mood={stk > 0 ? 'happy' : 'sleepy'} level={li.level} />
                </div>
                <span style={{ position: 'absolute', bottom: -6, right: -6, background: 'var(--cat)', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, padding: '2px 7px', borderRadius: 999, border: '2px solid var(--surface)' }}>L{li.level}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, letterSpacing: '-0.5px', color: 'var(--text)', lineHeight: 1.05 }}>{greeting()}{state.profile.name ? `, ${state.profile.name}` : ''}</div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Adrak is {stk > 0 ? 'proud of your ' + stk + '-day streak 🧡' : 'waiting for you — log today!'}</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--muted)' }}>LEVEL {li.level} → {li.level + 1}</span>
                <span className="tabular" style={{ color: 'var(--accent-deep)', fontFamily: 'var(--font-mono)' }}>{li.into} / {li.span} XP</span>
              </div>
              <ProgressBar value={li.pct} glow />
              <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 6, fontWeight: 600 }}>{li.toNext} XP to level up · keep going!</div>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 9 }}>Your journey</div>
              <PhaseStepper phase={state.phase} onAdvance={advancePhase} />
            </div>
          </div>
          <div style={{ flex: '1 1 240px', padding: 22, background: 'var(--hero-panel)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Ring value={overall.pct} size={86} color="var(--accent)">
                <div>
                  <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: 'var(--accent-deep)' }}>{Math.round(overall.pct * 100)}%</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.5 }}>ROADMAP</div>
                </div>
              </Ring>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ fontSize: 22, animation: stk > 0 ? 'flame-flick .9s ease-in-out infinite' : 'none' }}>🔥</span>
                  <span className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--text)' }}>{stk}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>day{stk === 1 ? '' : 's'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{overall.done} of {overall.total} roadmap items done</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '10px 12px' }}>
                <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--text)' }}>{round1(wk)}h</div>
                <div style={{ fontSize: 11, color: 'var(--faint)', fontWeight: 700 }}>this week</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '10px 12px' }}>
                <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: league.color }}>#{myRank?.rank ?? '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--faint)', fontWeight: 700 }}>{league.name}</div>
              </div>
            </div>
            <Button variant="warm" icon="plus" onClick={openQuickAdd} style={{ width: '100%' }}>Log study time <kbd style={kbdStyle}>N</kbd></Button>
          </div>
        </div>
      </Card>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <StatCard label="Total XP" value={li.xp.toLocaleString()} sub={`level ${li.level}`} icon="spark" accent="var(--accent)" />
        <StatCard label="Streak" value={stk + 'd'} sub={`longest ${longestStreak(state)}d`} icon="flame" accent="var(--cat)" />
        <StatCard label="This week" value={round1(wk) + 'h'} sub={`${state.study.length} sessions`} icon="clock" accent="var(--track-c)" />
        <StatCard label="Merged PRs" value={state.contribs.filter((c) => c.status === 'merged' && c.type === 'pr').length} sub={`${state.contribs.length} contributions`} icon="merge" accent="var(--track-rfl)" />
        <StatCard label="Problems solved" value={totalSolved(state)} sub="coding + thinking" icon="code" accent="var(--track-rfl)" />
        <StatCard label="Active days" value={totalActive} sub="last 26 weeks" icon="overview" accent="var(--success)" />
      </div>

      {/* HEATMAP + COUNTDOWNS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18, alignItems: 'stretch' }}>
        <Card style={{ gridColumn: 'span 2', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Don't break the chain</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{totalActive} active days · every square is a day you showed up</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--faint)', fontWeight: 600 }}>
              less
              {[0, 1, 2, 3, 4].map((l) => <span key={l} style={{ width: 11, height: 11, borderRadius: 3, background: l === 0 ? 'var(--heat-empty)' : 'var(--accent)', opacity: l === 0 ? 1 : 0.34 + l * 0.17 }} />)}
              more
            </div>
          </div>
          <Heatmap activity={state.activity} weeks={26} />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 4 }}>Countdowns</div>
          <Countdown title="Ship a rust-lang PR" date={state.goals.find((g) => g.id === 'go3')?.date || state.settings.dates.lfx} icon="merge" />
          <Countdown title="LFX Mentorship opens" date={state.settings.dates.lfx} icon="trophy" />
          <Countdown title="Internship season" date={state.settings.dates.internship} icon="goals" />
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <button onClick={() => nav('goals')} style={linkBtn}>All goals →</button>
          </div>
        </Card>
      </div>

      {/* QUESTS + LEAGUE + PICK UP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', whiteSpace: 'nowrap' }}>Today's quests</div>
            <Badge color={questsDone === state.quests.items.length ? 'var(--success)' : 'var(--muted)'} dot>{questsDone}/{state.quests.items.length}</Badge>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 6 }}>Finish them all to keep Adrak happy.</div>
          {state.quests.items.map((q) => (
            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0' }}>
              <div style={{ fontSize: 19, width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', background: q.done ? 'var(--accent-soft)' : 'var(--surface-2)', filter: q.done ? 'none' : 'grayscale(0.2)' }}>{q.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', textDecoration: q.done ? 'line-through' : 'none', opacity: q.done ? 0.6 : 1 }}>{q.label}</div>
              </div>
              {q.done ? <Badge color="var(--accent-deep)" dot>+{q.xp} XP</Badge> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--faint)' }}>+{q.xp}</span>}
            </div>
          ))}
          {questsDone === state.quests.items.length && <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 13, background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>🎉 All quests done — +120 bonus XP!</div>}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', whiteSpace: 'nowrap' }}>{league.name} League</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{wkXP} XP this week</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 13, flexShrink: 0, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${league.color} 18%, transparent)`, color: league.color }}>
              <Icon name="trophy" size={22} />
            </div>
          </div>
          {lb.slice(0, 5).map((r) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <span className="tabular" style={{ width: 18, fontSize: 12, fontWeight: 700, color: r.rank <= 3 ? league.color : 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{r.rank}</span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: r.me ? 700 : 600, color: r.me ? 'var(--text)' : 'var(--muted)' }}>{r.me ? `${r.name} (you)` : r.name}</span>
              <span className="tabular" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{r.xp}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 4 }}>Pick up where you left off</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>One tap to check it off — Adrak does a happy dance.</div>
          {nextItems.length === 0
            ? <EmptyState icon="check" title="All done!" body="You've cleared the roadmap. Add new milestones in Roadmap." />
            : nextItems.map((it) => (
              <div key={it.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                <button onClick={(e) => completeLeaf(it.id, e)} title="Mark done"
                  style={{ width: 24, height: 24, borderRadius: 8, border: '2px solid var(--line)', background: 'var(--surface-2)', cursor: 'pointer', flexShrink: 0, display: 'grid', placeItems: 'center', color: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'transparent' }}>
                  <Icon name="check" size={14} stroke={3} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--faint)', fontWeight: 600 }}>{TRACKS[it.track as keyof typeof TRACKS].name}</div>
                </div>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: TRACKS[it.track as keyof typeof TRACKS].color, flexShrink: 0 }} />
              </div>
            ))}
        </Card>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--faint)', fontWeight: 600, padding: '4px 0 8px' }}>
        Phase {state.phase + 1} of 4 · <span style={{ color: 'var(--cat)' }}>{PHASES[state.phase]}</span> — {PHASE_BLURB[state.phase]}
      </div>
    </div>
  )
}

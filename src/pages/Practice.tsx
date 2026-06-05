// Practice.tsx — the Coding & Thinking problem banks. One shared accordion view
// (PracticeView) drives both pages; problems lazy-load per chapter on expand.

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { AppState, Difficulty, Problem, ProblemKind, ProblemProgress } from '../types'
import type { Updater } from '../lib/store'
import { problemXP, solvedCount } from '../lib/calc'
import { CHAPTERS } from '../data/chapters'
import { loadChapter } from '../data/problemsLoader'
import { Badge, Card, EmptyState, PageHeader, ProgressBar, StatCard, Textarea } from '../components/ui'
import { Icon } from '../components/Icon'
import { chip } from '../components/shared'

export type SolveFn = (p: { id: string; kind: ProblemKind; difficulty: Difficulty }, e?: MouseEvent) => void

const DIFF: Record<Difficulty, { label: string; color: string }> = {
  intro: { label: 'Intro', color: 'var(--info)' },
  easy: { label: 'Easy', color: 'var(--success)' },
  medium: { label: 'Medium', color: 'var(--warn)' },
  hard: { label: 'Hard', color: 'var(--danger)' },
}
const DIFF_ORDER: Difficulty[] = ['intro', 'easy', 'medium', 'hard']

type StatusFilter = 'all' | 'unsolved' | 'solved' | 'saved'

function playgroundURL(code: string): string {
  const c = code && code.trim() ? code : 'fn main() {\n    \n}'
  return 'https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=' + encodeURIComponent(c)
}

/* ---------------- code / prose blocks ---------------- */
function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{
      margin: 0, padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--line)',
      borderRadius: 12, overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6,
      color: 'var(--text)', whiteSpace: 'pre',
    }}>{code}</pre>
  )
}
function Prose({ text }: { text: string }) {
  return <div style={{ whiteSpace: 'pre-wrap', fontSize: 13.5, lineHeight: 1.6, color: 'var(--text)' }}>{text}</div>
}

const revealBtn = (active: boolean, color: string): CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 10, cursor: 'pointer',
  fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
  background: active ? `color-mix(in srgb, ${color} 16%, transparent)` : 'var(--surface-2)',
  color: active ? color : 'var(--muted)', border: `1px solid ${active ? `color-mix(in srgb, ${color} 35%, transparent)` : 'var(--line)'}`,
})

/* ---------------- one problem card ---------------- */
function ProblemCard({ p, progress, accent, onSolve, onReveal, onBookmark, onNote }: {
  p: Problem
  progress: ProblemProgress | undefined
  accent: string
  onSolve: SolveFn
  onReveal: (id: string) => void
  onBookmark: (id: string, v: boolean) => void
  onNote: (id: string, note: string) => void
}) {
  const [showHints, setShowHints] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [draft, setDraft] = useState(progress?.notes ?? '')

  const solved = progress?.status === 'solved'
  const attempted = progress?.status === 'attempted'
  const saved = !!progress?.bookmarked
  const d = DIFF[p.difficulty]
  const xp = problemXP(p.kind, p.difficulty)

  const revealSolution = () => {
    const next = !showSol
    setShowSol(next)
    if (next && !solved) onReveal(p.id) // mark as attempted on first peek
  }

  return (
    <Card pad={16} style={{ borderColor: solved ? `color-mix(in srgb, ${accent} 55%, var(--line))` : 'var(--line)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 }}>
        <button onClick={(e) => onSolve({ id: p.id, kind: p.kind, difficulty: p.difficulty }, e)} title={solved ? 'Solved — click to undo' : 'Mark solved'}
          style={{
            width: 26, height: 26, borderRadius: 9, flexShrink: 0, cursor: 'pointer', display: 'grid', placeItems: 'center',
            marginTop: 1, transition: 'all .15s', color: solved ? '#fff' : 'transparent',
            border: solved ? 'none' : '2px solid var(--line)', background: solved ? accent : 'var(--surface-2)',
          }}>
          <Icon name="check" size={15} stroke={3} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: 'var(--text)', lineHeight: 1.3 }}>{p.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <Badge color={d.color}>{d.label}</Badge>
            {attempted && <Badge color="var(--muted)">attempted</Badge>}
            {p.tags.slice(0, 3).map((t) => (
              <span key={t} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--faint)', fontWeight: 700 }}>#{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: solved ? accent : 'var(--faint)' }}>+{xp}</span>
          <button onClick={() => onBookmark(p.id, !saved)} title={saved ? 'Saved' : 'Save for later'}
            style={{ width: 30, height: 30, borderRadius: 9, border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', background: saved ? 'color-mix(in srgb, var(--warn) 16%, transparent)' : 'var(--surface-2)', color: saved ? 'var(--warn)' : 'var(--muted)' }}>
            <Icon name="bookmark" size={15} fill={saved} />
          </button>
        </div>
      </div>

      {/* prompt */}
      <Prose text={p.prompt} />

      {/* actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {p.hints.length > 0 && (
          <button onClick={() => setShowHints((v) => !v)} style={revealBtn(showHints, 'var(--info)')}>
            <Icon name="bulb" size={14} /> {showHints ? 'Hide' : 'Hints'} · {p.hints.length}
          </button>
        )}
        <button onClick={revealSolution} style={revealBtn(showSol, accent)}>
          <Icon name="eye" size={14} /> {showSol ? 'Hide solution' : 'Solution'}
        </button>
        {p.kind === 'coding' && (
          <a href={playgroundURL(p.starter || p.solution)} target="_blank" rel="noreferrer" style={{ ...revealBtn(false, 'var(--track-rust)'), textDecoration: 'none' }}>
            <Icon name="play" size={13} fill /> Playground
          </a>
        )}
        <button onClick={() => setShowNote((v) => !v)} style={{ ...revealBtn(showNote || !!progress?.notes, 'var(--muted)'), marginLeft: 'auto' }}>
          <Icon name="pencil" size={13} /> {progress?.notes ? 'Note' : 'Add note'}
        </button>
      </div>

      {/* hints */}
      {showHints && (
        <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {p.hints.map((h, i) => <li key={i} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{h}</li>)}
        </ol>
      )}

      {/* solution */}
      {showSol && (
        <div style={{ marginTop: 12 }}>
          {p.starter && p.kind === 'coding' && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 }}>Starter</div>
              <CodeBlock code={p.starter} />
            </div>
          )}
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 }}>{p.kind === 'coding' ? 'Reference solution' : 'Model answer'}</div>
          {p.kind === 'coding' ? <CodeBlock code={p.solution} /> : <Prose text={p.solution} />}
        </div>
      )}

      {/* note */}
      {showNote && (
        <div style={{ marginTop: 12 }}>
          <Textarea value={draft} placeholder="Your notes, approach, or a link…" onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onNote(p.id, draft)} style={{ minHeight: 56, fontSize: 13 }} />
        </div>
      )}
    </Card>
  )
}

/* ---------------- chapter row ---------------- */
function ChapterRow({ ch, kind, state, open, onToggle, accent }: {
  ch: typeof CHAPTERS[number]; kind: ProblemKind; state: AppState; open: boolean; onToggle: () => void; accent: string
}) {
  const total = kind === 'coding' ? ch.coding : ch.thinking
  const done = solvedCount(state, kind, ch.num)
  const pct = total ? done / total : 0
  return (
    <button onClick={onToggle} aria-expanded={open} style={{
      display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer',
      background: open ? 'var(--surface-2)' : 'transparent', border: 'none', padding: '13px 14px', borderRadius: 14,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
        background: pct >= 1 ? accent : `color-mix(in srgb, ${accent} 14%, transparent)`, color: pct >= 1 ? '#fff' : accent,
      }}>{pct >= 1 ? <Icon name="check" size={16} stroke={3} /> : ch.num}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ch.num}. {ch.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 5 }}>
          <ProgressBar value={pct} color={accent} height={6} />
          <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{done}/{total}</span>
        </div>
      </div>
      <Icon name={open ? 'chevdown' : 'chevright'} size={18} style={{ color: 'var(--faint)', flexShrink: 0 }} />
    </button>
  )
}

/* ---------------- the shared page ---------------- */
export function PracticeView({ kind, state, update, onSolve }: {
  kind: ProblemKind; state: AppState; update: Updater; onSolve: SolveFn
}) {
  const accent = kind === 'coding' ? 'var(--track-rust)' : 'var(--track-rfl)'
  const meta = kind === 'coding'
    ? { icon: 'code', title: 'Coding Problems', sub: 'Hands-on Rust exercises — solve, run in the Playground, check your work' }
    : { icon: 'bulb', title: 'Thinking Problems', sub: 'Reason about ownership, types & design — predict, explain, compare' }

  const [openCh, setOpenCh] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Record<number, Problem[]>>({})
  const [loadingCh, setLoadingCh] = useState<number | null>(null)
  const [diff, setDiff] = useState<'all' | Difficulty>('all')
  const [statusF, setStatusF] = useState<StatusFilter>('all')

  useEffect(() => {
    if (openCh == null || loaded[openCh]) return
    let alive = true
    setLoadingCh(openCh)
    loadChapter(openCh).then((all) => {
      if (!alive) return
      setLoaded((m) => ({ ...m, [openCh]: all }))
      setLoadingCh(null)
    })
    return () => { alive = false }
  }, [openCh, loaded])

  const patch = (id: string, p: Partial<ProblemProgress>) =>
    update((s) => { const base: ProblemProgress = s.practice[id] || { status: 'todo' }; s.practice[id] = { ...base, ...p }; return s })
  const onReveal = (id: string) => { if (state.practice[id]?.status !== 'solved') patch(id, { status: 'attempted' }) }
  const onBookmark = (id: string, v: boolean) => patch(id, { bookmarked: v })
  const onNote = (id: string, note: string) => patch(id, { notes: note })

  const totalForKind = CHAPTERS.reduce((a, c) => a + (kind === 'coding' ? c.coding : c.thinking), 0)
  const solvedForKind = solvedCount(state, kind)
  const xpForKind = useMemo(() => {
    let xp = 0
    const mark = kind === 'coding' ? '-c-' : '-t-'
    for (const id in state.practice) { const pr = state.practice[id]; if (pr.status === 'solved' && id.includes(mark)) xp += pr.xp || 0 }
    return xp
  }, [state.practice, kind])

  const visible = useMemo(() => {
    if (openCh == null) return []
    const all = (loaded[openCh] || []).filter((p) => p.kind === kind)
    return all.filter((p) => {
      if (diff !== 'all' && p.difficulty !== diff) return false
      const pr = state.practice[p.id]
      if (statusF === 'solved' && pr?.status !== 'solved') return false
      if (statusF === 'unsolved' && pr?.status === 'solved') return false
      if (statusF === 'saved' && !pr?.bookmarked) return false
      return true
    })
  }, [openCh, loaded, kind, diff, statusF, state.practice])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon={meta.icon} title={meta.title} subtitle={meta.sub} accent={accent} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <StatCard label="Solved" value={`${solvedForKind}`} sub={`of ${totalForKind.toLocaleString()}`} icon="check" accent={accent} />
        <StatCard label="Progress" value={`${Math.round((solvedForKind / Math.max(1, totalForKind)) * 100)}%`} sub="of this track" icon="overview" accent="var(--accent)" />
        <StatCard label="XP earned" value={xpForKind.toLocaleString()} sub={kind === 'coding' ? 'from coding' : 'from thinking'} icon="spark" accent="var(--cat)" />
        <StatCard label="Chapters" value={`${CHAPTERS.length}`} sub="of The Rust Book" icon="reading" accent="var(--info)" />
      </div>

      <Card pad={10}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {CHAPTERS.map((ch) => {
            const open = openCh === ch.num
            return (
              <div key={ch.num}>
                <ChapterRow ch={ch} kind={kind} state={state} open={open} accent={accent}
                  onToggle={() => setOpenCh(open ? null : ch.num)} />
                {open && (
                  <div style={{ padding: '6px 6px 14px' }}>
                    {/* filters */}
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center', margin: '8px 4px 14px' }}>
                      <button onClick={() => setDiff('all')} style={chip(diff === 'all')}>All</button>
                      {DIFF_ORDER.map((d) => <button key={d} onClick={() => setDiff(d)} style={chip(diff === d)}>{DIFF[d].label}</button>)}
                      <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 4px' }} />
                      {(['all', 'unsolved', 'solved', 'saved'] as StatusFilter[]).map((sf) => (
                        <button key={sf} onClick={() => setStatusF(sf)} style={chip(statusF === sf)}>{sf === 'all' ? 'Any' : sf[0].toUpperCase() + sf.slice(1)}</button>
                      ))}
                    </div>

                    {loadingCh === ch.num && !loaded[ch.num]
                      ? <div style={{ padding: '26px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, fontWeight: 600 }}>Loading problems…</div>
                      : visible.length === 0
                        ? <EmptyState icon="filter" title="Nothing here" body="No problems match these filters. Try widening the difficulty or status." />
                        : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {visible.map((p) => (
                            <ProblemCard key={p.id} p={p} progress={state.practice[p.id]} accent={accent}
                              onSolve={onSolve} onReveal={onReveal} onBookmark={onBookmark} onNote={onNote} />
                          ))}
                        </div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--faint)', fontWeight: 600, padding: '0 0 6px' }}>
        {solvedForKind} solved · {totalForKind - solvedForKind} to go — every solve feeds your streak & a daily quest 🧩
      </div>
    </div>
  )
}

export function Coding({ state, update, onSolve }: { state: AppState; update: Updater; onSolve: SolveFn }) {
  return <PracticeView kind="coding" state={state} update={update} onSolve={onSolve} />
}
export function Thinking({ state, update, onSolve }: { state: AppState; update: Updater; onSolve: SolveFn }) {
  return <PracticeView kind="thinking" state={state} update={update} onSolve={onSolve} />
}

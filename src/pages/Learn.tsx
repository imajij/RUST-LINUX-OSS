// Learn.tsx — the unified learning hub. Pick a Track (Rust / Linux) and a Mode
// (Notes / Coding / Thinking); a chapter accordion shows the matching content.
// Notes & problems lazy-load per chapter. Replaces the old Coding/Thinking pages.

import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { AppState, ChapterNote, Difficulty, LearnTrack, Problem, ProblemKind, ProblemProgress } from '../types'
import type { Updater } from '../lib/store'
import { problemXP, solvedCount } from '../lib/calc'
import { chaptersFor } from '../data/chapters'
import type { ChapterMeta } from '../data/chapters'
import { loadChapter } from '../data/problemsLoader'
import { loadNote } from '../data/notesLoader'
import { Badge, Card, EmptyState, PageHeader, ProgressBar, StatCard, Textarea } from '../components/ui'
import { Icon } from '../components/Icon'
import { Markdown } from '../components/Markdown'
import { chip } from '../components/shared'

// Remotion + the animation engine are heavy, so load them only when a note that
// actually has an animation is opened.
const AnimationPlayer = lazy(() => import('../anim/AnimationPlayer'))

export type SolveFn = (p: { id: string; kind: ProblemKind; difficulty: Difficulty }, e?: MouseEvent) => void
export type ReadNoteFn = (noteId: string, e?: MouseEvent) => void

type Mode = 'notes' | 'coding' | 'thinking'

const DIFF: Record<Difficulty, { label: string; color: string }> = {
  intro: { label: 'Intro', color: 'var(--info)' },
  easy: { label: 'Easy', color: 'var(--success)' },
  medium: { label: 'Medium', color: 'var(--warn)' },
  hard: { label: 'Hard', color: 'var(--danger)' },
}
const DIFF_ORDER: Difficulty[] = ['intro', 'easy', 'medium', 'hard']
type StatusFilter = 'all' | 'unsolved' | 'solved' | 'saved'

const trackAccent = (t: LearnTrack) => (t === 'linux' ? 'var(--track-c)' : t === 'dsa' ? 'var(--track-dsa)' : 'var(--track-rust)')
const noteId = (t: LearnTrack, n: number) => `note-${t === 'linux' ? 'lx' : t === 'dsa' ? 'ds' : 'rs'}-${n < 10 ? '0' + n : n}`

function playgroundURL(code: string): string {
  const c = code && code.trim() ? code : 'fn main() {\n    \n}'
  return 'https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=' + encodeURIComponent(c)
}

/* ---------------- shared blocks ---------------- */
function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{
      margin: 0, padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12,
      overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)', whiteSpace: 'pre',
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

/* ---------------- notes panel ---------------- */
function NotesPanel({ note, read, accent, onRead }: { note: ChapterNote; read: boolean; accent: string; onRead: ReadNoteFn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '6px 4px 4px' }}>
      <div style={{ padding: '12px 14px', borderRadius: 14, background: `color-mix(in srgb, ${accent} 9%, transparent)`, border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)` }}>
        <Prose text={note.summary} />
      </div>

      {note.sections.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16.5, color: 'var(--text)' }}>{s.heading}</div>
          <Markdown text={s.body} />
          {(s.code || []).map((c, k) => <CodeBlock key={k} code={c.src} />)}
          {s.anim && (
            <Suspense fallback={<div style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 12.5 }}>Loading animation…</div>}>
              <AnimationPlayer id={s.anim} />
            </Suspense>
          )}
        </div>
      ))}

      {note.takeaways.length > 0 && (
        <div style={{ padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>Key takeaways</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {note.takeaways.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, marginTop: 1, display: 'grid', placeItems: 'center', background: accent, color: '#fff' }}><Icon name="check" size={12} stroke={3} /></span>
                <span style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {note.cheatsheet && note.cheatsheet.length > 0 && (
        <div style={{ borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: 'var(--surface-2)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Cheat-sheet</div>
          {note.cheatsheet.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 14px', borderTop: '1px solid var(--line)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: accent, flexShrink: 0, minWidth: 130, wordBreak: 'break-word' }}>{r.label}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={(e) => onRead(note.id, e)} style={{
        alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 12,
        cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, border: 'none',
        background: read ? 'var(--surface-2)' : accent, color: read ? 'var(--muted)' : '#fff',
        boxShadow: read ? 'none' : `0 8px 18px -10px ${accent}`,
      }}>
        <Icon name="check" size={16} stroke={3} /> {read ? 'Read ✓ — mark unread' : 'Mark chapter as read'}
      </button>
    </div>
  )
}

/* ---------------- problem card ---------------- */
function ProblemCard({ p, track, progress, accent, onSolve, onReveal, onBookmark, onNote }: {
  p: Problem; track: LearnTrack; progress: ProblemProgress | undefined; accent: string
  onSolve: SolveFn; onReveal: (id: string) => void; onBookmark: (id: string, v: boolean) => void; onNote: (id: string, note: string) => void
}) {
  const [showHints, setShowHints] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [draft, setDraft] = useState(progress?.notes ?? '')
  const [copied, setCopied] = useState(false)

  const solved = progress?.status === 'solved'
  const attempted = progress?.status === 'attempted'
  const saved = !!progress?.bookmarked
  const d = DIFF[p.difficulty]
  const xp = problemXP(p.kind, p.difficulty)

  const revealSolution = () => { const next = !showSol; setShowSol(next); if (next && !solved) onReveal(p.id) }
  const copyStarter = async () => {
    try { await navigator.clipboard.writeText(p.starter || p.solution); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* ignore */ }
  }

  return (
    <Card pad={16} style={{ borderColor: solved ? `color-mix(in srgb, ${accent} 55%, var(--line))` : 'var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 }}>
        <button onClick={(e) => onSolve({ id: p.id, kind: p.kind, difficulty: p.difficulty }, e)} title={solved ? 'Solved — click to undo' : 'Mark solved'}
          style={{ width: 26, height: 26, borderRadius: 9, flexShrink: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', marginTop: 1, transition: 'all .15s', color: solved ? '#fff' : 'transparent', border: solved ? 'none' : '2px solid var(--line)', background: solved ? accent : 'var(--surface-2)' }}>
          <Icon name="check" size={15} stroke={3} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: 'var(--text)', lineHeight: 1.3 }}>{p.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            <Badge color={d.color}>{d.label}</Badge>
            {attempted && <Badge color="var(--muted)">attempted</Badge>}
            {p.tags.slice(0, 3).map((t) => <span key={t} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--faint)', fontWeight: 700 }}>#{t}</span>)}
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

      <Prose text={p.prompt} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {p.hints.length > 0 && (
          <button onClick={() => setShowHints((v) => !v)} style={revealBtn(showHints, 'var(--info)')}>
            <Icon name="bulb" size={14} /> {showHints ? 'Hide' : 'Hints'} · {p.hints.length}
          </button>
        )}
        <button onClick={revealSolution} style={revealBtn(showSol, accent)}>
          <Icon name="eye" size={14} /> {showSol ? 'Hide solution' : 'Solution'}
        </button>
        {p.kind === 'coding' && (track === 'rust' || track === 'dsa') && (
          <a href={playgroundURL(p.starter || p.solution)} target="_blank" rel="noreferrer" style={{ ...revealBtn(false, accent), textDecoration: 'none' }}>
            <Icon name="play" size={13} fill /> Playground
          </a>
        )}
        {p.kind === 'coding' && track === 'linux' && (
          <button onClick={copyStarter} style={revealBtn(copied, 'var(--track-c)')}>
            <Icon name={copied ? 'check' : 'code'} size={13} /> {copied ? 'Copied!' : 'Copy starter'}
          </button>
        )}
        <button onClick={() => setShowNote((v) => !v)} style={{ ...revealBtn(showNote || !!progress?.notes, 'var(--muted)'), marginLeft: 'auto' }}>
          <Icon name="pencil" size={13} /> {progress?.notes ? 'Note' : 'Add note'}
        </button>
      </div>

      {showHints && (
        <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {p.hints.map((h, i) => <li key={i} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{h}</li>)}
        </ol>
      )}

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

      {showNote && (
        <div style={{ marginTop: 12 }}>
          <Textarea value={draft} placeholder="Your notes, approach, or a link…" onChange={(e) => setDraft(e.target.value)} onBlur={() => onNote(p.id, draft)} style={{ minHeight: 56, fontSize: 13 }} />
        </div>
      )}
    </Card>
  )
}

/* ---------------- chapter row ---------------- */
function ChapterRow({ ch, mode, done, total, open, accent, onToggle }: {
  ch: ChapterMeta; mode: Mode; done: number; total: number; open: boolean; accent: string; onToggle: () => void
}) {
  const pct = total ? done / total : 0
  const isNotes = mode === 'notes'
  return (
    <button onClick={onToggle} aria-expanded={open} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer', background: open ? 'var(--surface-2)' : 'transparent', border: 'none', padding: '13px 14px', borderRadius: 14 }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, background: pct >= 1 ? accent : `color-mix(in srgb, ${accent} 14%, transparent)`, color: pct >= 1 ? '#fff' : accent }}>
        {pct >= 1 ? <Icon name="check" size={16} stroke={3} /> : ch.num}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.num}. {ch.title}</div>
        {isNotes
          ? <div style={{ fontSize: 11.5, color: done ? accent : 'var(--muted)', fontWeight: 700, marginTop: 4 }}>{done ? 'Read ✓' : ch.blurb}</div>
          : <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 5 }}>
            <ProgressBar value={pct} color={accent} height={6} />
            <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{done}/{total}</span>
          </div>}
      </div>
      <Icon name={open ? 'chevdown' : 'chevright'} size={18} style={{ color: 'var(--faint)', flexShrink: 0 }} />
    </button>
  )
}

/* ---------------- the hub ---------------- */
export function Learn({ state, update, onSolve, onReadNote }: {
  state: AppState; update: Updater; onSolve: SolveFn; onReadNote: ReadNoteFn
}) {
  const [track, setTrack] = useState<LearnTrack>('rust')
  const [mode, setMode] = useState<Mode>('notes')
  const [openCh, setOpenCh] = useState<number | null>(null)
  const [problems, setProblems] = useState<Record<string, Problem[]>>({})
  const [notes, setNotes] = useState<Record<string, ChapterNote | null>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [diff, setDiff] = useState<'all' | Difficulty>('all')
  const [statusF, setStatusF] = useState<StatusFilter>('all')

  const accent = trackAccent(track)
  const chapters = chaptersFor(track)
  const kind: ProblemKind = mode === 'thinking' ? 'thinking' : 'coding'
  const ck = openCh != null ? `${track}:${openCh}` : ''

  // lazy-load whatever the open chapter needs for the current mode
  useEffect(() => {
    if (openCh == null) return
    const key = `${track}:${openCh}`
    let alive = true
    if (mode === 'notes') {
      if (notes[key] !== undefined) return
      setBusy(key)
      loadNote(track, openCh).then((n) => { if (alive) { setNotes((m) => ({ ...m, [key]: n })); setBusy(null) } })
    } else {
      if (problems[key]) return
      setBusy(key)
      loadChapter(track, openCh).then((all) => { if (alive) { setProblems((m) => ({ ...m, [key]: all })); setBusy(null) } })
    }
    return () => { alive = false }
  }, [openCh, track, mode, problems, notes])

  const patch = (id: string, p: Partial<ProblemProgress>) =>
    update((s) => { const base: ProblemProgress = s.practice[id] || { status: 'todo' }; s.practice[id] = { ...base, ...p }; return s })
  const onReveal = (id: string) => { if (state.practice[id]?.status !== 'solved') patch(id, { status: 'attempted' }) }
  const onBookmark = (id: string, v: boolean) => patch(id, { bookmarked: v })
  const onNote = (id: string, note: string) => patch(id, { notes: note })

  const switchTrack = (t: LearnTrack) => { if (t === track) return; setTrack(t); setOpenCh(null); setDiff('all'); setStatusF('all'); if (t === 'dsa' && mode === 'notes') setMode('coding') }

  // header stats
  const stats = useMemo(() => {
    if (mode === 'notes') {
      const read = chapters.filter((c) => state.notesRead[noteId(track, c.num)]).length
      return { a: { label: 'Notes read', value: `${read}`, sub: `of ${chapters.length}`, icon: 'reading' },
        b: { label: 'Progress', value: `${Math.round((read / Math.max(1, chapters.length)) * 100)}%`, sub: 'of this track', icon: 'overview' } }
    }
    const total = chapters.reduce((acc, c) => acc + (kind === 'coding' ? c.coding : c.thinking), 0)
    const done = solvedCount(state, { track, kind })
    let xp = 0
    const tp = track === 'linux' ? 'lx-' : track === 'dsa' ? 'ds-' : 'rs-'
    const mk = kind === 'coding' ? '-c-' : '-t-'
    for (const id in state.practice) { const pr = state.practice[id]; if (pr.status === 'solved' && id.startsWith(tp) && id.includes(mk)) xp += pr.xp || 0 }
    return { a: { label: 'Solved', value: `${done}`, sub: `of ${total.toLocaleString()}`, icon: 'check' },
      b: { label: 'XP earned', value: xp.toLocaleString(), sub: kind === 'coding' ? 'from coding' : 'from thinking', icon: 'spark' } }
  }, [mode, track, kind, state.practice, state.notesRead, chapters])

  const visible = useMemo(() => {
    if (openCh == null || mode === 'notes') return []
    const all = (problems[ck] || []).filter((p) => p.kind === kind)
    return all.filter((p) => {
      if (diff !== 'all' && p.difficulty !== diff) return false
      const pr = state.practice[p.id]
      if (statusF === 'solved' && pr?.status !== 'solved') return false
      if (statusF === 'unsolved' && pr?.status === 'solved') return false
      if (statusF === 'saved' && !pr?.bookmarked) return false
      return true
    })
  }, [openCh, mode, problems, ck, kind, diff, statusF, state.practice])

  const MODES: { id: Mode; label: string; icon: string }[] = [
    { id: 'notes', label: 'Notes', icon: 'reading' },
    { id: 'coding', label: 'Coding', icon: 'code' },
    { id: 'thinking', label: 'Thinking', icon: 'bulb' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="grad" title="Learn" subtitle="Theory, coding & thinking — Rust, the Linux kernel & DSA in Rust" accent={accent} />

      {/* track switcher */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--surface-2)', padding: 5, borderRadius: 14, border: '1px solid var(--line)', maxWidth: 460 }}>
        {(['rust', 'linux', 'dsa'] as LearnTrack[]).map((t) => {
          const on = track === t
          const tc = trackAccent(t)
          return (
            <button key={t} onClick={() => switchTrack(t)} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, background: on ? 'var(--surface)' : 'transparent', color: on ? tc : 'var(--muted)', boxShadow: on ? '0 4px 12px -8px var(--shadow)' : 'none' }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: tc }} /> {t === 'rust' ? 'Rust' : t === 'linux' ? 'Linux' : 'DSA'}
            </button>
          )
        })}
      </div>

      {/* mode tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {MODES.map((m) => {
          const on = mode === m.id
          return (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 12, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, border: `1px solid ${on ? 'transparent' : 'var(--line)'}`, background: on ? accent : 'var(--surface)', color: on ? '#fff' : 'var(--muted)', boxShadow: on ? `0 8px 18px -10px ${accent}` : 'none' }}>
              <Icon name={m.icon} size={16} /> {m.label}
            </button>
          )
        })}
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <StatCard label={stats.a.label} value={stats.a.value} sub={stats.a.sub} icon={stats.a.icon} accent={accent} />
        <StatCard label={stats.b.label} value={stats.b.value} sub={stats.b.sub} icon={stats.b.icon} accent="var(--cat)" />
        <StatCard label={track === 'dsa' ? 'Topics' : 'Chapters'} value={`${chapters.length}`} sub={track === 'rust' ? 'of The Rust Book' : track === 'linux' ? 'kernel topics' : 'DSA topics'} icon="roadmap" accent="var(--info)" />
        <StatCard label="Mode" value={mode === 'notes' ? 'Notes' : mode === 'coding' ? 'Coding' : 'Thinking'} sub={track === 'rust' ? 'Rust track' : track === 'linux' ? 'Linux track' : 'DSA track'} icon={mode === 'notes' ? 'reading' : mode === 'coding' ? 'code' : 'bulb'} accent="var(--track-rfl)" />
      </div>

      {/* accordion */}
      <Card pad={10}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {chapters.map((ch) => {
            const open = openCh === ch.num
            const key = `${track}:${ch.num}`
            const done = mode === 'notes'
              ? (state.notesRead[noteId(track, ch.num)] ? 1 : 0)
              : solvedCount(state, { track, kind, chapter: ch.num })
            const total = mode === 'notes' ? 1 : (kind === 'coding' ? ch.coding : ch.thinking)
            return (
              <div key={ch.num}>
                <ChapterRow ch={ch} mode={mode} done={done} total={total} open={open} accent={accent} onToggle={() => setOpenCh(open ? null : ch.num)} />
                {open && (
                  <div style={{ padding: '6px 6px 14px' }}>
                    {busy === key && (mode === 'notes' ? notes[key] === undefined : !problems[key])
                      ? <div style={{ padding: '26px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, fontWeight: 600 }}>Loading…</div>
                      : mode === 'notes'
                        ? (notes[key]
                          ? <NotesPanel note={notes[key]!} read={!!state.notesRead[noteId(track, ch.num)]} accent={accent} onRead={onReadNote} />
                          : <EmptyState icon="reading" title="Notes coming soon" body="Study notes for this chapter aren't available yet." />)
                        : <>
                          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center', margin: '8px 4px 14px' }}>
                            <button onClick={() => setDiff('all')} style={chip(diff === 'all')}>All</button>
                            {DIFF_ORDER.map((dd) => <button key={dd} onClick={() => setDiff(dd)} style={chip(diff === dd)}>{DIFF[dd].label}</button>)}
                            <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 4px' }} />
                            {(['all', 'unsolved', 'solved', 'saved'] as StatusFilter[]).map((sf) => (
                              <button key={sf} onClick={() => setStatusF(sf)} style={chip(statusF === sf)}>{sf === 'all' ? 'Any' : sf[0].toUpperCase() + sf.slice(1)}</button>
                            ))}
                          </div>
                          {visible.length === 0
                            ? <EmptyState icon="filter" title="Nothing here" body="No problems match these filters. Try widening the difficulty or status." />
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {visible.map((p) => (
                                <ProblemCard key={p.id} p={p} track={track} progress={state.practice[p.id]} accent={accent} onSolve={onSolve} onReveal={onReveal} onBookmark={onBookmark} onNote={onNote} />
                              ))}
                            </div>}
                        </>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

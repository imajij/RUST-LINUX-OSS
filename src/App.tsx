import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { Contrib, Goal, QuestKind, ReadingItem, ThemeName } from './types'
import { questComplete, useStore } from './lib/store'
import { applyTheme } from './lib/theme'
import { PHASES, leagueFor, levelInfo, streak, weeklyXP } from './lib/calc'
import type { LevelInfo, League } from './lib/calc'
import { todayISO } from './lib/date'
import { fireConfetti } from './lib/confetti'
import { Adrak } from './components/Adrak'
import { Icon } from './components/Icon'
import { Button } from './components/ui'
import { iconBtn, kbdStyle } from './components/shared'
import { ContribModal, GoalModal, LogModal, ReadingModal, Toast } from './components/modals'
import type { ContribForm, GoalForm, LogInput, ReadingForm } from './components/modals'
import { Overview } from './pages/Overview'
import { Roadmap } from './pages/Roadmap'
import { Study } from './pages/Study'
import { Contributions } from './pages/Contributions'
import { Reading } from './pages/Reading'
import { Goals } from './pages/Goals'
import { Settings } from './pages/Settings'

const NAV = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: 'overview' },
  { id: 'roadmap', label: 'Roadmap', short: 'Map', icon: 'roadmap' },
  { id: 'study', label: 'Study Log', short: 'Study', icon: 'study' },
  { id: 'contribs', label: 'Contributions', short: 'PRs', icon: 'contribs' },
  { id: 'reading', label: 'Reading', short: 'Read', icon: 'reading' },
  { id: 'goals', label: 'Goals', short: 'Goals', icon: 'goals' },
  { id: 'settings', label: 'Settings', short: 'You', icon: 'settings' },
]

function useMobile() {
  const [m, setM] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return m
}

export function App() {
  const [state, update, setState] = useStore()
  const [page, setPage] = useState('overview')
  const [theme, setThemeRaw] = useState<ThemeName>(state.settings.theme || 'light')
  const [logOpen, setLogOpen] = useState(false)
  const [contribItem, setContribItem] = useState<Contrib | null | undefined>(undefined)
  const [readingItem, setReadingItem] = useState<ReadingItem | null | undefined>(undefined)
  const [goalItem, setGoalItem] = useState<Goal | null | undefined>(undefined)
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null)
  const isMobile = useMobile()

  useEffect(() => { applyTheme(theme, state.settings) }, [theme, state.settings])
  const setTheme = (t: ThemeName) => { setThemeRaw(t); update((s) => { s.settings.theme = t; return s }) }

  // level-up celebration
  const prevLevel = useRef(levelInfo(state).level)
  useEffect(() => {
    const L = levelInfo(state).level
    if (L > prevLevel.current) { fireConfetti({ count: 130 }); setToast({ title: `Level ${L}! 🎉`, body: 'Adrak grew stronger. Keep climbing!' }) }
    prevLevel.current = L
  }, [state])

  // all-quests-cleared celebration
  const prevBonus = useRef(!!state.quests.bonusClaimed)
  useEffect(() => {
    if (state.quests.bonusClaimed && !prevBonus.current) { fireConfetti({ count: 120 }); setToast({ title: 'Daily quests cleared! ⭐', body: '+120 bonus XP — see you tomorrow.' }) }
    prevBonus.current = !!state.quests.bonusClaimed
  }, [state.quests.bonusClaimed])

  const bonusIfAllDone = (s: typeof state) => {
    if (s.quests.items.every((q) => q.done) && !s.quests.bonusClaimed) { s.quests.bonusClaimed = true; s.xpBonus = (s.xpBonus || 0) + 120 }
  }

  const award = useCallback((kind: QuestKind, e?: MouseEvent) => {
    update((s) => { questComplete(s, kind); bonusIfAllDone(s); return s })
    if (e && e.clientX) fireConfetti({ x: e.clientX, y: e.clientY, count: 45 })
  }, [update])

  // global "N" → log study
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = ((e.target as HTMLElement)?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setLogOpen(true) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const toggleLeaf = (trackId: string, groupId: string, leafId: string, e?: MouseEvent) => {
    let becameDone = false
    update((s) => {
      const it = s.roadmap.find((t) => t.id === trackId)!.groups.find((g) => g.id === groupId)!.items.find((i) => i.id === leafId)!
      it.status = it.status === 'done' ? 'todo' : 'done'
      becameDone = it.status === 'done'
      if (becameDone) { questComplete(s, 'roadmap'); bonusIfAllDone(s) }
      return s
    })
    if (becameDone && e) fireConfetti({ x: e.clientX, y: e.clientY, count: 45 })
  }
  const completeLeaf = (leafId: string, e: MouseEvent) => {
    for (const t of state.roadmap) for (const g of t.groups) for (const it of g.items) if (it.id === leafId) return toggleLeaf(t.id, g.id, leafId, e)
  }

  const saveLog = ({ track, desc, hours }: LogInput) => {
    update((s) => {
      s.study.unshift({ id: 'st' + Date.now(), date: todayISO(), track, desc, hours })
      s.activity[todayISO()] = (s.activity[todayISO()] || 0) + hours * 60
      questComplete(s, 'study'); bonusIfAllDone(s)
      return s
    })
    fireConfetti({ count: 70, y: window.innerHeight * 0.5 })
    setLogOpen(false)
  }
  const saveContrib = (f: ContribForm) => {
    update((s) => {
      if (f.id) { const i = s.contribs.findIndex((c) => c.id === f.id); if (i >= 0) s.contribs[i] = { ...s.contribs[i], ...f } }
      else s.contribs.unshift({ ...f, id: 'c' + Date.now() } as Contrib)
      return s
    })
    setContribItem(undefined)
  }
  const saveReading = (f: ReadingForm) => {
    update((s) => {
      if (f.id) { const i = s.reading.findIndex((r) => r.id === f.id); if (i >= 0) s.reading[i] = { ...s.reading[i], ...f } }
      else s.reading.unshift({ ...f, id: 'rd' + Date.now(), done: f.done || 0 } as ReadingItem)
      return s
    })
    setReadingItem(undefined)
  }
  const saveGoal = (f: GoalForm) => {
    update((s) => {
      if (f.id) { const i = s.goals.findIndex((g) => g.id === f.id); if (i >= 0) s.goals[i] = { ...s.goals[i], ...f } }
      else s.goals.push({ ...f, id: 'go' + Date.now() } as Goal)
      return s
    })
    setGoalItem(undefined)
  }

  const nav = (p: string) => { setPage(p); window.scrollTo({ top: 0 }) }
  const li = levelInfo(state), stk = streak(state), league = leagueFor(weeklyXP(state))

  const pageEl = (() => {
    switch (page) {
      case 'overview': return <Overview state={state} update={update} nav={nav} openQuickAdd={() => setLogOpen(true)} completeLeaf={completeLeaf} />
      case 'roadmap': return <Roadmap state={state} update={update} toggleLeaf={toggleLeaf} />
      case 'study': return <Study state={state} update={update} openQuickAdd={() => setLogOpen(true)} />
      case 'contribs': return <Contributions state={state} update={update} openContribModal={(c) => setContribItem(c)} />
      case 'reading': return <Reading state={state} update={update} openReadingModal={(r) => setReadingItem(r)} award={award} />
      case 'goals': return <Goals state={state} update={update} openGoalModal={(g) => setGoalItem(g)} />
      case 'settings': return <Settings state={state} update={update} setState={setState} theme={theme} setTheme={setTheme} />
      default: return null
    }
  })()

  return (
    <div style={{ minHeight: '100vh' }}>
      {!isMobile && <Sidebar page={page} nav={nav} state={state} li={li} stk={stk} league={league} theme={theme} setTheme={setTheme} openQuickAdd={() => setLogOpen(true)} />}
      {isMobile && <TopBar stk={stk} theme={theme} setTheme={setTheme} openQuickAdd={() => setLogOpen(true)} />}

      <main style={{ paddingLeft: isMobile ? 0 : 248, paddingTop: isMobile ? 64 : 0, paddingBottom: isMobile ? 92 : 0 }}>
        <div key={page} style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '18px 16px' : '30px 32px', animation: 'page-in .4s cubic-bezier(.22,1,.36,1)' }}>
          {pageEl}
        </div>
      </main>

      {isMobile && <BottomNav page={page} nav={nav} />}

      <LogModal open={logOpen} onClose={() => setLogOpen(false)} onSave={saveLog} />
      <ContribModal item={contribItem} open={contribItem !== undefined} onClose={() => setContribItem(undefined)} onSave={saveContrib} />
      <ReadingModal item={readingItem} open={readingItem !== undefined} onClose={() => setReadingItem(undefined)} onSave={saveReading} />
      <GoalModal item={goalItem} open={goalItem !== undefined} onClose={() => setGoalItem(undefined)} onSave={saveGoal} />
      <Toast data={toast} onDone={() => setToast(null)} />
    </div>
  )
}

/* ---------------- chrome ---------------- */
function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: size, height: size, borderRadius: 12, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center' }}>
        <Adrak size={size - 4} bob={false} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>Adrak</div>
        <div style={{ fontSize: 10.5, color: 'var(--faint)', fontWeight: 700, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>OSS JOURNEY</div>
      </div>
    </div>
  )
}

function Sidebar({ page, nav, state, li, stk, league, theme, setTheme, openQuickAdd }: {
  page: string; nav: (p: string) => void; state: ReturnType<typeof useStore>[0]; li: LevelInfo; stk: number; league: League; theme: ThemeName; setTheme: (t: ThemeName) => void; openQuickAdd: () => void
}) {
  return (
    <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 232, padding: 18, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--surface-blur)', backdropFilter: 'blur(16px)', borderRight: '1px solid var(--line)', zIndex: 50 }}>
      <BrandMark />
      <Button variant="primary" onClick={openQuickAdd} style={{ width: '100%', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="plus" size={17} /> Log time</span>
        <kbd style={kbdStyle}>N</kbd>
      </Button>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map((n) => {
          const active = page === n.id
          return (
            <button key={n.id} onClick={() => nav(n.id)} aria-current={active} className="navbtn">
              <Icon name={n.icon} size={18} stroke={active ? 2.4 : 2} /> {n.label}
            </button>
          )
        })}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15, animation: stk > 0 ? 'flame-flick .9s ease-in-out infinite' : 'none' }}>🔥</span>
            <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{stk}</span>
          </div>
          <div style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="trophy" size={15} style={{ color: league.color }} />
            <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>L{li.level}</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--faint)', fontWeight: 700, textAlign: 'center' }}>{PHASES[state.phase]}</div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-body)' }}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} /> {theme === 'dark' ? 'Light' : 'Dark'} mode
        </button>
      </div>
    </aside>
  )
}

function TopBar({ stk, theme, setTheme, openQuickAdd }: { stk: number; theme: ThemeName; setTheme: (t: ThemeName) => void; openQuickAdd: () => void }) {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 50, background: 'var(--surface-blur)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
      <BrandMark size={34} />
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 999, padding: '5px 11px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 14, animation: stk > 0 ? 'flame-flick .9s ease-in-out infinite' : 'none' }}>🔥</span>
          <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{stk}</span>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ ...iconBtn, width: 36, height: 36, border: '1px solid var(--line)' }}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button>
        <Button size="icon" onClick={openQuickAdd}><Icon name="plus" size={20} /></Button>
      </div>
    </header>
  )
}

function BottomNav({ page, nav }: { page: string; nav: (p: string) => void }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 76, padding: '6px 4px', display: 'flex', zIndex: 50, background: 'var(--surface-blur)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--line)' }}>
      {NAV.map((n) => {
        const active = page === n.id
        return (
          <button key={n.id} onClick={() => nav(n.id)} aria-current={active}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: active ? 'var(--accent-deep)' : 'var(--faint)' }}>
            <span style={{ width: 34, height: 26, borderRadius: 9, display: 'grid', placeItems: 'center', background: active ? 'var(--accent-soft)' : 'transparent' }}>
              <Icon name={n.icon} size={18} stroke={active ? 2.4 : 2} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700 }}>{n.short}</span>
          </button>
        )
      })}
    </nav>
  )
}

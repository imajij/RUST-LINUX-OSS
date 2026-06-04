import type { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react'
import type { AppState, ThemeName } from '../types'
import type { Updater } from '../lib/store'
import { defaultState } from '../lib/store'
import { PHASES } from '../lib/calc'
import { Button, Card, Field, Input, PageHeader, Select, Switch } from '../components/ui'
import { Icon } from '../components/Icon'

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-deep)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={18} /></div>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', whiteSpace: 'nowrap' }}>{title}</h3>
      </div>
      {children}
    </Card>
  )
}

export function Settings({ state, update, setState, theme, setTheme }: {
  state: AppState; update: Updater; setState: Dispatch<SetStateAction<AppState>>; theme: ThemeName; setTheme: (t: ThemeName) => void
}) {
  const set = (path: string, val: unknown) => update((s) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let o: any = s
    const ks = path.split('.')
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]
    o[ks[ks.length - 1]] = val
    return s
  })

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'adrak-journey.json'
    a.click()
  }
  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const d = JSON.parse(String(reader.result)) as Partial<AppState>
        setState({ ...defaultState(), ...d })
        alert('Imported! 🎉')
      } catch {
        alert('Could not read that file.')
      }
    }
    reader.readAsText(f)
  }
  const reset = () => { if (confirm('Reset everything to the starter data? This clears your logged progress.')) setState(defaultState()) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="settings" title="Settings" subtitle="Make it yours — everything here is editable" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
        <Section icon="contribs" title="GitHub">
          <Field label="Username"><Input value={state.profile.username} onChange={(e) => set('profile.username', e.target.value)} /></Field>
          <Field label="Personal access token (optional)" hint="Stored locally only. Lifts the public API rate limit."><Input type="password" placeholder="ghp_…" value={state.profile.githubToken} onChange={(e) => set('profile.githubToken', e.target.value)} /></Field>
          <Field label="Main project" hint="Starred in your contribution log."><Input value={state.profile.mainProject} onChange={(e) => set('profile.mainProject', e.target.value)} /></Field>
        </Section>
        <Section icon="roadmap" title="Journey">
          <Field label="Display name"><Input value={state.profile.name} onChange={(e) => set('profile.name', e.target.value)} /></Field>
          <Field label="Current phase">
            <Select value={state.phase} onChange={(e) => set('phase', +e.target.value)}>{PHASES.map((p, i) => <option key={p} value={i}>{i + 1}. {p}</option>)}</Select>
          </Field>
          <Field label="LFX Mentorship date"><Input type="date" value={state.settings.dates.lfx} onChange={(e) => set('settings.dates.lfx', e.target.value)} /></Field>
          <Field label="GSoC date"><Input type="date" value={state.settings.dates.gsoc} onChange={(e) => set('settings.dates.gsoc', e.target.value)} /></Field>
          <Field label="Internship season"><Input type="date" value={state.settings.dates.internship} onChange={(e) => set('settings.dates.internship', e.target.value)} /></Field>
          <Switch checked={state.settings.partialCredit} onChange={(v) => set('settings.partialCredit', v)} label="Count partial progress toward XP" />
        </Section>
        <Section icon={theme === 'dark' ? 'moon' : 'sun'} title="Appearance">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Adrak looks great in both. Toggle any time from the nav.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['light', 'dark'] as ThemeName[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)} style={{
                flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
                border: theme === t ? '2px solid var(--accent)' : '1px solid var(--line)',
                background: t === 'dark' ? '#14110B' : '#FBF7EC', color: t === 'dark' ? '#F2ECDD' : '#2A2520',
                fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name={t === 'dark' ? 'moon' : 'sun'} size={18} /> {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </Section>
        <Section icon="settings" title="Your data">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>Everything lives in your browser — nothing leaves this device. Export to back up or move to another machine.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="secondary" icon="download" onClick={exportData}>Export JSON</Button>
            <label>
              <Button variant="secondary" icon="upload" onClick={(e) => (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement | null)?.click()}>Import JSON</Button>
              <input type="file" accept="application/json" onChange={importData} style={{ display: 'none' }} />
            </label>
            <Button variant="danger" icon="trash" onClick={reset}>Reset to starter data</Button>
          </div>
        </Section>
      </div>
    </div>
  )
}

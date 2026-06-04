import { useState } from 'react'
import type { AppState, Contrib } from '../types'
import type { Updater } from '../lib/store'
import { fetchUserPRs } from '../lib/github'
import { fmtDate } from '../lib/date'
import { Badge, Button, Card, PageHeader, StatCard } from '../components/ui'
import { Bars } from '../components/charts'
import type { BarDatum } from '../components/charts'
import { Icon } from '../components/Icon'
import { RowActions, STATUS_META, chip } from '../components/shared'

function monthlyContribs(state: AppState): BarDatum[] {
  const out: BarDatum[] = []
  const now = new Date()
  for (let m = 11; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1)
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
    const count = state.contribs.filter((c) => c.date.slice(0, 7) === key).length
    out.push({ label: d.toLocaleDateString('en-US', { month: 'short' })[0], full: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) + ' · ' + count + ' PRs', value: count })
  }
  return out
}

export function Contributions({ state, update, openContribModal }: {
  state: AppState; update: Updater; openContribModal: (c: Contrib | null) => void
}) {
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const del = (id: string) => update((s) => { s.contribs = s.contribs.filter((c) => c.id !== id); return s })
  const rows = state.contribs.filter((c) => filter === 'all' || c.status === filter).sort((a, b) => b.date.localeCompare(a.date))
  const merged = state.contribs.filter((c) => c.status === 'merged').length
  const open = state.contribs.filter((c) => c.status === 'submitted' || c.status === 'changes').length
  const projects = new Set(state.contribs.map((c) => c.project)).size

  async function sync() {
    if (!state.profile.username.trim()) { setMsg({ ok: false, text: 'Add your GitHub username in Settings first.' }); return }
    setSyncing(true); setMsg(null)
    try {
      const res = await fetchUserPRs(state.profile.username, state.profile.githubToken, state.profile.mainProject)
      update((s) => {
        const urls = new Set(s.contribs.map((c) => c.url))
        res.contribs.forEach((pr) => {
          const idx = s.contribs.findIndex((c) => c.id === pr.id)
          if (idx >= 0) s.contribs[idx] = { ...s.contribs[idx], ...pr, main: s.contribs[idx].main || pr.main }
          else if (!urls.has(pr.url)) s.contribs.unshift(pr)
        })
        return s
      })
      const repos = new Set(res.contribs.map((c) => c.project)).size
      setMsg({ ok: true, text: `Synced @${state.profile.username} — ${res.contribs.length} PR${res.contribs.length === 1 ? '' : 's'}${res.truncated ? ` of ${res.total} (first 100)` : ''} across ${repos} repos.` })
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Sync failed.' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <PageHeader icon="contribs" title="Contributions" subtitle="Proof-of-work, one PR at a time" accent="var(--track-rfl)"
        action={<div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" icon="sync" onClick={sync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync GitHub'}</Button>
          <Button icon="plus" onClick={() => openContribModal(null)}>Add</Button>
        </div>} />
      {msg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px', borderRadius: 14, fontWeight: 600, fontSize: 13.5,
          background: msg.ok ? 'var(--accent-soft)' : 'color-mix(in srgb, var(--danger) 14%, transparent)', color: msg.ok ? 'var(--accent-deep)' : 'var(--danger)' }}>
          <Icon name={msg.ok ? 'check' : 'x'} size={17} /> <span style={{ flex: 1 }}>{msg.text}</span>
          <button onClick={() => setMsg(null)} aria-label="Dismiss" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'grid', placeItems: 'center' }}><Icon name="x" size={15} /></button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <StatCard label="Merged" value={merged} sub="accepted PRs" icon="merge" accent="var(--success)" />
        <StatCard label="Open" value={open} sub="in review" icon="contribs" accent="var(--warn)" />
        <StatCard label="Projects" value={projects} sub="repos touched" icon="roadmap" accent="var(--track-rfl)" />
        <StatCard label="Main project" value={state.contribs.filter((c) => c.main).length} sub={state.profile.mainProject} icon="spark" accent="var(--accent)" />
      </div>
      <Card>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 14 }}>Contributions / month</div>
        <Bars data={monthlyContribs(state)} height={150} color="var(--track-rfl)" />
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>Activity log</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'merged', 'submitted', 'changes'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={chip(filter === f)}>{f === 'all' ? 'All' : (STATUS_META[f]?.label || f)}</button>
            ))}
          </div>
        </div>
        {rows.map((c) => {
          const sm = STATUS_META[c.status] || { label: c.status, color: 'var(--muted)' }
          return (
            <div key={c.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--line)', borderLeft: c.main ? '3px solid var(--accent)' : '3px solid transparent', paddingLeft: 10, marginLeft: -10 }}>
              <span className="tabular" style={{ fontSize: 11.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)', width: 44, flexShrink: 0 }}>{fmtDate(c.date)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c.main && <span title="main project" style={{ color: 'var(--accent)' }}>★</span>}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</span>
                  {c.url && c.url !== '#'
                    ? <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--faint)', flexShrink: 0, display: 'grid', placeItems: 'center' }}><Icon name="link" size={13} /></a>
                    : <Icon name="link" size={13} style={{ color: 'var(--faint)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{c.project}</div>
              </div>
              <Badge color={sm.color} dot>{sm.label}</Badge>
              <RowActions onEdit={() => openContribModal(c)} onDelete={() => del(c.id)} />
            </div>
          )
        })}
      </Card>
    </div>
  )
}

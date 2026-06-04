// modals.tsx — quick-add + edit modals and the celebration toast.

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Contrib, ContribStatus, ContribType, Goal, ReadingItem, ReadingStatus, TrackId } from '../types'
import { Adrak } from './Adrak'
import { Button, Field, Input, Modal, Select, Switch, Textarea, inputStyle } from './ui'
import { chip, kbdStyle, STATUS_META } from './shared'
import { TRACKS } from '../lib/calc'
import { todayISO } from '../lib/date'

export interface LogInput { track: TrackId; desc: string; hours: number }
export type ContribForm = { id?: string; date: string; project: string; title: string; url: string; type: ContribType; status: ContribStatus; main: boolean }
export type ReadingForm = { id?: string; title: string; url: string; track: TrackId; format: string; total: number; done: number; status: ReadingStatus }
export type GoalForm = { id?: string; title: string; notes: string; date: string; done: boolean }

/* ---------------- Log study ---------------- */
export function LogModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (v: LogInput) => void }) {
  const [track, setTrack] = useState<TrackId>('rust')
  const [desc, setDesc] = useState('')
  const [hours, setHours] = useState(1)
  useEffect(() => { if (open) { setTrack('rust'); setDesc(''); setHours(1) } }, [open])
  const save = () => onSave({ track, desc: desc.trim() || 'Study session', hours })
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, track, desc, hours])
  return (
    <Modal open={open} onClose={onClose} title="Log study time">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 12px', borderRadius: 13, background: 'var(--accent-soft)', color: 'var(--accent-deep)', fontSize: 13, fontWeight: 600 }}>
        <Adrak size={40} mood="cheer" bob={false} /> Logging today keeps your streak alive 🔥
      </div>
      <Field label="Track">
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.values(TRACKS).map((t) => (
            <button key={t.id} onClick={() => setTrack(t.id)} style={{
              flex: 1, padding: '9px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 12.5, fontFamily: 'var(--font-body)',
              border: track === t.id ? `2px solid ${t.color}` : '1px solid var(--line)',
              background: track === t.id ? `color-mix(in srgb, ${t.color} 14%, transparent)` : 'var(--surface-2)',
              color: track === t.id ? t.color : 'var(--muted)',
            }}>{t.name}</button>
          ))}
        </div>
      </Field>
      <Field label="What did you work on?"><Input autoFocus value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Ch.16 fearless concurrency" /></Field>
      <Field label="How long?">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0.5, 1, 1.5, 2, 3].map((h) => (
            <button key={h} onClick={() => setHours(h)} style={{ ...chip(hours === h), padding: '8px 15px', fontSize: 13.5 }}>{h}h</button>
          ))}
          <input type="number" step="0.5" min="0" value={hours} onChange={(e) => setHours(+e.target.value)} style={{ ...inputStyle, width: 80 }} />
        </div>
      </Field>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button icon="check" onClick={save}>Log it <kbd style={{ ...kbdStyle, background: 'rgba(255,255,255,0.25)' }}>⌘↵</kbd></Button>
      </div>
    </Modal>
  )
}

/* ---------------- Contribution ---------------- */
export function ContribModal({ item, open, onClose, onSave }: { item?: Contrib | null; open: boolean; onClose: () => void; onSave: (f: ContribForm) => void }) {
  const [f, setF] = useState<ContribForm>({ date: todayISO(), project: '', title: '', url: '', type: 'pr', status: 'submitted', main: false })
  useEffect(() => {
    setF(item ? { ...item } : { date: todayISO(), project: '', title: '', url: '', type: 'pr', status: 'submitted', main: false })
  }, [item, open])
  const up = <K extends keyof ContribForm>(k: K, v: ContribForm[K]) => setF((p) => ({ ...p, [k]: v }))
  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit contribution' : 'Add contribution'}>
      <Field label="Title"><Input autoFocus value={f.title} onChange={(e) => up('title', e.target.value)} placeholder="docs: clarify Vec::drain panics" /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Project"><Input value={f.project} onChange={(e) => up('project', e.target.value)} placeholder="rust-lang/rust" /></Field>
        <Field label="Date"><Input type="date" value={f.date} onChange={(e) => up('date', e.target.value)} /></Field>
      </div>
      <Field label="Link"><Input value={f.url} onChange={(e) => up('url', e.target.value)} placeholder="https://github.com/…/pull/123" /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Type"><Select value={f.type} onChange={(e) => up('type', e.target.value as ContribType)}><option value="pr">Pull request</option><option value="issue">Issue</option></Select></Field>
        <Field label="Status"><Select value={f.status} onChange={(e) => up('status', e.target.value as ContribStatus)}>{['submitted', 'changes', 'merged', 'rejected'].map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}</Select></Field>
      </div>
      <Switch checked={!!f.main} onChange={(v) => up('main', v)} label="Main project (star it)" />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button icon="check" onClick={() => onSave(f)} disabled={!f.title}>Save</Button>
      </div>
    </Modal>
  )
}

/* ---------------- Reading ---------------- */
export function ReadingModal({ item, open, onClose, onSave }: { item?: ReadingItem | null; open: boolean; onClose: () => void; onSave: (f: ReadingForm) => void }) {
  const [f, setF] = useState<ReadingForm>({ title: '', url: '', track: 'rust', format: 'Book', total: 10, done: 0, status: 'todo' })
  useEffect(() => {
    setF(item ? { ...item } : { title: '', url: '', track: 'rust', format: 'Book', total: 10, done: 0, status: 'todo' })
  }, [item, open])
  const up = <K extends keyof ReadingForm>(k: K, v: ReadingForm[K]) => setF((p) => ({ ...p, [k]: v }))
  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit book' : 'Add to reading list'}>
      <Field label="Title"><Input autoFocus value={f.title} onChange={(e) => up('title', e.target.value)} /></Field>
      <Field label="Link"><Input value={f.url} onChange={(e) => up('url', e.target.value)} placeholder="https://…" /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Track"><Select value={f.track} onChange={(e) => up('track', e.target.value as TrackId)}>{Object.values(TRACKS).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></Field>
        <Field label="Format"><Select value={f.format} onChange={(e) => up('format', e.target.value)}>{['Book', 'Docs', 'Guide', 'Course', 'Article'].map((x) => <option key={x}>{x}</option>)}</Select></Field>
        <Field label="Chapters"><Input type="number" min="1" value={f.total} onChange={(e) => up('total', +e.target.value)} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button icon="check" onClick={() => onSave(f)} disabled={!f.title}>Save</Button>
      </div>
    </Modal>
  )
}

/* ---------------- Goal ---------------- */
export function GoalModal({ item, open, onClose, onSave }: { item?: Goal | null; open: boolean; onClose: () => void; onSave: (f: GoalForm) => void }) {
  const [f, setF] = useState<GoalForm>({ title: '', notes: '', date: todayISO(), done: false })
  useEffect(() => {
    setF(item ? { ...item } : { title: '', notes: '', date: todayISO(), done: false })
  }, [item, open])
  const up = <K extends keyof GoalForm>(k: K, v: GoalForm[K]) => setF((p) => ({ ...p, [k]: v }))
  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit goal' : 'Add a goal'}>
      <Field label="Goal"><Input autoFocus value={f.title} onChange={(e) => up('title', e.target.value)} placeholder="Ship a merged PR to rust-lang/rust" /></Field>
      <Field label="Notes"><Textarea value={f.notes} onChange={(e) => up('notes', e.target.value)} placeholder="Why it matters / next step" /></Field>
      <Field label="Target date"><Input type="date" value={f.date} onChange={(e) => up('date', e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button icon="check" onClick={() => onSave(f)} disabled={!f.title}>Save</Button>
      </div>
    </Modal>
  )
}

/* ---------------- Celebration toast ---------------- */
export function Toast({ data, onDone }: { data: { title: string; body: string } | null; onDone: () => void }) {
  useEffect(() => { if (!data) return; const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [data, onDone])
  if (!data) return null
  return createPortal(
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 18, padding: '12px 18px 12px 12px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 18px 40px -16px rgba(0,0,0,0.4)', animation: 'slide-up .4s cubic-bezier(.22,1,.36,1)' }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center' }}><Adrak size={40} mood="cheer" bob={false} /></div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{data.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{data.body}</div>
      </div>
    </div>,
    document.body,
  )
}

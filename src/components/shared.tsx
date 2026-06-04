// shared.tsx — small style constants + RowActions used across pages.

import type { CSSProperties } from 'react'
import { Icon } from './Icon'

export const kbdStyle: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: 5, marginLeft: 2 }
export const linkBtn: CSSProperties = { background: 'none', border: 'none', color: 'var(--accent-deep)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-display)', padding: 0 }
export const linkBtn2: CSSProperties = { background: 'none', border: 'none', color: 'var(--accent-deep)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', padding: '4px 0', whiteSpace: 'nowrap' }
export const iconBtn: CSSProperties = { width: 30, height: 30, borderRadius: 9, border: 'none', background: 'var(--surface-2)', color: 'var(--muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }
export const stepBtn: CSSProperties = { width: 30, height: 30, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--text)', cursor: 'pointer', fontSize: 17, fontWeight: 700, display: 'grid', placeItems: 'center', lineHeight: 1 }

export const chip = (active: boolean): CSSProperties => ({
  padding: '5px 11px', borderRadius: 999, border: '1px solid var(--line)', cursor: 'pointer', whiteSpace: 'nowrap',
  fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)',
  background: active ? 'var(--accent)' : 'var(--surface-2)', color: active ? 'var(--on-accent)' : 'var(--muted)',
})

export const checkBtn = (done: boolean, color: string): CSSProperties => ({
  width: 22, height: 22, borderRadius: 7, flexShrink: 0, cursor: 'pointer',
  border: done ? 'none' : '2px solid var(--line)', background: done ? color : 'var(--surface-2)', color: '#fff',
  display: 'grid', placeItems: 'center', transition: 'all .15s',
})

export const STATUS_META: Record<string, { label: string; color: string }> = {
  merged: { label: 'Merged', color: 'var(--success)' },
  accepted: { label: 'Accepted', color: 'var(--success)' },
  submitted: { label: 'Submitted', color: 'var(--info)' },
  changes: { label: 'Changes req.', color: 'var(--warn)' },
  rejected: { label: 'Closed', color: 'var(--danger)' },
  draft: { label: 'Draft', color: 'var(--muted)' },
}

export function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="row-actions" style={{ display: 'flex', gap: 4 }}>
      {onEdit && <button onClick={onEdit} title="Edit" style={iconBtn}><Icon name="pencil" size={15} /></button>}
      {onDelete && <button onClick={onDelete} title="Delete" style={{ ...iconBtn, color: 'var(--danger)' }}><Icon name="trash" size={15} /></button>}
    </div>
  )
}

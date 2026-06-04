// ui.tsx — themed primitives. All styled inline via CSS variables.

import { useEffect, useState } from 'react'
import type {
  ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, MouseEvent,
  ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

/* ---------------- Card ---------------- */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  pad?: number
}
export function Card({ children, style, hover, onClick, pad = 18, ...rest }: CardProps) {
  const [h, setH] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 22, padding: pad,
        transition: 'transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, border-color .18s',
        ...(hover && h ? { transform: 'translateY(-2px)', borderColor: 'var(--accent)', boxShadow: '0 14px 30px -20px var(--shadow)' } : {}),
        cursor: onClick ? 'pointer' : 'default', ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ---------------- Button ---------------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warm'
type Size = 'sm' | 'md' | 'icon'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: string
}
export function Button({ children, variant = 'primary', size = 'md', icon, style, ...rest }: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-display)', fontWeight: 600, border: '1px solid transparent', cursor: 'pointer',
    borderRadius: 13, transition: 'transform .12s, background .15s, box-shadow .15s', whiteSpace: 'nowrap',
    fontSize: size === 'sm' ? 13 : 15, padding: size === 'icon' ? 0 : size === 'sm' ? '7px 13px' : '10px 18px',
    width: size === 'icon' ? 38 : undefined, height: size === 'icon' ? 38 : undefined,
  }
  const variants: Record<Variant, CSSProperties> = {
    primary: { background: 'var(--accent)', color: 'var(--on-accent)', boxShadow: '0 8px 18px -10px var(--accent)' },
    secondary: { background: 'var(--surface-2)', color: 'var(--text)', borderColor: 'var(--line)' },
    ghost: { background: 'transparent', color: 'var(--muted)' },
    danger: { background: 'color-mix(in srgb, var(--danger) 14%, transparent)', color: 'var(--danger)' },
    warm: { background: 'var(--cat)', color: '#fff', boxShadow: '0 8px 18px -10px var(--cat)' },
  }
  const press = (v: string) => (e: MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = v }
  return (
    <button
      {...rest}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={press('scale(0.96)')}
      onMouseUp={press('scale(1)')}
      onMouseLeave={press('scale(1)')}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </button>
  )
}

/* ---------------- Badge ---------------- */
export function Badge({ children, color = 'var(--muted)', dot, soft = true, style }: {
  children: ReactNode; color?: string; dot?: boolean; soft?: boolean; style?: CSSProperties
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700,
      fontFamily: 'var(--font-mono)', padding: '3px 9px', borderRadius: 999, color, whiteSpace: 'nowrap',
      background: soft ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
      border: soft ? `1px solid color-mix(in srgb, ${color} 30%, transparent)` : 'none', ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: color }} />}
      {children}
    </span>
  )
}

/* ---------------- Progress ---------------- */
export function ProgressBar({ value, color = 'var(--accent)', height = 11, track = 'var(--accent-soft)', glow }: {
  value: number; color?: string; height?: number; track?: string; glow?: boolean
}) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, value * 100))}%`, height: '100%', borderRadius: 999,
        background: `linear-gradient(90deg, color-mix(in srgb, ${color} 70%, white), ${color})`,
        boxShadow: glow ? `0 0 12px ${color}` : 'none', transition: 'width .7s cubic-bezier(.22,1,.36,1)',
      }} />
    </div>
  )
}

export function Ring({ value, size = 76, stroke = 9, color = 'var(--accent)', track = 'var(--accent-soft)', children }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode
}) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - value)} style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}

/* ---------------- StatCard ---------------- */
export function StatCard({ label, value, sub, icon, accent = 'var(--accent)' }: {
  label: string; value: ReactNode; sub?: ReactNode; icon: string; accent?: string
}) {
  return (
    <Card pad={15} style={{ borderRadius: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}>
          <Icon name={icon} size={17} />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 27, lineHeight: 1, color: 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 5, fontWeight: 600 }}>{sub}</div>}
    </Card>
  )
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, footer, width = 460 }: {
  open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; width?: number
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'grid', placeItems: 'center', padding: 16, background: 'color-mix(in srgb, var(--bg) 55%, rgba(0,0,0,0.55))', backdropFilter: 'blur(8px)', animation: 'fade-in .2s ease' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: width, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 24, boxShadow: '0 30px 70px -30px rgba(0,0,0,0.6)', animation: 'slide-up .35s cubic-bezier(.22,1,.36,1)', overflow: 'hidden' }}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '17px 20px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--text)', whiteSpace: 'nowrap' }}>{title}</h3>
            <button onClick={onClose} aria-label="Close" style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--muted)' }}><Icon name="x" size={17} /></button>
          </div>
        )}
        <div style={{ padding: 20 }}>{children}</div>
        {footer && <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'var(--surface-2)' }}>{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

/* ---------------- Form fields ---------------- */
export function Field({ label, children, hint }: { label?: ReactNode; children: ReactNode; hint?: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>}
      {children}
      {hint && <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 5 }}>{hint}</div>}
    </label>
  )
}

export const inputStyle: CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: 12, border: '1px solid var(--line)',
  background: 'var(--surface-2)', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }} />
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', minHeight: 70, ...props.style }} />
}
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputStyle, cursor: 'pointer', ...props.style }}>{children}</select>
}

/* ---------------- Switch ---------------- */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
      <span style={{ width: 42, height: 25, borderRadius: 999, background: checked ? 'var(--accent)' : 'var(--line)', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 20 : 3, width: 19, height: 19, borderRadius: 999, background: '#fff', transition: 'left .2s cubic-bezier(.22,1,.36,1)', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
      </span>
      {label}
    </button>
  )
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: ReactNode; action?: ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '38px 20px' }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent-soft)', color: 'var(--accent-deep)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
        <Icon name={icon} size={26} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6, maxWidth: 320, marginInline: 'auto', lineHeight: 1.5 }}>{body}</div>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}

/* ---------------- PageHeader ---------------- */
export function PageHeader({ icon, title, subtitle, accent = 'var(--accent)', action }: {
  icon: string; title: string; subtitle?: ReactNode; accent?: string; action?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 4, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}>
          <Icon name={icon} size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 25, letterSpacing: '-0.4px', color: 'var(--text)' }}>{title}</h1>
          {subtitle && <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--muted)', fontWeight: 500 }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

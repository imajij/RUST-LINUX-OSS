// Markdown.tsx — a tiny, dependency-free renderer for note prose. Supports
// paragraphs, **bold**, *italic*, "- "/"* " bullets, "1. " numbered lists,
// "> " blockquotes, and "## ".."#### " subheadings. Code is rendered separately
// (note bodies never contain code), so no backtick/fence handling is needed.

import type { CSSProperties, ReactNode } from 'react'

const pStyle: CSSProperties = { margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--text)' }
const liStyle: CSSProperties = { fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)' }
const listStyle: CSSProperties = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 5 }
const quoteStyle: CSSProperties = { margin: 0, borderLeft: '3px solid var(--accent)', padding: '6px 12px', background: 'var(--surface-2)', borderRadius: 8, color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }
const headStyle = (lvl: number): CSSProperties => ({ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: lvl <= 2 ? 16 : lvl === 3 ? 14.5 : 13.5, color: 'var(--text)', marginTop: 4 })

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] != null) out.push(<strong key={k++}>{m[1]}</strong>)
    else out.push(<em key={k++}>{m[2]}</em>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const SPECIAL = /^(#{2,4}\s|>|[-*]\s|\d+\.\s)/

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    const h = line.match(/^(#{2,4})\s+(.*)$/)
    if (h) { blocks.push(<div key={key++} style={headStyle(h[1].length)}>{inline(h[2])}</div>); i++; continue }

    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++ }
      blocks.push(<blockquote key={key++} style={quoteStyle}>{inline(buf.join(' '))}</blockquote>)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s+/, '')); i++ }
      blocks.push(<ul key={key++} style={listStyle}>{items.map((it, n) => <li key={n} style={liStyle}>{inline(it)}</li>)}</ul>)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++ }
      blocks.push(<ol key={key++} style={listStyle}>{items.map((it, n) => <li key={n} style={liStyle}>{inline(it)}</li>)}</ol>)
      continue
    }

    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !SPECIAL.test(lines[i])) { buf.push(lines[i]); i++ }
    blocks.push(<p key={key++} style={pStyle}>{inline(buf.join(' '))}</p>)
  }
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{blocks}</div>
}

// confetti.ts — juicy celebration burst. Pure DOM, no deps.

export function fireConfetti(opts: { count?: number; x?: number; y?: number } = {}) {
  const n = opts.count || 90
  const colors = ['var(--accent)', '#FFA85C', '#FF9DB0', '#38BDF8', '#A78BFA', '#FBBF24']
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(wrap)
  const ox = opts.x != null ? opts.x : window.innerWidth / 2
  const oy = opts.y != null ? opts.y : window.innerHeight * 0.4
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div')
    const c = colors[i % colors.length]
    const sz = 6 + Math.random() * 8
    p.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${sz}px;height:${sz * 0.6}px;background:${c};border-radius:2px;`
    wrap.appendChild(p)
    const ang = Math.random() * Math.PI * 2
    const vel = 6 + Math.random() * 9
    const dx = Math.cos(ang) * vel * (8 + Math.random() * 8)
    const dy = Math.sin(ang) * vel * (8 + Math.random() * 8) - 120
    const rot = Math.random() * 720 - 360
    p.animate(
      [
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 400}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 600, easing: 'cubic-bezier(.2,.6,.3,1)' },
    )
  }
  setTimeout(() => wrap.remove(), 2000)
}

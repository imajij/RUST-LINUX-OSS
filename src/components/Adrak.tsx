// Adrak — the orange tabby cat mascot. moods: happy | sleepy | cheer | wave.

type Mood = 'happy' | 'sleepy' | 'cheer' | 'wave'

interface AdrakProps {
  size?: number
  mood?: Mood
  level?: number
  bob?: boolean
}

export function Adrak({ size = 72, mood = 'happy', bob = true }: AdrakProps) {
  const cheer = mood === 'cheer'
  const sleepy = mood === 'sleepy'
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        animation: bob ? `float-y ${cheer ? '0.6s' : '3.6s'} ease-in-out infinite` : 'none',
      }}
    >
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <defs>
          <linearGradient id="adrak-fur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFA85C" />
            <stop offset="1" stopColor="#F47A2B" />
          </linearGradient>
        </defs>
        {/* tail */}
        <path
          d="M58 60 q16 2 14 -14"
          stroke="#F47A2B"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          style={{ transformOrigin: '60px 58px', animation: cheer ? 'tail-wag 0.5s ease-in-out infinite' : 'tail-wag 3s ease-in-out infinite' }}
        />
        {/* ears */}
        <path d="M16 30 L20 9 L36 24 Z" fill="url(#adrak-fur)" />
        <path d="M64 30 L60 9 L44 24 Z" fill="url(#adrak-fur)" />
        <path d="M20 26 L22 14 L30 23 Z" fill="#FFD3A6" />
        <path d="M60 26 L58 14 L50 23 Z" fill="#FFD3A6" />
        {/* head */}
        <path d="M40 18 C58 18 64 32 62 46 C60 60 52 66 40 66 C28 66 20 60 18 46 C16 32 22 18 40 18 Z" fill="url(#adrak-fur)" />
        {/* tabby stripes */}
        <path d="M40 18 v9 M31 21 l2 8 M49 21 l-2 8" stroke="#E26A1C" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* muzzle */}
        <path d="M40 40 C50 40 56 45 55 51 C54 59 48 63 40 63 C32 63 26 59 25 51 C24 45 30 40 40 40 Z" fill="#FFF3E4" />
        {/* eyes */}
        {sleepy ? (
          <g stroke="#3A2412" strokeWidth="2.4" strokeLinecap="round">
            <path d="M27 41 q5 3 10 0" />
            <path d="M43 41 q5 3 10 0" />
          </g>
        ) : (
          <g>
            <ellipse cx="31" cy="41" rx="4" ry={cheer ? 2 : 5} fill="#3A2412" style={{ animation: 'blink 5s infinite', transformOrigin: '31px 41px' }} />
            <ellipse cx="49" cy="41" rx="4" ry={cheer ? 2 : 5} fill="#3A2412" style={{ animation: 'blink 5s infinite', transformOrigin: '49px 41px' }} />
            {!cheer && (
              <>
                <circle cx="32.6" cy="39.4" r="1.3" fill="#fff" />
                <circle cx="50.6" cy="39.4" r="1.3" fill="#fff" />
              </>
            )}
          </g>
        )}
        {/* nose + mouth */}
        <path d="M37 48 h6 l-3 3 z" fill="#E26A1C" />
        <path d="M40 51 v2 M40 53 q-3 2.5 -6 1 M40 53 q3 2.5 6 1" stroke="#9A5520" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* whiskers */}
        <path d="M25 47 l-9 -2 M25 51 l-9 2 M55 47 l9 -2 M55 51 l9 2" stroke="#C98A4E" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
        {/* blush */}
        <circle cx="26" cy="50" r="3" fill="#FF9DB0" opacity="0.55" />
        <circle cx="54" cy="50" r="3" fill="#FF9DB0" opacity="0.55" />
        {sleepy && <text x="60" y="20" fontSize="11" fill="var(--muted)" fontFamily="JetBrains Mono">z</text>}
      </svg>
    </div>
  )
}

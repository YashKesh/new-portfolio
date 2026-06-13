import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * TacScan Radar HUD — skills appear as blips on a tactical radar.
 * Visually distinct from the SkillsGalaxy (orbital 3D scene).
 */

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export default function SkillRadar({ skills, active, onSelect }) {
  const [sweep, setSweep] = useState(0)
  const rafRef = useRef()
  const t0 = useRef(performance.now())

  // Deterministic per-skill polar coords + sweep-pass moments
  const blips = useMemo(() => {
    return skills.map((label, i) => {
      const h = hash(label + i)
      const angle = ((h % 360) + (i * 23) % 360) % 360
      const range = 28 + ((h >> 8) % 60) // between 28 and 88 of 100
      const rad = (angle * Math.PI) / 180
      return {
        label,
        angle,
        range,
        x: Math.cos(rad) * range,
        y: Math.sin(rad) * range,
      }
    })
  }, [skills])

  useEffect(() => {
    const tick = (now) => {
      const t = (now - t0.current) / 1000
      // 360° in 5 seconds
      setSweep((t * 72) % 360)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Decide which blip is currently "lit" by the sweep
  const isLit = (blipAngle) => {
    const diff = (sweep - blipAngle + 360) % 360
    return diff < 28 // lingering glow over 28 deg of recent sweep
  }
  const litStrength = (blipAngle) => {
    const diff = (sweep - blipAngle + 360) % 360
    if (diff > 28) return 0
    return 1 - diff / 28
  }

  const ringRadii = [25, 50, 75, 95]

  return (
    <div className="radar-wrap">
      <svg viewBox="-110 -110 220 220" className="radar-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(0,40,80,0.45)" />
            <stop offset="100%" stopColor="rgba(0,10,30,0)" />
          </radialGradient>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(0,240,255,0.55)" />
            <stop offset="60%"  stopColor="rgba(0,240,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </linearGradient>
          <filter id="blipGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* radar background disc */}
        <circle cx="0" cy="0" r="100" fill="url(#radarBg)" />
        <circle cx="0" cy="0" r="100" className="radar-edge" />

        {/* range rings */}
        {ringRadii.map((r) => (
          <g key={r}>
            <circle cx="0" cy="0" r={r} className="radar-ring" />
            <text x={r + 2} y="-2" className="radar-rangetext">{r}m</text>
          </g>
        ))}

        {/* radial guides every 30° */}
        {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => {
          const rad = (a * Math.PI) / 180
          const x = Math.cos(rad) * 100
          const y = Math.sin(rad) * 100
          return <line key={a} x1="0" y1="0" x2={x} y2={y} className="radar-spoke" />
        })}

        {/* crosshair */}
        <line x1="-104" y1="0" x2="104" y2="0" className="radar-cross" />
        <line x1="0" y1="-104" x2="0" y2="104" className="radar-cross" />

        {/* sweep wedge */}
        <g style={{ transform: `rotate(${sweep}deg)`, transformOrigin: '0 0' }}>
          <path d="M0,0 L100,0 A100,100 0 0,1 76.6,64.3 Z" fill="url(#sweepGrad)" />
          <line x1="0" y1="0" x2="100" y2="0" className="radar-arm" />
        </g>

        {/* compass labels */}
        <text x="0" y="-103" className="radar-bearing">000</text>
        <text x="106" y="3" className="radar-bearing">090</text>
        <text x="0" y="110" className="radar-bearing">180</text>
        <text x="-106" y="3" className="radar-bearing">270</text>

        {/* blips */}
        {blips.map((b) => {
          const lit = isLit(b.angle)
          const s = litStrength(b.angle)
          const isActive = active === b.label
          return (
            <g
              key={b.label}
              className={`radar-blip ${isActive ? 'active' : ''} ${lit ? 'lit' : ''}`}
              onClick={() => onSelect(b.label)}
              onMouseEnter={() => onSelect(b.label)}
              style={{ cursor: 'pointer' }}
            >
              {/* sweep-triggered halo */}
              <circle
                cx={b.x}
                cy={b.y}
                r={4 + s * 5}
                className="blip-pulse"
                style={{ opacity: s * 0.85 }}
              />
              {/* blip dot */}
              <circle
                cx={b.x}
                cy={b.y}
                r={isActive ? 4 : 2.6}
                className="blip-dot"
                filter="url(#blipGlow)"
              />
              {/* lock brackets when active */}
              {isActive && (
                <g className="blip-lock">
                  <path d={`M${b.x - 7},${b.y - 4} L${b.x - 7},${b.y - 7} L${b.x - 4},${b.y - 7}`} />
                  <path d={`M${b.x + 4},${b.y - 7} L${b.x + 7},${b.y - 7} L${b.x + 7},${b.y - 4}`} />
                  <path d={`M${b.x - 7},${b.y + 4} L${b.x - 7},${b.y + 7} L${b.x - 4},${b.y + 7}`} />
                  <path d={`M${b.x + 4},${b.y + 7} L${b.x + 7},${b.y + 7} L${b.x + 7},${b.y + 4}`} />
                </g>
              )}
              <text x={b.x + 7} y={b.y + 3} className="blip-label">{b.label}</text>
            </g>
          )
        })}

        {/* center marker */}
        <circle cx="0" cy="0" r="2" className="radar-center" />
        <circle cx="0" cy="0" r="6" className="radar-center-ring" />
      </svg>

      {/* HUD corner readouts */}
      <div className="radar-corners">
        <span className="rc tl"><span className="dot" /> TACSCAN-04 · ACTIVE</span>
        <span className="rc tr">RNG 100m</span>
        <span className="rc bl">SWP {Math.round(sweep).toString().padStart(3, '0')}°</span>
        <span className="rc br">CONTACTS {skills.length}</span>
      </div>
    </div>
  )
}

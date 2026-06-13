import React, { useEffect, useState } from 'react'

const lines = [
  { t: 'booting yash.os v4.2.0...', delay: 0 },
  { t: 'mounting /modules/python @ 3.12', delay: 350, tail: 'OK' },
  { t: 'spawning fastapi workers × 4', delay: 700, tail: 'OK' },
  { t: 'connecting redis://prod.cache', delay: 1050, tail: 'OK' },
  { t: 'warming postgres pool', delay: 1400, tail: 'OK' },
  { t: 'compiling react/three.js shaders', delay: 1750, tail: 'OK' },
  { t: 'initializing neural net...', delay: 2100, tail: 'READY' },
]

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [shown, setShown] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const timers = lines.map((l, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), l.delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const start = performance.now()
    const dur = 2400
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 2.2)
      setPct(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => setFade(true), 250)
        setTimeout(() => onDone?.(), 850)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className={`loader ${fade ? 'fade-out' : ''}`}>
      <div className="loader-grid" />

      <div className="loader-core">
        <span className="loader-glyph">{'</>'}</span>
      </div>

      <div className="loader-term">
        <div className="head"><span /><span /><span /><span style={{ marginLeft: 'auto', width: 'auto', background: 'transparent', color: 'var(--ink-dim)', fontSize: 11 }}>yash@portfolio:~</span></div>
        {lines.slice(0, shown).map((l, i) => (
          <div className="line" key={i}>
            <span className="acc">$</span> {l.t}
            {l.tail && <span className="ok"> [{l.tail}]</span>}
          </div>
        ))}
        {shown < lines.length && <div className="line caret">&nbsp;</div>}
        {shown >= lines.length && <div className="line"><span className="acc">$</span> launching portfolio<span className="caret" /></div>}
      </div>

      <div className="loader-bar"><div style={{ width: `${pct}%` }} /></div>
      <div className="loader-pct">{pct.toString().padStart(3, '0')}% · loading assets</div>
    </div>
  )
}

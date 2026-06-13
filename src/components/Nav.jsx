import React, { useEffect, useState } from 'react'

const links = [
  ['home', 'Launchpad'],
  ['about', 'Pilot'],
  ['skills', 'Galaxy'],
  ['experience', 'Missions'],
  ['projects', 'Payloads'],
  ['contact', 'Comms'],
]

export default function Nav() {
  const [now, setNow] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(d.toISOString().slice(11, 19) + ' UTC')
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <nav className="nav">
      <a href="#home" className="logo">
        <span className="logo-mark">▲</span>
        <span>YK-001 · YASH.KESHARWANI</span>
      </a>
      <ul>
        {links.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`}>
              <span className="dot" /> {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="hud-clock">
        <span className="hud-blink">●</span> T+ {now}
      </div>
    </nav>
  )
}

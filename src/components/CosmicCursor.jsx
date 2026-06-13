import React, { useEffect, useRef } from 'react'

/**
 * Site-wide cosmic cursor — replaces the native arrow with a glowing
 * planet + halo rings and emits a comet trail. Grows when hovering links/buttons.
 */
export default function CosmicCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    // Don't enable on touch devices
    const isTouch = matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const cursor = cursorRef.current
    let lastEmit = 0

    const onMove = (e) => {
      if (!cursor) return
      cursor.classList.add('on')
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`

      // Hover state — bigger + magenta if over interactive element
      const target = e.target
      const interactive = target && (target.closest('a, button, [role="button"], input, select, textarea, [data-cursor-grow]'))
      cursor.classList.toggle('hover-active', !!interactive)

      // Throttle trail emit to ~30/sec
      const now = performance.now()
      if (now - lastEmit > 32) {
        lastEmit = now
        const dot = document.createElement('span')
        dot.className = 'cursor-trail'
        dot.style.left = e.clientX + 'px'
        dot.style.top  = e.clientY + 'px'
        document.body.appendChild(dot)
        setTimeout(() => dot.remove(), 700)
      }
    }
    const onLeave = () => cursor && cursor.classList.remove('on')
    const onDown  = () => cursor && cursor.classList.add('press')
    const onUp    = () => cursor && cursor.classList.remove('press')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <div ref={cursorRef} className="cosmic-cursor" aria-hidden="true">
      <span className="cc-core" />
      <span className="cc-ring" />
      <span className="cc-ring r2" />
    </div>
  )
}

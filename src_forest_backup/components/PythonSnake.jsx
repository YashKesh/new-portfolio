import React, { useEffect, useRef } from 'react'

/**
 * Python snake that slithers down the side of the page following the scroll progress.
 * Implemented in 2D canvas for performance + smooth following across all devices.
 */
export default function PythonSnake() {
  const canvasRef = useRef(null)
  const targetRef = useRef({ x: 60, y: 200 })
  const segmentsRef = useRef([])
  const rafRef = useRef()
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const N = 36
    segmentsRef.current = Array.from({ length: N }, (_, i) => ({ x: 60, y: 100 + i * 8 }))

    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const updateTarget = () => {
      const scrollY = window.scrollY
      const docH = (document.documentElement.scrollHeight - window.innerHeight) || 1
      const p = Math.min(1, Math.max(0, scrollY / docH))
      const w = window.innerWidth
      const h = window.innerHeight
      const isMobile = w < 720

      // Snake follows an S-curve down the right edge (or near right on mobile)
      const baseX = isMobile ? w - 50 : w - 90
      const amplitude = isMobile ? 30 : 70
      const wob = Math.sin(p * Math.PI * 6 + tRef.current * 0.02) * amplitude

      targetRef.current = {
        x: baseX + wob,
        y: h * 0.5 + Math.sin(p * Math.PI * 3 + tRef.current * 0.015) * (h * 0.3),
      }
    }

    const tick = () => {
      tRef.current += 1
      updateTarget()

      const segs = segmentsRef.current
      const target = targetRef.current

      // Head chases target
      const head = segs[0]
      head.x += (target.x - head.x) * 0.08
      head.y += (target.y - head.y) * 0.08

      // Body follows previous segment at fixed distance
      const SPACING = 10
      for (let i = 1; i < segs.length; i++) {
        const prev = segs[i - 1]
        const cur = segs[i]
        const dx = cur.x - prev.x
        const dy = cur.y - prev.y
        const dist = Math.hypot(dx, dy) || 1
        const ang = Math.atan2(dy, dx)
        cur.x = prev.x + Math.cos(ang) * SPACING
        cur.y = prev.y + Math.sin(ang) * SPACING
      }

      // Render
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // Body: tapered gradient stripes
      for (let i = segs.length - 1; i >= 0; i--) {
        const s = segs[i]
        const t = i / segs.length
        const r = 11 * (1 - t * 0.55)
        const hue = 145 + Math.sin(i * 0.4 + tRef.current * 0.04) * 10
        const stripe = i % 3 === 0
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        const grad = ctx.createRadialGradient(s.x - r * 0.4, s.y - r * 0.4, 0, s.x, s.y, r)
        grad.addColorStop(0, `hsla(${hue}, 70%, ${stripe ? 55 : 40}%, 0.95)`)
        grad.addColorStop(1, `hsla(${hue}, 75%, 18%, 0.9)`)
        ctx.fillStyle = grad
        ctx.fill()
        // soft outline
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Head detail
      const head0 = segs[0]
      const head1 = segs[1] || segs[0]
      const ang = Math.atan2(head0.y - head1.y, head0.x - head1.x)
      // eyes
      const ex = head0.x + Math.cos(ang + Math.PI / 2) * 4
      const ey = head0.y + Math.sin(ang + Math.PI / 2) * 4
      const ex2 = head0.x + Math.cos(ang - Math.PI / 2) * 4
      const ey2 = head0.y + Math.sin(ang - Math.PI / 2) * 4
      ctx.fillStyle = '#fff'
      ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(ex2, ey2, 2.2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath(); ctx.arc(ex, ey, 1, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(ex2, ey2, 1, 0, Math.PI * 2); ctx.fill()
      // tongue (flickers)
      if ((tRef.current % 60) < 20) {
        const tx = head0.x + Math.cos(ang) * 12
        const ty = head0.y + Math.sin(ang) * 12
        ctx.strokeStyle = '#ff4d6d'
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(head0.x + Math.cos(ang) * 9, head0.y + Math.sin(ang) * 9)
        ctx.lineTo(tx, ty)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="snake-canvas" aria-hidden="true" />
}

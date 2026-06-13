import React, { useEffect, useRef } from 'react'

/**
 * Canvas rocket — dynamic flight, smoke trail, lands inside #rocket-landing-pad.
 */
export default function Rocket() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    x: 0, y: 0, prevX: 0, prevY: 0,
    angle: -Math.PI / 2,
    particles: [],
    t: 0,
    thrust: 0,
    lastScrollY: 0,
    lastScrollTime: 0,
    scrollDir: 1,
    roll: 0,
  })
  const rafRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

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

    const st = stateRef.current
    st.x = window.innerWidth - 130
    st.y = 220
    st.prevX = st.x
    st.prevY = st.y
    st.lastScrollY = window.scrollY
    st.lastScrollTime = performance.now()

    const onScroll = () => {
      const y = window.scrollY
      if (y !== st.lastScrollY) {
        st.scrollDir = y > st.lastScrollY ? 1 : -1
        st.lastScrollY = y
        st.lastScrollTime = performance.now()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const getLandingPad = () => {
      const pad = document.getElementById('rocket-landing-pad')
      if (!pad) return null
      const r = pad.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return null
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 - 6 }
    }

    const getFlightTarget = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const isMobile = w < 720
      const scrollY = window.scrollY
      const docH = (document.documentElement.scrollHeight - window.innerHeight) || 1
      const p = Math.min(1, Math.max(0, scrollY / docH))
      const t = st.t * 0.018
      const tt = st.t * 0.05

      const baseX = isMobile ? w - 70 : w - 140
      const swing = isMobile ? 60 : 180
      // Big lateral weave + slower lateral drift across page + vertical wobble
      const x = baseX
        + Math.sin(p * Math.PI * 6 + t * 1.4) * swing
        + Math.sin(tt * 0.6) * (isMobile ? 12 : 40)
        - p * (isMobile ? 30 : 160)
      const y = h * 0.2
        + p * (h * 0.58)
        + Math.cos(p * Math.PI * 4 + t * 1.6) * 70
        + Math.sin(tt * 0.9) * 18
      return { x, y }
    }

    const tick = () => {
      st.t += 1
      const now = performance.now()
      const idleMs = now - st.lastScrollTime
      const idle = idleMs > 380
      const pad = getLandingPad()
      const wantLand = pad && idleMs > 240

      const targetThrust = wantLand ? 0 : (idle ? 0.15 : 1)
      st.thrust += (targetThrust - st.thrust) * 0.08

      st.prevX = st.x
      st.prevY = st.y

      if (wantLand) {
        st.x += (pad.x - st.x) * 0.07
        st.y += (pad.y - st.y) * 0.09
        // Upright on the pad
        let diff = (-Math.PI / 2) - st.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        st.angle += diff * 0.16
        st.roll *= 0.85
      } else {
        const flight = getFlightTarget()
        st.x += (flight.x - st.x) * 0.07
        st.y += (flight.y - st.y) * 0.07
        const dx = st.x - st.prevX
        const dy = st.y - st.prevY
        const speed = Math.hypot(dx, dy)
        const movementAngle = Math.atan2(dy, dx)
        const desiredAngle = (speed > 0.6)
          ? movementAngle
          : (st.scrollDir === -1 ? -Math.PI / 2 : Math.PI / 2)
        let diff = desiredAngle - st.angle
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        st.angle += diff * 0.13
        // Slow barrel-roll when cruising
        st.roll += (speed * 0.0025) * st.thrust
      }

      // Smoke + flame particles
      const spawn = Math.round(st.thrust * 4)
      const backDist = 36
      const bx = st.x - Math.cos(st.angle) * backDist
      const by = st.y - Math.sin(st.angle) * backDist
      for (let i = 0; i < spawn; i++) {
        const spread = (Math.random() - 0.5) * 0.85
        const ang = st.angle + Math.PI + spread
        const sp = 1.0 + Math.random() * 2.4
        st.particles.push({
          x: bx + (Math.random() - 0.5) * 6,
          y: by + (Math.random() - 0.5) * 6,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 0,
          maxLife: 55 + Math.random() * 40,
          flame: i === 0,
          size: 8 + Math.random() * 6,
        })
      }
      if (st.particles.length > 420) st.particles.splice(0, st.particles.length - 420)

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy *= 0.97
        const t = p.life / p.maxLife
        if (t >= 1) { st.particles.splice(i, 1); continue }
        const r = p.size * (1 + t * 2.0)
        if (p.flame && t < 0.3) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
          grad.addColorStop(0, `rgba(255,255,255,${0.95 * (1 - t)})`)
          grad.addColorStop(0.4, `rgba(255,182,72,${0.78 * (1 - t)})`)
          grad.addColorStop(1, `rgba(212,74,58,0)`)
          ctx.fillStyle = grad
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
          grad.addColorStop(0, `rgba(220,210,190,${0.42 * (1 - t)})`)
          grad.addColorStop(1, `rgba(50,30,80,0)`)
          ctx.fillStyle = grad
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── ROCKET ────────────────────────────────────────
      const S = 2.5 // big
      ctx.save()
      ctx.translate(st.x, st.y)
      ctx.rotate(st.angle + Math.PI / 2)
      // Subtle 3D barrel-roll: only squish on X axis (never flip Y, which was reversing the nose direction)
      const rollScale = Math.abs(Math.cos(st.roll))
      ctx.scale(S * (rollScale * 0.4 + 0.6), S)

      ctx.shadowColor = '#ffb648'
      ctx.shadowBlur = 22

      // Fuselage
      const bodyGrad = ctx.createLinearGradient(-12, 0, 12, 0)
      bodyGrad.addColorStop(0, '#7c87b8')
      bodyGrad.addColorStop(0.45, '#ffffff')
      bodyGrad.addColorStop(0.55, '#e3e8ff')
      bodyGrad.addColorStop(1, '#4a5078')
      ctx.fillStyle = bodyGrad
      ctx.beginPath()
      ctx.moveTo(0, -26)
      ctx.quadraticCurveTo(12, -12, 12, 8)
      ctx.lineTo(12, 18)
      ctx.lineTo(-12, 18)
      ctx.lineTo(-12, 8)
      ctx.quadraticCurveTo(-12, -12, 0, -26)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = 'rgba(212,74,58,0.4)'
      ctx.fillRect(-12, 2, 24, 3)

      // Nose
      ctx.shadowBlur = 14
      ctx.shadowColor = '#d44a3a'
      ctx.fillStyle = '#d44a3a'
      ctx.beginPath()
      ctx.moveTo(0, -26)
      ctx.lineTo(7, -10)
      ctx.lineTo(-7, -10)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(0, -22, 1.6, 0, Math.PI * 2)
      ctx.fill()

      // Cockpit window
      ctx.shadowBlur = 14
      ctx.shadowColor = '#ffb648'
      ctx.fillStyle = '#ffb648'
      ctx.beginPath()
      ctx.arc(0, -3, 4.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.beginPath()
      ctx.arc(-1.2, -4.4, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.arc(0, -3, 4.4, 0, Math.PI * 2)
      ctx.stroke()

      // Fins
      ctx.shadowBlur = 0
      ctx.fillStyle = '#d44a3a'
      ctx.beginPath(); ctx.moveTo(-12, 10); ctx.lineTo(-20, 22); ctx.lineTo(-12, 22); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(12, 10); ctx.lineTo(20, 22); ctx.lineTo(12, 22); ctx.closePath(); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.beginPath(); ctx.moveTo(-12, 10); ctx.lineTo(-17, 19); ctx.lineTo(-12, 19); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(12, 10); ctx.lineTo(17, 19); ctx.lineTo(12, 19); ctx.closePath(); ctx.fill()

      // Nozzle
      ctx.fillStyle = '#2a2f48'
      ctx.fillRect(-8, 18, 16, 5)
      ctx.fillStyle = '#0d101e'
      ctx.fillRect(-7, 21, 14, 2)

      // Flame (only if thrust significant)
      if (st.thrust > 0.05) {
        const flameLen = 32 * st.thrust + Math.sin(st.t * 0.6) * 4
        ctx.shadowColor = '#ffb648'
        ctx.shadowBlur = 24
        const flame = ctx.createLinearGradient(0, 23, 0, 23 + flameLen)
        flame.addColorStop(0, `rgba(255,255,255,${0.95 * st.thrust})`)
        flame.addColorStop(0.35, `rgba(255,182,72,${0.85 * st.thrust})`)
        flame.addColorStop(0.8, `rgba(212,74,58,${0.5 * st.thrust})`)
        flame.addColorStop(1, 'rgba(212,74,58,0)')
        ctx.fillStyle = flame
        ctx.beginPath()
        ctx.moveTo(-7, 23)
        ctx.quadraticCurveTo(0, 23 + flameLen, 7, 23)
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="snake-canvas" aria-hidden="true" />
}

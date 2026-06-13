import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/** Pure deep-space starfield — multiple layers for depth, no planets. */

function ForegroundStars({ count = 260 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 32
      a[i * 3 + 1] = (Math.random() - 0.5) * 20
      a[i * 3 + 2] = -4 - Math.random() * 8
    }
    return a
  }, [count])

  useFrame((s) => {
    if (!ref.current) return
    ref.current.material.opacity = 0.85 + Math.sin(s.clock.elapsedTime * 1.4) * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.12} transparent opacity={0.95} sizeAttenuation />
    </points>
  )
}

function ColoredStars({ color, count, size }) {
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3]     = (Math.random() - 0.5) * 60
      a[i * 3 + 1] = (Math.random() - 0.5) * 36
      a[i * 3 + 2] = -10 - Math.random() * 30
    }
    return a
  }, [count])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function ScrollCam() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    const scrollY = window.scrollY
    const docH = (document.documentElement.scrollHeight - window.innerHeight) || 1
    const p = scrollY / docH
    camera.position.x = Math.sin(t * 0.04) * 0.3
    camera.position.y = Math.cos(t * 0.03) * 0.15 + p * 0.4
    camera.position.z = 9 - p * 0.5
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function NeonBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#020310']} />
      <fog attach="fog" args={['#020310', 30, 80]} />
      <ambientLight intensity={0.3} />

      {/* Layered starfields for depth */}
      <Stars radius={140} depth={90} count={6000} factor={4.2} fade speed={0.6} />
      <Stars radius={70}  depth={40} count={1800} factor={2.0} fade speed={1.4} />

      <ColoredStars color="#d44a3a" count={80}  size={0.16} />
      <ColoredStars color="#ffb648" count={130} size={0.14} />
      <ColoredStars color="#d8c8a8" count={90}  size={0.15} />
      <ForegroundStars count={260} />

      <ScrollCam />
    </Canvas>
  )
}

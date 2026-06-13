import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const PALETTE = ['#00f0ff', '#ff2bd6', '#8b5cf6', '#b8ff3a', '#ffb84d', '#5b6cff']

function Asteroid({ label, index, total, active, onSelect, color }) {
  const ref = useRef()
  const angle0 = (index / total) * Math.PI * 2
  const orbitR = 2.0 + (index % 2) * 0.55
  const incline = (index % 3 - 1) * 0.25
  const speed = 0.25 + (index % 3) * 0.05

  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + angle0
    const x = Math.cos(t) * orbitR
    const z = Math.sin(t) * orbitR
    const y = Math.sin(t * 1.3) * 0.35 + incline
    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.015
      const focus = active === label ? 1.5 : 1
      ref.current.scale.setScalar(focus)
    }
  })

  const isActive = active === label

  return (
    <group ref={ref}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onSelect(label) }}
        onPointerOut={(e) => { e.stopPropagation() }}
        onClick={(e) => { e.stopPropagation(); onSelect(label) }}
      >
        <dodecahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2.5 : 1.0}
          roughness={0.45}
          metalness={0.4}
        />
      </mesh>
      <Html
        center
        distanceFactor={7}
        position={[0, 0.45, 0]}
        style={{
          pointerEvents: 'none',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 11,
          color: '#fff',
          textShadow: `0 0 8px ${color}, 0 0 14px ${color}`,
          whiteSpace: 'nowrap',
          letterSpacing: 0.6,
          opacity: isActive ? 1 : 0.9,
        }}
      >
        {label}
      </Html>
    </group>
  )
}

function OrbitLine({ r, color }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [r])
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  )
}

function CoreSphere() {
  const ref = useRef()
  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y = s.clock.elapsedTime * 0.4
    ref.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 2) * 0.05)
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.55, 3]} />
      <meshStandardMaterial color="#ffffff" emissive="#00f0ff" emissiveIntensity={2.2} roughness={0.1} />
    </mesh>
  )
}

function SceneRotator({ children }) {
  const ref = useRef()
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.05
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.12
    }
  })
  return <group ref={ref}>{children}</group>
}

function AsteroidDolly({ dollyRef }) {
  useFrame(({ camera }) => {
    if (dollyRef.current == null) return
    const delta = dollyRef.current
    if (Math.abs(delta) > 0.0001) {
      const dist = camera.position.length()
      const newDist = THREE.MathUtils.clamp(dist + delta, 2.5, 12)
      camera.position.multiplyScalar(newDist / dist)
      dollyRef.current = 0
    }
  })
  return null
}

export default function SkillAsteroids({ skills, active, onSelect }) {
  const dollyRef = useRef(0)
  const zoomIn  = () => { dollyRef.current = -0.6 }
  const zoomOut = () => { dollyRef.current =  0.6 }

  return (
    <div className="asteroid-canvas">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 2.4, 5.2], fov: 55 }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={2.4} color="#00f0ff" distance={8} />
        <pointLight position={[4, 3, 4]} intensity={0.8} color="#ff2bd6" distance={12} />
        <SceneRotator>
          <CoreSphere />
          <OrbitLine r={2.0} color="#00f0ff" />
          <OrbitLine r={2.55} color="#ff2bd6" />
          {skills.map((s, i) => (
            <Asteroid
              key={s}
              label={s}
              index={i}
              total={skills.length}
              active={active}
              onSelect={onSelect}
              color={PALETTE[i % PALETTE.length]}
            />
          ))}
        </SceneRotator>
        <AsteroidDolly dollyRef={dollyRef} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}    /* wheel won't hijack page scroll */
          enableRotate
          rotateSpeed={0.7}
          target={[0, 0, 0]}
        />
      </Canvas>
      <div className="asteroid-controls">
        <button className="zoom-btn sm" onClick={zoomIn} aria-label="Zoom in">＋</button>
        <button className="zoom-btn sm" onClick={zoomOut} aria-label="Zoom out">－</button>
      </div>
      <div className="asteroid-hint">
        <span>⤬ drag · ＋／－ to zoom · tap planet</span>
      </div>
    </div>
  )
}

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Stars, Sparkles, Trail, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../data/resume.js'

const GROUP_COLORS = {
  Languages: '#ffb648', // amber
  Backend:   '#d44a3a', // suit red
  Frontend:  '#d8c8a8', // sand
  Infra:     '#7a6dff', // cosmic purple
  Concepts:  '#ffd966', // pale gold
}

function CoreStar() {
  const ref = useRef()
  const haloRef = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.3
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04)
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.1
    }
  })
  return (
    <group>
      <pointLight intensity={3} color="#ffffff" distance={20} />
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffb648" emissiveIntensity={2.4} roughness={0.1} />
      </mesh>
      <mesh ref={haloRef}>
        <ringGeometry args={[1.1, 1.25, 64]} />
        <meshBasicMaterial color="#ffb648" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <Sparkles count={40} scale={[3, 3, 3]} size={3} color="#ffb648" speed={0.4} />
    </group>
  )
}

function SkillPlanet({ name, radius, angle, speed, inclination, color, size }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + angle
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = Math.sin(t * 1.2) * inclination
    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.rotation.y += 0.02
    }
  })

  return (
    <group ref={ref}>
      <Trail width={1.2} length={6} color={color} attenuation={(t) => t * t}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2.0 : 1.1}
            roughness={0.3}
          />
        </mesh>
      </Trail>
      <Html
        center
        distanceFactor={8}
        position={[0, size + 0.18, 0]}
        style={{
          pointerEvents: 'none',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: '#fff',
          textShadow: `0 0 8px ${color}, 0 0 14px ${color}`,
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0.92,
          transform: 'translateY(-4px)',
          letterSpacing: 0.4,
        }}
      >
        {name}
      </Html>
    </group>
  )
}

function OrbitRing({ radius, color }) {
  const points = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return arr
  }, [radius])
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.18} />
    </line>
  )
}

function GalaxyScene({ zoomTarget }) {
  const groupRef = useRef()
  useFrame((s, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = s.clock.elapsedTime * 0.04
      groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.15) * 0.08
    }
  })

  const groupNames = Object.keys(skills)
  const orbits = groupNames.map((name, gi) => {
    const radius = 2.2 + gi * 1.0
    const color = GROUP_COLORS[name] || '#00f0ff'
    const items = skills[name]
    return { name, radius, color, items, speed: 0.18 - gi * 0.02, inclination: 0.25 + gi * 0.08 }
  })

  return (
    <group ref={groupRef}>
      <CoreStar />
      {orbits.map((o, gi) => (
        <React.Fragment key={o.name}>
          <OrbitRing radius={o.radius} color={o.color} />
          {o.items.map((label, i) => {
            const angle = (i / o.items.length) * Math.PI * 2 + gi
            return (
              <SkillPlanet
                key={`${o.name}-${label}`}
                name={label}
                radius={o.radius}
                angle={angle}
                speed={o.speed}
                inclination={o.inclination}
                color={o.color}
                size={0.13 + (label.length > 6 ? 0.04 : 0.02)}
              />
            )
          })}
        </React.Fragment>
      ))}
    </group>
  )
}

// Imperatively dolly the camera in/out (no wheel — explicit buttons / pinch only)
function CameraDolly({ dollyRef }) {
  useFrame(({ camera }) => {
    if (dollyRef.current == null) return
    const delta = dollyRef.current
    if (Math.abs(delta) > 0.0001) {
      const dist = camera.position.length()
      const newDist = THREE.MathUtils.clamp(dist + delta, 4, 22)
      camera.position.multiplyScalar(newDist / dist)
      dollyRef.current = 0
    }
  })
  return null
}


export default function SkillsGalaxy() {
  const dollyRef = useRef(0)
  const containerRef = useRef(null)
  const wrapRef = useRef(null)

  const zoomIn  = () => { dollyRef.current = -1.2 }
  const zoomOut = () => { dollyRef.current =  1.2 }

  return (
    <div className="galaxy-wrap" ref={wrapRef}>
      <div className="galaxy-canvas-wrap" ref={containerRef}>
        <Canvas dpr={[1, 1.6]} camera={{ position: [0, 3.4, 9.5], fov: 55 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.25} />
          <Stars radius={40} depth={40} count={1800} factor={2.5} fade speed={1.2} />
          <GalaxyScene />
          <CameraDolly dollyRef={dollyRef} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}      /* wheel does NOT zoom — page scroll works normally */
            enableRotate
            rotateSpeed={0.6}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <div className="galaxy-controls">
        <button className="zoom-btn" onClick={zoomIn} aria-label="Zoom in">＋</button>
        <button className="zoom-btn" onClick={zoomOut} aria-label="Zoom out">－</button>
      </div>

      <div className="galaxy-hint">⤬ drag to orbit · use ＋／－ to zoom</div>

      <div className="galaxy-legend">
        {Object.keys(skills).map((g) => (
          <span
            className="chip"
            key={g}
            style={{ color: GROUP_COLORS[g], borderColor: GROUP_COLORS[g] + '66' }}
          >
            ● {g}
          </span>
        ))}
      </div>
    </div>
  )
}

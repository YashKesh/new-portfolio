import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

function PythonLogo() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.4
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
  })

  // Build a stylized python-like coiled shape using a torus knot
  return (
    <group ref={ref}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh>
          <torusKnotGeometry args={[1.1, 0.36, 200, 28, 2, 3]} />
          <MeshDistortMaterial
            color="#27ae60"
            emissive="#0e3d23"
            emissiveIntensity={0.6}
            roughness={0.25}
            metalness={0.35}
            distort={0.28}
            speed={1.5}
          />
        </mesh>
        {/* Eye */}
        <mesh position={[1.2, 0.6, 0.4]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.2} />
        </mesh>
      </Float>
    </group>
  )
}

function CodeOrbs() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  const items = ['py', '{}', '<>', 'fn', '⚡', 'db']
  return (
    <group ref={group}>
      {items.map((label, i) => {
        const a = (i / items.length) * Math.PI * 2
        const r = 2.6
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.6, Math.sin(a) * r]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#6fcf97" emissive="#6fcf97" emissiveIntensity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function HeroAvatar() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#bff0d0" />
      <pointLight position={[-4, 2, 3]} intensity={0.8} color="#00d68f" />
      <Stars radius={20} depth={20} count={400} factor={2} fade speed={1} />
      <PythonLogo />
      <CodeOrbs />
    </Canvas>
  )
}

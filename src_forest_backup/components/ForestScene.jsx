import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Tree({ position, scale = 1, hueShift = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.03
    }
  })
  const trunkColor = '#3a2418'
  const leafColor = new THREE.Color().setHSL(0.32 + hueShift, 0.55, 0.28)
  return (
    <group position={position} scale={scale} ref={ref}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.28, 1.4, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.9, 1.6, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.7, 1.3, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <coneGeometry args={[0.45, 1.0, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
    </group>
  )
}

function Fireflies({ count = 60 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = Math.random() * 8 + 0.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 1.2 + i) * 0.004
      pos[i * 3] += Math.cos(t * 0.6 + i) * 0.003
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffe680" size={0.12} transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

function Fog() {
  return <fog attach="fog" args={['#07120c', 8, 35]} />
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#0e2416" roughness={1} />
    </mesh>
  )
}

function CameraDrift() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    const scrollY = window.scrollY
    const docH = (document.documentElement.scrollHeight - window.innerHeight) || 1
    const p = scrollY / docH
    camera.position.x = Math.sin(t * 0.08) * 0.6 + p * 4
    camera.position.y = 2.2 + p * 1.2
    camera.position.z = 9 - p * 2
    camera.lookAt(p * 4, 1.2, 0)
  })
  return null
}

export default function ForestScene() {
  const trees = useMemo(() => {
    const arr = []
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2
      const radius = 8 + Math.random() * 9
      arr.push({
        position: [Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius - 4],
        scale: 0.8 + Math.random() * 1.2,
        hueShift: (Math.random() - 0.5) * 0.06,
      })
    }
    return arr
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 2.5, 9], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Fog />
      <color attach="background" args={['#07120c']} />
      <ambientLight intensity={0.35} color="#6ad19a" />
      <directionalLight position={[5, 10, 5]} intensity={0.7} color="#bff0d0" />
      <pointLight position={[0, 4, 4]} intensity={0.6} color="#7df0aa" distance={20} />
      <Ground />
      {trees.map((t, i) => <Tree key={i} {...t} />)}
      <Fireflies count={70} />
      <CameraDrift />
    </Canvas>
  )
}

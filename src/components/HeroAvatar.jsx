import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const AMBER = '#ffb648'
const RED = '#d44a3a'

/* ── Procedural Moon shader ─────────────────────────────────
 * fbm noise + crater field, Lambertian shading with terminator.
 * Zero textures: total cost ≈ a few KB of compiled GLSL. */
const moonVS = `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const moonFS = `
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  uniform vec3 uLightDir;
  uniform vec3 uRimColor;
  uniform vec3 uWarmColor;

  // hash + value noise + fbm
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
    return n;
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  // Crater field: circular dimples placed at hashed positions
  float craters(vec3 p) {
    float sum = 0.0;
    for (int i = 0; i < 4; i++) {
      float scale = 2.0 + float(i) * 1.8;
      vec3 q = p * scale;
      vec3 cell = floor(q);
      vec3 local = fract(q) - 0.5;
      // jitter cell center
      vec3 jitter = vec3(hash(cell), hash(cell + 1.7), hash(cell + 3.1)) - 0.5;
      vec3 d = local - jitter * 0.8;
      float dist = length(d);
      float r = 0.18 + hash(cell + 9.0) * 0.18;
      // crater rim + dimple
      float dimple = smoothstep(r, 0.0, dist) * 0.55;
      float rim = smoothstep(r * 1.05, r * 0.92, dist) * smoothstep(r * 0.75, r * 0.9, dist) * 0.35;
      sum += -dimple + rim;
    }
    return sum;
  }

  void main() {
    vec3 p = normalize(vPos) * 1.6;

    // Base terrain: lighter highlands, darker maria (lunar seas)
    float terrain = fbm(p);
    float maria = smoothstep(0.45, 0.62, fbm(p * 0.5 + 11.0));
    vec3 highland = vec3(0.78, 0.74, 0.68);
    vec3 mariaCol = vec3(0.32, 0.30, 0.28);
    vec3 base = mix(highland, mariaCol, maria * 0.85);

    // Fine grain
    base *= 0.85 + 0.3 * terrain;

    // Craters
    float c = craters(p);
    base = mix(base, base * 0.55, clamp(-c * 1.4, 0.0, 1.0));   // dimples darken
    base = mix(base, base * 1.35, clamp( c * 1.6, 0.0, 1.0));   // rims brighten

    // Lambert shading with a clear terminator
    vec3 N = normalize(vNormal);
    float lambert = max(dot(N, normalize(uLightDir)), 0.0);
    // Sharper terminator like the real moon
    float shading = pow(lambert, 0.85);
    vec3 lit = base * (0.06 + shading * 1.05);

    // Subtle warm tint from sun direction
    lit += uWarmColor * shading * 0.08;

    // Cosmic rim (theme accent) on shadow side
    float rim = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 3.5);
    lit += uRimColor * rim * 0.35;

    // Tiny breathing pulse just to feel alive (very subtle)
    lit *= 0.97 + 0.03 * sin(uTime * 0.6);

    gl_FragColor = vec4(lit, 1.0);
  }
`

function Moon({ radius = 1.4 }) {
  const meshRef = useRef()
  const matRef = useRef()

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: moonVS,
      fragmentShader: moonFS,
      uniforms: {
        uTime: { value: 0 },
        uLightDir: { value: new THREE.Vector3(1.0, 0.4, 0.6).normalize() },
        uRimColor: { value: new THREE.Color(AMBER) },
        uWarmColor: { value: new THREE.Color('#ffd9a8') },
      },
    })
  }, [])

  useFrame((state, dt) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.04
  })

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[radius, 96, 96]} />
    </mesh>
  )
}

function MoonGlow({ radius = 1.0 }) {
  // Sprite-style halo so it has no polygonal silhouette
  const ref = useRef()
  useFrame(({ camera }) => {
    if (ref.current) ref.current.quaternion.copy(camera.quaternion)
  })
  return (
    <mesh ref={ref}>
      <planeGeometry args={[radius * 4.5, radius * 4.5]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uColor: { value: new THREE.Color(AMBER) } }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColor;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.35, d) * 0.22;
            // hollow out the very center so the moon itself isn't washed
            a *= smoothstep(0.18, 0.45, d);
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  )
}

function SmallSatellite({ orbit = 1.7, speed = 0.5 }) {
  const ref = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)
  useFrame((_, dt) => {
    angleRef.current += dt * speed
    if (ref.current) {
      const a = angleRef.current
      ref.current.position.set(
        Math.cos(a) * orbit,
        Math.sin(a * 0.6) * 0.25,
        Math.sin(a) * orbit,
      )
      ref.current.rotation.x += dt * 0.6
      ref.current.rotation.y += dt * 0.8
    }
  })
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[0.12, 0]} />
      <meshStandardMaterial
        color="#9c958a"
        roughness={0.9}
        metalness={0.2}
        emissive={RED}
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

function OrbitRing({ radius, color, opacity = 0.25 }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius])
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function Scene() {
  const groupRef = useRef()
  useFrame((s, dt) => {
    if (groupRef.current) {
      // Gentle drift so the whole composition feels alive
      groupRef.current.position.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <MoonGlow radius={1.0} />
      <Moon radius={1.0} />
      <OrbitRing radius={1.7} color={AMBER} opacity={0.22} />
      <SmallSatellite orbit={1.7} speed={0.45} />
      <SmallSatellite orbit={1.7} speed={0.55} />
      <Sparkles count={40} scale={[4.5, 4.5, 4.5]} size={2.0} speed={0.3} color={AMBER} />
    </group>
  )
}

export default function HeroAvatar() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 5.4], fov: 38 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.18} />
      {/* Sun — main warm key light from the right */}
      <directionalLight position={[5, 3, 4]} intensity={1.3} color="#fff4d8" />
      {/* Cool back rim */}
      <pointLight position={[-3, 1, -3]} intensity={2.2} color={RED} distance={10} />
      <pointLight position={[3, -1, -3]} intensity={1.8} color={AMBER} distance={10} />

      <Stars radius={30} depth={30} count={800} factor={2.4} fade speed={1} />

      <Scene />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.7}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

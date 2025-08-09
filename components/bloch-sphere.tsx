"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls, Text } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect } from "react"
import * as THREE from "three"

type OneQubitState = { alpha: [number, number]; beta: [number, number] } // [re, im] for each

interface BlochSphereProps {
  state: OneQubitState | null
  isAnimating?: boolean
  showTrail?: boolean
}

export function BlochSphere({ state, isAnimating = false, showTrail = true }: BlochSphereProps) {
  const [previousPositions, setPreviousPositions] = useState<THREE.Vector3[]>([])

  // Calculate Bloch vector from quantum state
  const blochVector = useMemo(() => {
    if (!state) return new THREE.Vector3(0, 0, 1) // Default to |0⟩ state

    const [ar, ai] = state.alpha
    const [br, bi] = state.beta

    // Normalize the state
    const norm = Math.sqrt(ar * ar + ai * ai + br * br + bi * bi)
    if (norm === 0) return new THREE.Vector3(0, 0, 1)

    const alpha = new THREE.Vector2(ar / norm, ai / norm)
    const beta = new THREE.Vector2(br / norm, bi / norm)

    // Calculate Bloch sphere coordinates
    const alphaMag = alpha.length()
    const betaMag = beta.length()

    // Ensure we have valid amplitudes
    const theta = 2 * Math.acos(Math.min(1, Math.max(0, alphaMag)))
    const phi = Math.atan2(bi, br) - Math.atan2(ai, ar)

    // Convert to Cartesian coordinates on Bloch sphere
    const x = Math.sin(theta) * Math.cos(phi)
    const y = Math.sin(theta) * Math.sin(phi)
    const z = Math.cos(theta)

    return new THREE.Vector3(x, y, z)
  }, [state])

  // Update trail when state changes
  useEffect(() => {
    if (showTrail && blochVector) {
      setPreviousPositions(prev => {
        const newPositions = [...prev, blochVector.clone()]
        return newPositions.slice(-20) // Keep last 20 positions
      })
    }
  }, [blochVector, showTrail])

  const stateInfo = useMemo(() => {
    if (!state) return { probability0: 1, probability1: 0, phase: 0 }

    const [ar, ai] = state.alpha
    const [br, bi] = state.beta

    const prob0 = ar * ar + ai * ai
    const prob1 = br * br + bi * bi
    const total = prob0 + prob1

    return {
      probability0: total > 0 ? prob0 / total : 1,
      probability1: total > 0 ? prob1 / total : 0,
      phase: Math.atan2(bi, br) - Math.atan2(ai, ar)
    }
  }, [state])

  return (
    <div className="relative w-full h-full">
      <Canvas
        className="rounded-lg"
        camera={{ position: [2.4, 2.2, 2.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />

        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={0.4} />
        <directionalLight intensity={0.8} position={[2, 3, 4]} castShadow />
        <pointLight intensity={0.3} position={[-2, -2, -2]} color="#8B5CF6" />

        {/* Coordinate system */}
        <CoordinateSystem />

        {/* Bloch sphere wireframe */}
        <SphereWire />

        {/* Equatorial plane */}
        <EquatorialPlane />

        {/* State vector and trail */}
        {state && (
          <>
            <StateVector
              blochVector={blochVector}
              isAnimating={isAnimating}
              stateInfo={stateInfo}
            />
            {showTrail && <StateTrail positions={previousPositions} />}
          </>
        )}

        {/* Interactive controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
        />

        {/* Labels */}
        <Labels />
      </Canvas>

      {/* State information overlay */}
      <StateInfoPanel stateInfo={stateInfo} blochVector={blochVector} />
    </div>
  )
}

function CoordinateSystem() {
  return (
    <group>
      {/* X axis - Red */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 2.4, 8]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
      <mesh position={[1.3, 0, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      {/* Y axis - Green */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2.4, 8]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* Z axis - Blue */}
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2.4, 8]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      <mesh position={[0, 0, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
    </group>
  )
}

function SphereWire() {
  return (
    <group>
      {/* Main sphere wireframe */}
      <mesh>
        <sphereGeometry args={[1, 32, 16]} />
        <meshPhongMaterial
          color="#06B6D4"
          wireframe
          transparent
          opacity={0.3}
          emissive="#06B6D4"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Latitude circles */}
      {[-0.7, -0.3, 0.3, 0.7].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(1 - z * z), 0.005, 8, 32]} />
          <meshStandardMaterial color="#8B5CF6" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function EquatorialPlane() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.98, 1.02, 64]} />
      <meshStandardMaterial
        color="#F59E0B"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function StateVector({ blochVector, isAnimating, stateInfo }: {
  blochVector: THREE.Vector3
  isAnimating: boolean
  stateInfo: { probability0: number; probability1: number; phase: number }
}) {
  const vectorRef = useRef<THREE.Group>(null)
  const arrowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!vectorRef.current || !arrowRef.current) return

    // Smooth interpolation to target position
    const target = blochVector.clone()
    vectorRef.current.lookAt(target)

    // Animate if circuit is running
    if (isAnimating) {
      const pulse = 1 + 0.2 * Math.sin(clock.elapsedTime * 4)
      arrowRef.current.scale.setScalar(pulse)
    }
  })

  // Calculate vector magnitude and color based on state purity
  const magnitude = blochVector.length()
  const purity = magnitude // For pure states, this equals 1
  const vectorColor = new THREE.Color().setHSL(
    0.6 - purity * 0.2, // Hue: blue to cyan based on purity
    0.8,
    0.5 + purity * 0.3 // Brightness based on purity
  )

  return (
    <group ref={vectorRef}>
      {/* Vector shaft */}
      <mesh position={[0, magnitude / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, magnitude, 16]} />
        <meshStandardMaterial
          color={vectorColor}
          emissive={vectorColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Arrow head */}
      <mesh ref={arrowRef} position={blochVector.toArray()}>
        <coneGeometry args={[0.06, 0.18, 16]} />
        <meshStandardMaterial
          color={vectorColor}
          emissive={vectorColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Pulsing sphere at tip for emphasis */}
      <mesh position={blochVector.toArray()}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

function StateTrail({ positions }: { positions: THREE.Vector3[] }) {
  const trailRef = useRef<THREE.Line>(null)

  const trailGeometry = useMemo(() => {
    if (positions.length < 2) return null

    const points = positions.map(pos => pos.clone())
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [positions])

  if (!trailGeometry) return null

  return (
    <line ref={trailRef as any}>
      <primitive object={trailGeometry} attach="geometry" />
      <lineBasicMaterial
        color="#8B5CF6"
        transparent
        opacity={0.6}
        linewidth={2}
      />
    </line>
  )
}

function Labels() {
  return (
    <group>
      <Html position={[1.4, 0, 0]}>
        <div className="text-xs text-red-400 font-tech">|+⟩</div>
      </Html>
      <Html position={[-1.4, 0, 0]}>
        <div className="text-xs text-red-400 font-tech">|-⟩</div>
      </Html>
      <Html position={[0, 1.4, 0]}>
        <div className="text-xs text-green-400 font-tech">|i⟩</div>
      </Html>
      <Html position={[0, -1.4, 0]}>
        <div className="text-xs text-green-400 font-tech">|-i⟩</div>
      </Html>
      <Html position={[0, 0, 1.4]}>
        <div className="text-xs text-blue-400 font-tech">|0⟩</div>
      </Html>
      <Html position={[0, 0, -1.4]}>
        <div className="text-xs text-blue-400 font-tech">|1⟩</div>
      </Html>
    </group>
  )
}

function StateInfoPanel({
  stateInfo,
  blochVector
}: {
  stateInfo: { probability0: number; probability1: number; phase: number }
  blochVector: THREE.Vector3
}) {
  return (
    <div className="absolute top-2 left-2 glass-dark p-3 rounded-lg text-xs font-tech space-y-1">
      <div className="text-foreground font-semibold">Quantum State</div>
      <div className="text-blue-400">P(|0⟩) = {(stateInfo.probability0 * 100).toFixed(1)}%</div>
      <div className="text-red-400">P(|1⟩) = {(stateInfo.probability1 * 100).toFixed(1)}%</div>
      <div className="text-green-400">Phase = {(stateInfo.phase).toFixed(3)} rad</div>
      <div className="text-cyan-400">
        Bloch: ({blochVector.x.toFixed(2)}, {blochVector.y.toFixed(2)}, {blochVector.z.toFixed(2)})
      </div>
    </div>
  )
}

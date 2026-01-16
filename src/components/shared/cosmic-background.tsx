"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Floating particles that drift slowly
function ParticleField({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 12;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.75) {
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particles.positions} colors={particles.colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Energy flow stream - particles flowing along a curved path
function EnergyStream({
  color,
  points,
  speed = 1,
  particleCount = 150,
  particleSize = 0.12,
  tubeOpacity = 0.3,
  pulseSpeed = 2,
}: {
  color: string;
  points: THREE.Vector3[];
  speed?: number;
  particleCount?: number;
  particleSize?: number;
  tubeOpacity?: number;
  pulseSpeed?: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowTubeRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, [points]);

  // Main tube
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.03, 12, false);
  }, [curve]);

  // Outer glow tube
  const glowTubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.08, 12, false);
  }, [curve]);

  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      offsets[i] = Math.random();
      sizes[i] = 0.5 + Math.random() * 0.5;
      const point = curve.getPoint(offsets[i]);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }

    return { positions, sizes, offsets };
  }, [curve, particleCount]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const flowTime = time * speed * 0.15;

      for (let i = 0; i < particleCount; i++) {
        const t = (particleData.offsets[i] + flowTime) % 1;
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Pulsing effect on tubes
    if (tubeRef.current) {
      const material = tubeRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + Math.sin(time * pulseSpeed) * 0.5;
      material.opacity = tubeOpacity * (0.5 + pulse * 0.5);
    }

    if (glowTubeRef.current) {
      const material = glowTubeRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + Math.sin(time * pulseSpeed + Math.PI * 0.5) * 0.5;
      material.opacity = (tubeOpacity * 0.3) * (0.3 + pulse * 0.7);
    }
  });

  return (
    <group>
      {/* Outer glow tube */}
      <mesh ref={glowTubeRef} geometry={glowTubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={tubeOpacity * 0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core tube */}
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={tubeOpacity}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flowing particles along the stream */}
      <Points ref={particlesRef} positions={particleData.positions}>
        <PointMaterial
          transparent
          color={color}
          size={particleSize}
          sizeAttenuation
          depthWrite={false}
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// Multiple energy flows from screen edges
function EnergyFlows() {
  // Streams that snake from edge to edge - positioned in front of camera (z > 0 is closer)
  // Camera is at z=6, looking at origin, so z values of 0 to 4 are visible
  const streams = useMemo(() => [
    // Violet - Left edge to right edge, snaking through middle
    {
      color: "#a855f7",
      speed: 1.0,
      particleCount: 120,
      particleSize: 0.15,
      tubeOpacity: 0.4,
      pulseSpeed: 1.5,
      points: [
        new THREE.Vector3(-12, 1, 2),
        new THREE.Vector3(-6, -1, 3),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -1, 3),
        new THREE.Vector3(6, 1, 2),
        new THREE.Vector3(12, -1, 2),
      ],
    },
    // Gold - Top to bottom, sweeping curve
    {
      color: "#f59e0b",
      speed: 0.8,
      particleCount: 100,
      particleSize: 0.14,
      tubeOpacity: 0.35,
      pulseSpeed: 2.0,
      points: [
        new THREE.Vector3(-3, 8, 1),
        new THREE.Vector3(-1, 4, 3),
        new THREE.Vector3(2, 0, 2),
        new THREE.Vector3(-1, -4, 3),
        new THREE.Vector3(1, -8, 1),
      ],
    },
    // Cyan - Right edge to left, crossing through
    {
      color: "#06b6d4",
      speed: 1.2,
      particleCount: 100,
      particleSize: 0.12,
      tubeOpacity: 0.35,
      pulseSpeed: 1.8,
      points: [
        new THREE.Vector3(12, 3, 1),
        new THREE.Vector3(5, 0, 4),
        new THREE.Vector3(0, -2, 2),
        new THREE.Vector3(-5, 1, 4),
        new THREE.Vector3(-12, -2, 1),
      ],
    },
    // Pink - Bottom left to top right diagonal snake
    {
      color: "#ec4899",
      speed: 0.9,
      particleCount: 80,
      particleSize: 0.13,
      tubeOpacity: 0.3,
      pulseSpeed: 2.2,
      points: [
        new THREE.Vector3(-10, -6, 2),
        new THREE.Vector3(-4, -2, 4),
        new THREE.Vector3(0, 1, 2),
        new THREE.Vector3(4, 3, 4),
        new THREE.Vector3(10, 6, 2),
      ],
    },
    // Deep violet - Top right to bottom left
    {
      color: "#7c3aed",
      speed: 1.1,
      particleCount: 90,
      particleSize: 0.11,
      tubeOpacity: 0.3,
      pulseSpeed: 1.6,
      points: [
        new THREE.Vector3(8, 7, 1),
        new THREE.Vector3(3, 3, 3),
        new THREE.Vector3(-1, -1, 2),
        new THREE.Vector3(-5, -4, 3),
        new THREE.Vector3(-10, -7, 1),
      ],
    },
  ], []);

  return (
    <group>
      {streams.map((stream, index) => (
        <EnergyStream
          key={index}
          color={stream.color}
          points={stream.points}
          speed={stream.speed}
          particleCount={stream.particleCount}
          particleSize={stream.particleSize}
          tubeOpacity={stream.tubeOpacity}
          pulseSpeed={stream.pulseSpeed}
        />
      ))}
    </group>
  );
}

// Central energy orb with glow
function EnergyOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 0.5 + Math.PI) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Mystical geometric wireframe
function MysticalGeometry() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// Floating light motes that drift around
function LightMotes({ count = 50 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const motes = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002
        )
      );
    }

    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += motes.velocities[i].x;
        positions[i * 3 + 1] += motes.velocities[i].y;
        positions[i * 3 + 2] += motes.velocities[i].z;

        if (Math.abs(positions[i * 3]) > 5) motes.velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 5) motes.velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 5) motes.velocities[i].z *= -1;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={motes.positions}>
      <PointMaterial
        transparent
        color="#f59e0b"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Scene component that holds everything
function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0a12"]} />
      {/* Removed fog so energy streams are fully visible */}

      <ParticleField count={1500} />
      <EnergyFlows />
      <LightMotes count={40} />
      <EnergyOrb />
      <MysticalGeometry />
    </>
  );
}

// Main exportable component
export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function AIOrb() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={ref} args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          emissive="#4c1d95"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function Atom({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.6;
      ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    }
  });
  return (
    <Float speed={2} floatIntensity={2}>
      <group ref={ref} position={position} scale={0.6}>
        <Sphere args={[0.25, 32, 32]}>
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.8} />
        </Sphere>
        <Torus args={[0.7, 0.03, 16, 64]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.6} />
        </Torus>
        <Torus args={[0.7, 0.03, 16, 64]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.6} />
        </Torus>
        <Torus args={[0.7, 0.03, 16, 64]} rotation={[-Math.PI / 3, 0, 0]}>
          <meshStandardMaterial color="#f0abfc" emissive="#a21caf" emissiveIntensity={0.6} />
        </Torus>
      </group>
    </Float>
  );
}

function Crystal({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.8} floatIntensity={1.5} rotationIntensity={1}>
      <Icosahedron args={[0.5, 0]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} flatShading />
      </Icosahedron>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[-10, -5, -5]} intensity={0.8} color="#22d3ee" />
        <Stars radius={50} depth={50} count={1500} factor={3} saturation={0} fade speed={1} />
        <AIOrb />
        <Atom position={[-2.8, 1.4, -1]} />
        <Atom position={[2.8, -1.2, -1]} />
        <Crystal position={[-2.4, -1.6, 0.5]} color="#22d3ee" />
        <Crystal position={[2.6, 1.6, 0.5]} color="#f0abfc" />
        <Crystal position={[0, 2.3, -2]} color="#a78bfa" />
      </Suspense>
    </Canvas>
  );
}

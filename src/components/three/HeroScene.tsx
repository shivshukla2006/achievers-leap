import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/use-mobile";

function BookStack() {
  const group = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.25;
    }
  });

  const books = [
    { y: -0.9, color: "#6366f1", w: 2.2, d: 1.5, h: 0.32 },
    { y: -0.55, color: "#ec4899", w: 2.0, d: 1.4, h: 0.3 },
    { y: -0.23, color: "#06b6d4", w: 2.1, d: 1.45, h: 0.28 },
    { y: 0.06, color: "#f59e0b", w: 1.9, d: 1.35, h: 0.26 },
  ];

  return (
    <group ref={group} position={[0, 0, 0]}>
      {books.map((b, i) => (
        <group key={i} position={[Math.sin(i) * 0.05, b.y, Math.cos(i) * 0.05]} rotation={[0, i * 0.15 - 0.2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.45} metalness={0.15} />
          </mesh>
          {/* Pages */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[b.w - 0.06, b.h - 0.04, b.d - 0.06]} />
            <meshStandardMaterial color="#fafafa" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Apple on top */}
      <group position={[0, 0.45, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0.02, 0.28, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.025, 0.025, 0.16, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.32, 0]} rotation={[0, 0, -0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [3, 1.5, 5], fov: 42 }}
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.6}
          color="#fff8e7"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 2, 3]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[3, -2, 2]} intensity={0.5} color="#f0abfc" />
        <Environment preset="apartment" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <BookStack />
        </Float>

        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={3}
          color="#1e1b4b"
        />
      </Suspense>
    </Canvas>
  );
}

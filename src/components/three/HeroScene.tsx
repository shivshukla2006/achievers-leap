import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Text, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

function Logo() {
  const ref = useRef<THREE.Group>(null!);
  const star = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y += 0.004;
    if (star.current) {
      const t = state.clock.elapsedTime;
      star.current.rotation.z = t * 0.6;
      star.current.position.y = 1.85 + Math.sin(t * 2) * 0.05;
    }
  });

  // Build a 5-point star shape
  const starShape = (() => {
    const s = new THREE.Shape();
    const outer = 0.28;
    const inner = 0.12;
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  })();

  const books = [
    { y: -0.55, color: "#6366f1", w: 2.4, d: 1.5, h: 0.32 },
    { y: -0.22, color: "#ec4899", w: 2.2, d: 1.4, h: 0.3 },
    { y: 0.08, color: "#06b6d4", w: 2.0, d: 1.35, h: 0.28 },
  ];

  return (
    <group ref={ref}>
      {/* Book base stack */}
      {books.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation={[0, i * 0.12 - 0.12, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.5} metalness={0.15} />
          </mesh>
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[b.w - 0.06, b.h - 0.04, b.d - 0.06]} />
            <meshStandardMaterial color="#fafafa" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Decorative ring around the trophy */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.95, 0]}>
        <torusGeometry args={[0.95, 0.04, 16, 80]} />
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.4} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Trophy */}
      <group position={[0, 1.05, 0]}>
        {/* Cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.28, 0.6, 32]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.15} />
        </mesh>
        {/* Handles */}
        <mesh position={[0.46, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.045, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.46, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.045, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.22, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.58, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 0.1, 32]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* Glowing star */}
      <mesh ref={star} position={[0, 1.85, 0]}>
        <extrudeGeometry args={[starShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.2} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Brand text */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#1e1b4b"
      >
        Academic Achievers
      </Text>
    </group>
  );
}

export function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [3, 1.8, 5.5], fov: 42 }}
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
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

        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.45}>
          <Logo />
        </Float>

        <Sparkles count={40} scale={6} size={2} speed={0.4} color="#fde047" />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={9}
          blur={2.5}
          far={3}
          color="#1e1b4b"
        />
      </Suspense>
    </Canvas>
  );
}

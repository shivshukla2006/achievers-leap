import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Sparkles, Text3D, Center } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const NAVY = "#0A1F44";
const NAVY_DEEP = "#050f24";
const GOLD = "#FFD700";
const GOLD_DEEP = "#b8860b";
const WHITE = "#ffffff";

/* Metallic gold "A" letter built from extruded shape */
function LetterA() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Outer A outline
    s.moveTo(-0.9, -1);
    s.lineTo(-0.45, -1);
    s.lineTo(-0.28, -0.55);
    s.lineTo(0.28, -0.55);
    s.lineTo(0.45, -1);
    s.lineTo(0.9, -1);
    s.lineTo(0.18, 1);
    s.lineTo(-0.18, 1);
    s.closePath();

    // Inner triangle hole
    const hole = new THREE.Path();
    hole.moveTo(-0.16, -0.25);
    hole.lineTo(0.16, -0.25);
    hole.lineTo(0, 0.45);
    hole.closePath();
    s.holes.push(hole);
    return s;
  }, []);

  return (
    <Center disableY>
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.28,
              bevelEnabled: true,
              bevelThickness: 0.06,
              bevelSize: 0.05,
              bevelSegments: 6,
              curveSegments: 24,
            },
          ]}
        />
        <meshPhysicalMaterial
          color={GOLD}
          metalness={1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={GOLD_DEEP}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Center>
  );
}

/* Orbiting ring around the emblem */
function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.z = s.clock.elapsedTime * 0.4;
      ref.current.rotation.x = Math.PI / 2.2 + Math.sin(s.clock.elapsedTime * 0.3) * 0.08;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.55, 0.025, 32, 160]} />
      <meshPhysicalMaterial
        color={GOLD}
        metalness={1}
        roughness={0.15}
        emissive={GOLD}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

/* Glowing success star */
function Star() {
  const ref = useRef<THREE.Mesh>(null!);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const outer = 0.18;
    const inner = 0.075;
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
  }, []);

  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.elapsedTime;
      ref.current.rotation.z = t * 0.8;
      ref.current.position.x = Math.cos(t * 0.6) * 1.55;
      ref.current.position.y = 1.3 + Math.sin(t * 0.6) * 0.4;
      ref.current.position.z = Math.sin(t * 0.6) * 0.5;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <extrudeGeometry
          args={[shape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 }]}
        />
        <meshStandardMaterial
          color={WHITE}
          emissive={GOLD}
          emissiveIntensity={2.2}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>
      <pointLight color={GOLD} intensity={1.2} distance={2.5} />
    </group>
  );
}

/* Realistic book stack base */
function BookStack() {
  const books = [
    { y: -1.55, color: NAVY, w: 2.6, d: 1.7, h: 0.22, rot: -0.05 },
    { y: -1.32, color: "#13284f", w: 2.4, d: 1.6, h: 0.2, rot: 0.08 },
    { y: -1.12, color: "#1a3361", w: 2.2, d: 1.5, h: 0.18, rot: -0.04 },
  ];
  return (
    <group>
      {books.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation={[0, b.rot, 0]}>
          {/* Cover */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshPhysicalMaterial
              color={b.color}
              roughness={0.55}
              metalness={0.1}
              clearcoat={0.4}
              clearcoatRoughness={0.3}
            />
          </mesh>
          {/* Pages */}
          <mesh position={[0.025, 0, 0]}>
            <boxGeometry args={[b.w - 0.06, b.h - 0.04, b.d - 0.05]} />
            <meshStandardMaterial color="#f8f5ec" roughness={0.95} />
          </mesh>
          {/* Gold spine accent */}
          <mesh position={[0, 0, b.d / 2 + 0.001]}>
            <planeGeometry args={[b.w * 0.4, b.h * 0.3]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD_DEEP} emissiveIntensity={0.3} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* Premium gold trophy */
function Trophy() {
  return (
    <group position={[2.2, -0.85, 0.3]} rotation={[0, -0.3, 0]} scale={0.85}>
      {/* Cup */}
      <mesh castShadow>
        <cylinderGeometry args={[0.36, 0.22, 0.55, 32]} />
        <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      {/* Handles */}
      <mesh position={[0.4, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.04, 12, 24, Math.PI]} />
        <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[-0.4, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.04, 12, 24, Math.PI]} />
        <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.15} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.22, 16]} />
        <meshPhysicalMaterial color={GOLD_DEEP} metalness={1} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.1, 32]} />
        <meshPhysicalMaterial color={GOLD_DEEP} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* Whole emblem grouped + animated */
function Emblem() {
  const group = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.35) * 0.18;
    }
  });
  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.35}>
        <group position={[0, 0.2, 0]}>
          <LetterA />
          <OrbitRing />
        </group>
      </Float>
      <Star />
      <BookStack />
      <Trophy />
    </group>
  );
}

/* Parallax tilt driven by mouse */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  const { mouse } = useThree();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += (mouse.x * 0.25 - ref.current.rotation.y) * 0.05;
      ref.current.rotation.x += (-mouse.y * 0.15 - ref.current.rotation.x) * 0.05;
    }
  });
  return <group ref={ref}>{children}</group>;
}

export function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [0, 0.3, 6.2], fov: 40 }}
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {/* Cinematic lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.8}
          color="#fff5d6"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight position={[-4, 5, 3]} intensity={1.2} angle={0.6} penumbra={1} color={GOLD} />
        <pointLight position={[3, -2, 3]} intensity={0.5} color="#4d6fff" />
        <Environment preset="studio" />

        <ParallaxRig>
          <Emblem />
        </ParallaxRig>

        <Sparkles count={50} scale={[6, 4, 3]} size={2.2} speed={0.4} color={GOLD} opacity={0.9} />

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.6}
          scale={10}
          blur={2.6}
          far={3}
          color={NAVY_DEEP}
        />
      </Suspense>
    </Canvas>
  );
}

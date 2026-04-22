import { Trail, Float, Sphere, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Orbiter({
  radius,
  speed,
  tilt,
  color,
  size = 0.18,
  phase = 0,
}: {
  radius: number;
  speed: number;
  tilt: number;
  color: string;
  size?: number;
  phase?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t) * Math.tan(tilt) * radius;
    }
  });
  return (
    <group>
      <Trail width={1.2} length={5} color={color} attenuation={(w) => w * w}>
        <group ref={ref}>
          <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
              metalness={0.6}
              roughness={0.2}
            />
          </Sphere>
        </group>
      </Trail>
    </group>
  );
}

export function OrbitSystem() {
  return (
    <Float speed={0.6} floatIntensity={0.4} rotationIntensity={0.2}>
      <group rotation={[0.3, 0, 0.15]}>
        {/* Faint orbit rings */}
        <Torus args={[2.3, 0.005, 8, 128]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} />
        </Torus>
        <Torus args={[3.0, 0.005, 8, 128]} rotation={[Math.PI / 2, 0.4, 0]}>
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.18} />
        </Torus>
        <Torus args={[3.6, 0.005, 8, 128]} rotation={[Math.PI / 2, -0.3, 0]}>
          <meshBasicMaterial color="#f0abfc" transparent opacity={0.18} />
        </Torus>

        <Orbiter radius={2.3} speed={0.6} tilt={0} color="#22d3ee" size={0.16} />
        <Orbiter radius={3.0} speed={-0.45} tilt={0.2} color="#a78bfa" size={0.2} phase={1.2} />
        <Orbiter radius={3.6} speed={0.35} tilt={-0.15} color="#f0abfc" size={0.14} phase={2.4} />
        <Orbiter radius={2.7} speed={-0.55} tilt={0.3} color="#fde047" size={0.12} phase={3.6} />
      </group>
    </Float>
  );
}

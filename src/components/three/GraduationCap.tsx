import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function GraduationCap({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const tassel = useRef<THREE.Group>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.35;
      group.current.rotation.x = Math.sin(t * 0.6) * 0.08;
    }
    if (tassel.current) {
      tassel.current.rotation.z = Math.sin(t * 1.4) * 0.35;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={group} position={position} scale={scale}>
        {/* Cap base (cylinder/skullcap) */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.25, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Mortarboard (flat square top) */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 0.06, 1.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Button */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Tassel */}
        <group ref={tassel} position={[0, 0.04, 0]}>
          <mesh position={[0.4, -0.35, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.55, -0.72, 0.55]}>
            <coneGeometry args={[0.08, 0.22, 16]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

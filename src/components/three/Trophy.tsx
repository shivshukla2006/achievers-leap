import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Trophy({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });

  const gold = "#fbbf24";

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.7}>
      <group ref={ref} position={position} scale={scale}>
        {/* Cup */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.45, 0.3, 0.7, 32]} />
          <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} emissive={gold} emissiveIntensity={0.25} />
        </mesh>
        {/* Handles */}
        <mesh position={[0.5, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.04, 12, 24, Math.PI]} />
          <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.5, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.04, 12, 24, Math.PI]} />
          <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color={gold} metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.32, 0.38, 0.16, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Star on cup */}
        <mesh position={[0, 0.6, 0.46]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </Float>
  );
}

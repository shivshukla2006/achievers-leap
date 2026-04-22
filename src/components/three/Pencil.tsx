import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Pencil({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = rotation[2] + Math.sin(s.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1.0}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        {/* Body */}
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
        {/* Wood tip */}
        <mesh position={[0, -0.92, 0]}>
          <coneGeometry args={[0.07, 0.24, 6]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.7} />
        </mesh>
        {/* Lead */}
        <mesh position={[0, -1.07, 0]}>
          <coneGeometry args={[0.025, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Metal ferrule */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.18, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Eraser */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.14, 16]} />
          <meshStandardMaterial color="#f472b6" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

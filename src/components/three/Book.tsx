import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Book({
  position,
  rotation = [0, 0, 0],
  color = "#a78bfa",
  spineColor = "#7c3aed",
  scale = 1,
  spin = 0.3,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  spineColor?: string;
  scale?: number;
  spin?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = rotation[1] + s.clock.elapsedTime * spin;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        {/* Cover */}
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.18, 1]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Pages (slightly inset, white) */}
        <mesh position={[0.02, 0, 0]}>
          <boxGeometry args={[1.34, 0.14, 0.94]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        {/* Spine */}
        <mesh position={[-0.71, 0, 0]}>
          <boxGeometry args={[0.04, 0.2, 1.02]} />
          <meshStandardMaterial color={spineColor} roughness={0.3} metalness={0.4} emissive={spineColor} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

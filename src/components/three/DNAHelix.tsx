import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function DNAHelix({ position = [0, 0, 0] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null!);
  const count = 28;
  const height = 4;
  const radius = 0.35;

  const points = useMemo(() => {
    const arr: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI * 4;
      const y = (i / (count - 1) - 0.5) * height;
      arr.push({
        a: new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius),
        b: new THREE.Vector3(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius),
      });
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.4;
  });

  return (
    <group ref={group} position={position} scale={0.9}>
      {points.map((p, i) => (
        <group key={i}>
          <mesh position={p.a}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={p.b}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#f0abfc" emissive="#f0abfc" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={p.a.clone().add(p.b).multiplyScalar(0.5)}>
            <boxGeometry args={[p.a.distanceTo(p.b), 0.012, 0.012]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

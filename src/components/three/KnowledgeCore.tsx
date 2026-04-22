import { Float, Icosahedron, MeshDistortMaterial, MeshTransmissionMaterial, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function KnowledgeCore() {
  const shell = useRef<THREE.Mesh>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y = t * 0.15;
      shell.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.4;
      const p = 1 + Math.sin(t * 1.6) * 0.06;
      inner.current.scale.setScalar(p);
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <group>
        {/* Outer crystalline transmission shell */}
        <Icosahedron ref={shell} args={[1.35, 1]}>
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.8}
            roughness={0.05}
            ior={1.4}
            chromaticAberration={0.25}
            anisotropy={0.3}
            distortion={0.3}
            distortionScale={0.4}
            temporalDistortion={0.1}
            color="#a78bfa"
            attenuationColor="#22d3ee"
            attenuationDistance={1.2}
          />
        </Icosahedron>

        {/* Pulsing energy core */}
        <Sphere ref={inner} args={[0.55, 64, 64]}>
          <MeshDistortMaterial
            color="#7c3aed"
            distort={0.5}
            speed={3}
            roughness={0}
            metalness={0.95}
            emissive="#a21caf"
            emissiveIntensity={1.4}
          />
        </Sphere>

        {/* Soft halo ring */}
        <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.78, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";
import { Book } from "./Book";
import { GraduationCap } from "./GraduationCap";
import { Pencil } from "./Pencil";
import { Trophy } from "./Trophy";
import { CameraRig } from "./CameraRig";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [0, 0.4, 7], fov: 50 }}
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#00000000"]} />

        {/* Warm classroom-ish lighting */}
        <ambientLight intensity={0.45} />
        <pointLight position={[6, 6, 6]} intensity={1.8} color="#fde68a" />
        <pointLight position={[-6, -2, 4]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[0, -5, -5]} intensity={0.8} color="#f0abfc" />
        <Environment preset="city" />

        {/* Soft ambient sparkle (like dust in sunlight) */}
        <Sparkles count={isMobile ? 50 : 120} scale={12} size={2} speed={0.25} color="#fde68a" opacity={0.5} />

        {/* Centerpiece: Graduation cap + trophy */}
        <GraduationCap position={[0, 0.6, 0]} scale={1.1} />
        <Trophy position={[0, -1.1, 0.2]} scale={0.85} />

        {/* Floating books around */}
        <Book position={[-2.8, 1.4, -0.5]} rotation={[0.3, 0.4, 0.2]} color="#7c3aed" spineColor="#5b21b6" />
        <Book position={[2.9, 1.2, -0.3]} rotation={[-0.2, -0.5, -0.15]} color="#06b6d4" spineColor="#0e7490" />
        <Book position={[-2.5, -0.8, 0.8]} rotation={[0.1, 0.8, -0.1]} color="#ec4899" spineColor="#be185d" scale={0.85} />
        <Book position={[2.6, -1.2, 0.6]} rotation={[-0.15, -0.7, 0.2]} color="#22c55e" spineColor="#15803d" scale={0.9} />
        {!isMobile && <Book position={[-3.6, 0.2, -1.5]} rotation={[0.05, 0.3, 0.05]} color="#f59e0b" spineColor="#b45309" scale={0.8} />}
        {!isMobile && <Book position={[3.6, 0.0, -1.5]} rotation={[0, -0.3, -0.05]} color="#ef4444" spineColor="#991b1b" scale={0.8} />}

        {/* Pencils */}
        <Pencil position={[-1.6, 2.0, 0.5]} rotation={[0, 0, Math.PI / 4]} scale={0.9} />
        <Pencil position={[1.7, -2.0, 0.5]} rotation={[0, 0, -Math.PI / 5]} scale={0.85} />
        {!isMobile && <Pencil position={[-3.8, -1.6, 0.2]} rotation={[0.2, 0.3, Math.PI / 3]} scale={0.7} />}

        <CameraRig />

        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.55} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

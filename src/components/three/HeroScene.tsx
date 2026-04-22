import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense } from "react";
import { Vector2 } from "three";
import { KnowledgeCore } from "./KnowledgeCore";
import { OrbitSystem } from "./OrbitSystem";
import { DNAHelix } from "./DNAHelix";
import { FloatingFormulas } from "./FloatingFormulas";
import { CameraRig } from "./CameraRig";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#00000000"]} />

        {/* 3-point cinematic lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[8, 6, 8]} intensity={2.2} color="#a78bfa" />
        <pointLight position={[-8, -4, 4]} intensity={1.4} color="#22d3ee" />
        <pointLight position={[0, -6, -6]} intensity={1.0} color="#f0abfc" />
        <Environment preset="night" />

        {/* Background depth */}
        <Stars radius={60} depth={50} count={isMobile ? 800 : 2000} factor={3} saturation={0} fade speed={0.6} />
        <Sparkles count={isMobile ? 60 : 140} scale={12} size={3} speed={0.3} color="#a78bfa" opacity={0.7} />
        <Sparkles count={isMobile ? 40 : 80} scale={10} size={2} speed={0.2} color="#22d3ee" opacity={0.6} />

        {/* Hero subjects */}
        <KnowledgeCore />
        <OrbitSystem />
        {!isMobile && <DNAHelix position={[-4.2, 0, -1.5]} />}
        {!isMobile && <DNAHelix position={[4.2, 0, -1.5]} />}
        {!isMobile && <FloatingFormulas />}

        <CameraRig />

        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <ChromaticAberration
              offset={new Vector2(0.0008, 0.0008)}
              radialModulation={false}
              modulationOffset={0}
              blendFunction={BlendFunction.NORMAL}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.6} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

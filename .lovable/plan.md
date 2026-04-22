
## Upgrade the 3D Hero Scene

Replace the current floating-orb scene with a far more premium, cinematic 3D experience that still runs smoothly on mid-range laptops and mobile.

### What you'll see
- A glowing **knowledge core** at the center: a layered crystalline icosahedron with a slow-spinning energy shell and inner refraction.
- **Orbiting subject planets** (Math π, Physics atom, Chemistry flask, Biology DNA helix) rotating on tilted elliptical orbits with trailing light rings.
- **Animated DNA helix** + **floating equations / formulas** (E=mc², π, ∫, √) drifting in 3D space using crisp text geometry.
- **Particle nebula + shooting stars** in the background instead of the flat star field.
- **Volumetric bloom + chromatic aberration** post-processing for that "Unacademy / Apple keynote" cinematic glow.
- **Mouse parallax**: the whole scene subtly tilts toward the cursor.
- **Scroll reactivity**: core scales/rotates slightly as the user scrolls the hero.

### How it's built
- Add `@react-three/postprocessing` for Bloom + ChromaticAberration + Vignette.
- Rewrite `src/components/three/HeroScene.tsx`:
  - `<KnowledgeCore />` — nested Icosahedron + transmission material + inner pulsing sphere.
  - `<OrbitSystem />` — 4 subject icons on `<group>` rotators with `<Trail>` from drei.
  - `<DNAHelix />` — instanced spheres along a parametric double-helix curve.
  - `<FloatingFormulas />` — drei `<Text3D>` with Sora font, randomly placed, gentle float.
  - `<Nebula />` — drei `<Sparkles>` (2k particles) + `<Stars>` for depth.
  - `<ShootingStars />` — periodic streaks across the canvas.
  - `<CameraRig />` — `useFrame` lerps camera based on pointer for parallax.
  - `<EffectComposer>` with Bloom (intensity 1.2, luminanceThreshold 0.2), ChromaticAberration, Vignette.
- Performance guards:
  - `dpr={[1, 1.5]}`, `frameloop="demand"` disabled (always-on but capped).
  - `useReducedMotion()` → fall back to a static gradient + CSS shapes.
  - Mobile detection (<768px) → drop post-processing, halve particle counts, hide formulas.
- Lighting: 3-point setup (key violet, rim cyan, fill magenta) + `<Environment preset="night" />` for realistic reflections on the core.

### Files touched
- `src/components/three/HeroScene.tsx` — full rewrite.
- `src/components/three/` — new files: `KnowledgeCore.tsx`, `OrbitSystem.tsx`, `DNAHelix.tsx`, `FloatingFormulas.tsx`, `Nebula.tsx`, `CameraRig.tsx`.
- `package.json` — add `@react-three/postprocessing`.
- `src/components/sections/Hero.tsx` — minor: ensure canvas spans full hero on all breakpoints and lower text contrast layer for readability over the brighter scene.

### Notes
- Total added bundle ≈ 90KB gzipped (postprocessing). Lazy-loaded via `React.lazy` so it doesn't block first paint.
- A subtle radial dark vignette is added behind the headline so text stays readable against the brighter scene.

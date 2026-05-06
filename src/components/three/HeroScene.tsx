import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GraduationCap, Trophy, Sparkles, BookOpen, Star, Award, Atom, Brain } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Premium cursor-reactive 3D hero visual — pure CSS/Framer Motion (no WebGL).
 * Mouse position drives a 3D parallax across multi-depth layers:
 * orbit rings, core emblem, floating chips, and ambient particles.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse offset in [-1, 1]
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smooth springs for buttery parallax
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  // Stage tilt (rotateY/X)
  const rotY = useTransform(sx, [-1, 1], [12, -12]);
  const rotX = useTransform(sy, [-1, 1], [-10, 10]);

  // Layer translations (different depth amounts)
  const tBack = useTransform(sx, [-1, 1], [-20, 20]);
  const tBackY = useTransform(sy, [-1, 1], [-12, 12]);
  const tMid = useTransform(sx, [-1, 1], [-40, 40]);
  const tMidY = useTransform(sy, [-1, 1], [-26, 26]);
  const tFront = useTransform(sx, [-1, 1], [-70, 70]);
  const tFrontY = useTransform(sy, [-1, 1], [-44, 44]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: "1400px" }}
    >
      {/* Deep ambient nebula — subtle parallax */}
      <motion.div
        style={{ x: tBack, y: tBackY }}
        className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.22),transparent_60%)] blur-2xl"
      />
      <motion.div
        style={{ x: tBack, y: tBackY }}
        className="absolute top-[25%] right-[8%] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(77,111,255,0.28),transparent_65%)] blur-3xl"
      />
      <motion.div
        style={{ x: tMid, y: tMidY }}
        className="absolute bottom-[10%] right-[28%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(180,120,255,0.22),transparent_65%)] blur-3xl"
      />

      {/* Stage with 3D transform */}
      <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[8%]">
        <motion.div
          style={{
            rotateY: rotY,
            rotateX: rotX,
            transformStyle: "preserve-3d",
          }}
          className="relative w-[420px] h-[420px] md:w-[540px] md:h-[540px]"
        >
          {/* Concentric orbits — distinct depths */}
          {[
            { size: 100, dur: 32, reverse: false, opacity: 0.32, z: -120 },
            { size: 82, dur: 24, reverse: true, opacity: 0.5, z: -40 },
            { size: 62, dur: 18, reverse: false, opacity: 0.75, z: 30 },
          ].map((o, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 m-auto rounded-full border border-[#FFD700]"
              style={{
                width: `${o.size}%`,
                height: `${o.size}%`,
                opacity: o.opacity,
                boxShadow: "0 0 40px rgba(255,215,0,0.18) inset, 0 0 30px rgba(255,215,0,0.15)",
                transform: `translateZ(${o.z}px)`,
                transformStyle: "preserve-3d",
              }}
              animate={{ rotate: o.reverse ? -360 : 360 }}
              transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbit beads */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_18px_6px_rgba(255,215,0,0.55)]" />
              {i === 1 && (
                <>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.7)]" />
                  <div className="absolute -bottom-1 left-[20%] w-1.5 h-1.5 rounded-full bg-[#fff1a8] shadow-[0_0_10px_3px_rgba(255,241,168,0.7)]" />
                </>
              )}
              {i === 2 && (
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_16px_5px_rgba(255,215,0,0.65)]" />
              )}
            </motion.div>
          ))}

          {/* Tilted ellipse ring for depth */}
          <motion.div
            className="absolute inset-0 m-auto rounded-full border border-[#FFD700]/30"
            style={{
              width: "92%",
              height: "92%",
              transform: "rotateX(70deg) translateZ(-60px)",
              boxShadow: "0 0 60px rgba(255,215,0,0.25) inset",
            }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />

          {/* Dashed outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-white/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transform: "translateZ(-80px)" }}
          />

          {/* Core emblem — front layer */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-[44%] h-[44%] rounded-full flex items-center justify-center"
            style={{
              transform: "translateZ(80px)",
              background:
                "radial-gradient(circle at 30% 28%, #fff7c2 0%, #FFD700 32%, #b8860b 72%, #6b4f00 100%)",
              boxShadow:
                "0 40px 100px -20px rgba(255,215,0,0.6), 0 0 0 1px rgba(255,255,255,0.3) inset, 0 -12px 50px rgba(0,0,0,0.4) inset, 0 0 80px rgba(255,215,0,0.35)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <GraduationCap
                className="h-16 w-16 md:h-20 md:w-20 text-[#0A1F44] drop-shadow-md"
                strokeWidth={2.2}
              />
              <div className="mt-1 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#0A1F44]/85">
                ACHIEVERS
              </div>
            </motion.div>

            {/* Specular highlights */}
            <div className="absolute top-3 left-6 w-16 h-7 rounded-full bg-white/55 blur-md rotate-[-20deg]" />
            <div className="absolute bottom-5 right-7 w-10 h-3 rounded-full bg-white/25 blur-md" />

            {/* Pulsing aura */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: [
                "0 0 40px 10px rgba(255,215,0,0.35)",
                "0 0 70px 20px rgba(255,215,0,0.55)",
                "0 0 40px 10px rgba(255,215,0,0.35)",
              ] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Floating achievement chips — front layer */}
          {[
            { icon: Trophy, label: "Toppers", x: "6%", y: "10%", delay: 0.2, color: "#FFD700", z: 60 },
            { icon: Star, label: "100% Success", x: "78%", y: "14%", delay: 0.35, color: "#FFD700", z: 90 },
            { icon: BookOpen, label: "JEE · NEET", x: "2%", y: "68%", delay: 0.5, color: "#ffffff", z: 50 },
            { icon: Award, label: "Olympiad", x: "76%", y: "76%", delay: 0.65, color: "#FFD700", z: 70 },
            { icon: Atom, label: "Science", x: "44%", y: "-2%", delay: 0.8, color: "#a5b4fc", z: 100 },
            { icon: Brain, label: "Smart Prep", x: "46%", y: "94%", delay: 0.95, color: "#fef3c7", z: 80 },
          ].map((chip, i) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: chip.delay, duration: 0.7, ease: "easeOut" }}
              className="absolute"
              style={{ left: chip.x, top: chip.y, transform: `translateZ(${chip.z}px)` }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
              >
                <chip.icon className="h-4 w-4" style={{ color: chip.color }} />
                <span className="text-xs font-medium text-white whitespace-nowrap">{chip.label}</span>
              </motion.div>
            </motion.div>
          ))}

          {/* Sparkle particles — mid layer with cursor parallax */}
          <motion.div
            className="absolute inset-0"
            style={{ x: tFront, y: tFrontY }}
          >
            {Array.from({ length: 22 }).map((_, i) => {
              const left = (i * 73) % 100;
              const top = (i * 47) % 100;
              const dur = 3 + (i % 4);
              const size = (i % 3) + 1;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    boxShadow: "0 0 8px 2px rgba(255,215,0,0.7)",
                  }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: dur, repeat: Infinity, delay: i * 0.2 }}
                />
              );
            })}
          </motion.div>

          {/* Subtle corner sparkle icon */}
          <Sparkles className="absolute top-2 right-6 h-5 w-5 text-[#FFD700]/70 animate-pulse" style={{ transform: "translateZ(110px)" }} />
        </motion.div>
      </div>
    </div>
  );
}

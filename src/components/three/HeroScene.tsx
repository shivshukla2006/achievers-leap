import { motion } from "framer-motion";
import { GraduationCap, Trophy, Sparkles, BookOpen, Star, Award } from "lucide-react";

/**
 * Premium animated hero visual — no WebGL.
 * Concentric gold orbits, glowing core emblem, floating achievement chips,
 * and ambient particles. Smooth, lightweight, eye-catching.
 */
export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient glows */}
      <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.22),transparent_60%)] blur-2xl" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(77,111,255,0.25),transparent_65%)] blur-3xl" />

      {/* Stage — right side on desktop, centered top on mobile */}
      <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[8%]">
        <div className="relative w-[420px] h-[420px] md:w-[520px] md:h-[520px]">
          {/* Orbits */}
          {[
            { size: 100, dur: 28, reverse: false, opacity: 0.35 },
            { size: 78, dur: 22, reverse: true, opacity: 0.5 },
            { size: 56, dur: 16, reverse: false, opacity: 0.7 },
          ].map((o, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 m-auto rounded-full border border-[#FFD700]"
              style={{
                width: `${o.size}%`,
                height: `${o.size}%`,
                opacity: o.opacity,
                boxShadow: "0 0 40px rgba(255,215,0,0.15) inset",
              }}
              animate={{ rotate: o.reverse ? -360 : 360 }}
              transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbit beads */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_18px_6px_rgba(255,215,0,0.55)]" />
              {i === 1 && (
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.7)]" />
              )}
            </motion.div>
          ))}

          {/* Dashed outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-white/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />

          {/* Core emblem */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-[44%] h-[44%] rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #fff7c2 0%, #FFD700 35%, #b8860b 75%, #6b4f00 100%)",
              boxShadow:
                "0 30px 80px -20px rgba(255,215,0,0.55), 0 0 0 1px rgba(255,255,255,0.25) inset, 0 -10px 40px rgba(0,0,0,0.35) inset",
            }}
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <GraduationCap className="h-16 w-16 md:h-20 md:w-20 text-[#0A1F44] drop-shadow-md" strokeWidth={2.2} />
              <div className="mt-1 text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#0A1F44]/80">
                ACHIEVERS
              </div>
            </motion.div>

            {/* Specular highlight */}
            <div className="absolute top-3 left-6 w-14 h-6 rounded-full bg-white/50 blur-md rotate-[-20deg]" />
          </motion.div>

          {/* Floating achievement chips */}
          {[
            { icon: Trophy, label: "Toppers", x: "8%", y: "12%", delay: 0.2, color: "#FFD700" },
            { icon: Star, label: "94% Success", x: "78%", y: "18%", delay: 0.4, color: "#FFD700" },
            { icon: BookOpen, label: "JEE · NEET", x: "4%", y: "70%", delay: 0.6, color: "#ffffff" },
            { icon: Award, label: "Olympiad", x: "76%", y: "74%", delay: 0.8, color: "#FFD700" },
          ].map((chip, i) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: chip.delay, duration: 0.7, ease: "easeOut" }}
              className="absolute"
              style={{ left: chip.x, top: chip.y }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
              >
                <chip.icon className="h-4 w-4" style={{ color: chip.color }} />
                <span className="text-xs font-medium text-white whitespace-nowrap">{chip.label}</span>
              </motion.div>
            </motion.div>
          ))}

          {/* Sparkle particles */}
          {Array.from({ length: 14 }).map((_, i) => {
            const left = (i * 73) % 100;
            const top = (i * 47) % 100;
            const dur = 3 + (i % 4);
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#FFD700]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  boxShadow: "0 0 8px 2px rgba(255,215,0,0.7)",
                }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
                transition={{ duration: dur, repeat: Infinity, delay: i * 0.25 }}
              />
            );
          })}

          {/* Subtle corner sparkle icon */}
          <Sparkles className="absolute top-2 right-6 h-5 w-5 text-[#FFD700]/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

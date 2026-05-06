import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Users, TrendingUp, Trophy } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";

const stats = [
  { icon: Users, value: "25K+", label: "Students enrolled" },
  { icon: Trophy, value: "100%", label: "Success rate" },
  { icon: TrendingUp, value: "+38%", label: "Avg. score uplift" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-16 overflow-hidden bg-hero text-white">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      {/* Soft focus vignette behind text */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_left,_rgba(5,15,36,0.75),transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-[#FFD700]/40 bg-white/5 backdrop-blur-md text-[#FFD700]">
            <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse-glow" />
            Academic Achievers · Class 1 → 12
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="block text-white">Learn. Achieve.</span>
            <span className="block bg-gradient-to-r from-[#FFD700] via-[#fff1a8] to-[#FFD700] bg-clip-text text-transparent">
              Succeed.
            </span>
          </h1>
          <p className="text-lg text-white/75 max-w-lg leading-relaxed">
            India's most trusted coaching for academic excellence. Expert faculty, small batches and
            a proven track record of toppers in JEE, NEET, Boards & Olympiads.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gradient-to-r from-[#FFD700] to-[#f5b400] text-[#0A1F44] font-semibold shadow-[0_10px_40px_-10px_rgba(255,215,0,0.6)] hover:scale-[1.03] transition-transform"
            >
              Enroll Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/25 bg-white/5 backdrop-blur-md font-semibold text-white hover:bg-white/10 hover:scale-[1.03] transition-all"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Demo
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur-md"
              >
                <s.icon className="h-4 w-4 text-[#FFD700] mb-2" />
                <div className="text-2xl font-display font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-white/60 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right column intentionally empty — 3D scene fills via absolute canvas */}
        <div className="hidden lg:block h-[520px]" aria-hidden />
      </div>
    </section>
  );
}

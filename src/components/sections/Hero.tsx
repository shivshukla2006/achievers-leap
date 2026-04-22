import { motion } from "framer-motion";
import { ArrowRight, Compass, Users, TrendingUp, Trophy } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";

const stats = [
  { icon: Users, value: "25K+", label: "Students enrolled" },
  { icon: Trophy, value: "94%", label: "Success rate" },
  { icon: TrendingUp, value: "+38%", label: "Avg. score uplift" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-16 overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 opacity-90">
        <HeroScene />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            Trusted coaching · Class 1 → 12
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="block">Expert Coaching</span>
            <span className="gradient-text">for Future Toppers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Experienced faculty, small batches, weekly tests and a proven track record of toppers in
            JEE, NEET, Boards & Olympiads. Personal attention for every student, Class 1 to 12.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.03] transition-transform"
            >
              Get Free Counselling
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full glass-strong font-semibold hover:scale-[1.03] transition-transform"
            >
              <Compass className="h-4 w-4" />
              Explore Courses
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <s.icon className="h-4 w-4 text-accent mb-2" />
                <div className="text-2xl font-display font-bold">{s.value}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{s.label}</div>
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

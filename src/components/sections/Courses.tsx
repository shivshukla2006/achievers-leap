import { motion } from "framer-motion";
import { Atom, Calculator, FlaskConical, BookOpen, Trophy, GraduationCap } from "lucide-react";

const courses = [
  { icon: BookOpen, title: "Foundation (1–8)", desc: "Strong concept building in Maths, Science & English with regular practice and weekly tests.", tag: "Class 1–8" },
  { icon: Trophy, title: "Boards 9–12", desc: "CBSE / ICSE / State Board coaching with chapter tests, full syllabus mocks and answer-writing practice.", tag: "Class 9–12" },
  { icon: Calculator, title: "JEE Main + Advanced", desc: "Physics, Chemistry & Maths taught by experienced faculty with daily problem-solving sessions.", tag: "Class 11–12" },
  { icon: FlaskConical, title: "NEET UG", desc: "NCERT-rooted Biology, Chemistry & Physics with NEET-pattern tests and detailed performance review.", tag: "Class 11–12" },
  { icon: Atom, title: "Olympiads", desc: "NTSE, KVPY, IMO, IPhO, IChO — small batches led by senior subject mentors.", tag: "Class 6–12" },
  { icon: GraduationCap, title: "Doubt Clearing", desc: "Daily one-on-one doubt sessions with faculty so no question is ever left unanswered.", tag: "All grades" },
];

export function Courses() {
  return (
    <section id="courses" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex glass px-4 py-1.5 rounded-full text-xs font-medium mb-4">Programs</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            A <span className="gradient-text">course track</span> for every learner
          </h2>
          <p className="text-muted-foreground">
            Whether your child is just starting Class 1 or chasing AIR &lt; 100, we have a path engineered for them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold text-lg">{c.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent">{c.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

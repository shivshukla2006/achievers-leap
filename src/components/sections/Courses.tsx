import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  title: string;
  description: string;
  exam: string;
  class_range: string;
  duration: string;
  price: string | null;
  features: string[];
  image_url: string | null;
}

const fallback: Course[] = [
  { id: "f1", title: "Foundation (1–8)", description: "Strong concept building in Maths, Science & English with regular practice and weekly tests.", exam: "Foundation", class_range: "Class 1–8", duration: "Yearly", price: null, features: [], image_url: null },
  { id: "f2", title: "Boards 9–12", description: "CBSE / ICSE / State Board coaching with chapter tests, full syllabus mocks and answer-writing practice.", exam: "Boards", class_range: "Class 9–12", duration: "Yearly", price: null, features: [], image_url: null },
  { id: "f3", title: "JEE Main + Advanced", description: "Physics, Chemistry & Maths taught by experienced faculty with daily problem-solving sessions.", exam: "JEE", class_range: "Class 11–12", duration: "1–2 years", price: null, features: [], image_url: null },
  { id: "f4", title: "NEET UG", description: "NCERT-rooted Biology, Chemistry & Physics with NEET-pattern tests and detailed performance review.", exam: "NEET", class_range: "Class 11–12", duration: "1–2 years", price: null, features: [], image_url: null },
  { id: "f5", title: "Olympiads", description: "NTSE, KVPY, IMO, IPhO, IChO — small batches led by senior subject mentors.", exam: "Olympiad", class_range: "Class 6–12", duration: "Yearly", price: null, features: [], image_url: null },
  { id: "f6", title: "Doubt Clearing", description: "Daily one-on-one doubt sessions with faculty so no question is ever left unanswered.", exam: "All", class_range: "All grades", duration: "Daily", price: null, features: [], image_url: null },
];

export function Courses() {
  const [items, setItems] = useState<Course[]>(fallback);

  useEffect(() => {
    supabase.from("courses").select("*").eq("active", true)
      .order("display_order").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setItems(data as Course[]); });
  }, []);

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
          {items.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl overflow-hidden group cursor-pointer relative"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
              {c.image_url && <img src={c.image_url} alt={c.title} className="w-full h-36 object-cover" />}
              <div className="p-6 relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="font-display font-semibold text-lg truncate">{c.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent shrink-0">{c.class_range}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                  {c.price && <span className="inline-flex items-center gap-1 ml-auto font-bold gradient-text"><Sparkles className="h-3 w-3" /> {c.price}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Alumnus {
  id: string;
  name: string;
  student_class: string;
  exam: string;
  score: string;
  rank: string | null;
  image_url: string | null;
  review: string;
  featured: boolean;
}

const FALLBACK: Alumnus[] = [
  { id: "f1", name: "Ananya Sharma", student_class: "Class 12", exam: "JEE Advanced 2024", score: "AIR 47", rank: "47", image_url: null, review: "The faculty stayed back after class to clear every doubt. The mentors here treated me like family.", featured: true },
  { id: "f2", name: "Rahul Verma", student_class: "Class 12", exam: "NEET UG 2024", score: "705/720", rank: "112", image_url: null, review: "Biology became my favourite subject here. The teachers explained every concept with real clarity.", featured: false },
  { id: "f3", name: "Ishita Patel", student_class: "Class 10", exam: "CBSE Boards", score: "98.4%", rank: null, image_url: null, review: "From 76% in Class 9 to 98.4% in Boards — the personal attention from teachers changed everything.", featured: false },
  { id: "f4", name: "Arjun Mehta", student_class: "Class 11", exam: "IMO Olympiad", score: "Gold Medal", rank: "Top 12 India", image_url: null, review: "Our Olympiad mentors are themselves past medalists. You feel the difference in every single class.", featured: false },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function Alumni() {
  const [items, setItems] = useState<Alumnus[]>(FALLBACK);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Alumnus | null>(null);

  useEffect(() => {
    supabase
      .from("alumni")
      .select("*")
      .eq("visible", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data as Alumnus[]);
      });
  }, []);

  const featured = items.find((i) => i.featured) ?? items[0];

  const next = () => setActive((a) => (a + 1) % items.length);
  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);

  return (
    <section id="alumni" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-violet opacity-10 blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex glass px-4 py-1.5 rounded-full text-xs font-medium mb-4">Real toppers</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stories from our <span className="gradient-text">achievers</span>
          </h2>
          <p className="text-muted-foreground">
            Every rank, every percentile — earned by real students mentored at Academic Achievers.
          </p>
        </div>

        {/* Topper of the Month */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-violet opacity-10" />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
            <div className="relative grid md:grid-cols-[auto_1fr] gap-6 items-center">
              <div className="relative">
                {featured.image_url ? (
                  <img src={featured.image_url} alt={featured.name} className="h-32 w-32 md:h-40 md:w-40 rounded-2xl object-cover shadow-glow" />
                ) : (
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-gradient-primary flex items-center justify-center text-4xl md:text-5xl font-display font-bold text-primary-foreground shadow-glow">
                    {initials(featured.name)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 glass rounded-full px-3 py-1 flex items-center gap-1 text-xs font-bold">
                  <Trophy className="h-3.5 w-3.5 text-accent" />
                  Topper
                </div>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Topper of the Month</div>
                <h3 className="text-3xl md:text-4xl font-display font-bold mb-1">{featured.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">{featured.student_class} · {featured.exam}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="glass px-3 py-1 rounded-full text-xs font-semibold">{featured.score}</span>
                  {featured.rank && <span className="glass px-3 py-1 rounded-full text-xs font-semibold">Rank {featured.rank}</span>}
                </div>
                <p className="text-foreground/80 leading-relaxed italic">"{featured.review}"</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${active * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="flex"
            >
              {items.map((a) => (
                <div key={a.id} className="min-w-full px-2">
                  <button onClick={() => setOpen(a)} className="block w-full text-left glass rounded-2xl p-6 hover:scale-[1.01] transition-transform">
                    <div className="flex items-start gap-4">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.name} className="h-16 w-16 rounded-xl object-cover" />
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-gradient-violet flex items-center justify-center font-bold text-primary-foreground">
                          {initials(a.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{a.name}</h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">{a.student_class} · {a.exam} · <span className="text-accent font-semibold">{a.score}</span></div>
                        <p className="text-sm text-foreground/80 line-clamp-2">{a.review}</p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={prev} className="glass h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gradient-primary" : "w-1.5 bg-muted-foreground/30"}`} />
              ))}
            </div>
            <button onClick={next} className="glass h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl max-w-lg w-full p-8 relative"
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 glass h-8 w-8 rounded-full flex items-center justify-center"><X className="h-4 w-4" /></button>
              <div className="flex items-center gap-4 mb-5">
                {open.image_url ? (
                  <img src={open.image_url} alt={open.name} className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-display font-bold text-primary-foreground">{initials(open.name)}</div>
                )}
                <div>
                  <h3 className="text-2xl font-display font-bold">{open.name}</h3>
                  <div className="text-sm text-muted-foreground">{open.student_class} · {open.exam}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="glass rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Score</div>
                  <div className="text-xl font-display font-bold gradient-text">{open.score}</div>
                </div>
                {open.rank && (
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs text-muted-foreground mb-1">Rank</div>
                    <div className="text-xl font-display font-bold gradient-text">{open.rank}</div>
                  </div>
                )}
              </div>
              <p className="text-foreground/80 italic leading-relaxed">"{open.review}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

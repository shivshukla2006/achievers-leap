import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  bio: string | null;
  image_url: string | null;
  experience_years: number;
}

export function Faculty() {
  const [items, setItems] = useState<Teacher[]>([]);

  useEffect(() => {
    supabase.from("teachers").select("*").eq("visible", true)
      .order("display_order").order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Teacher[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="faculty" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex glass px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <Award className="h-3 w-3 mr-1.5 text-accent" /> Meet the mentors
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learn from <span className="gradient-text">India's finest</span> faculty
          </h2>
          <p className="text-muted-foreground">
            Subject experts from IITs, NITs and top medical colleges — passionate about teaching.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-strong rounded-2xl p-6 group"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/20" />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {t.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-display font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-accent font-mono uppercase tracking-wider">{t.subject}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <GraduationCap className="h-3.5 w-3.5" /> {t.qualification}
                <span className="ml-auto glass px-2 py-0.5 rounded text-[10px]">{t.experience_years}y</span>
              </div>
              {t.bio && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{t.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

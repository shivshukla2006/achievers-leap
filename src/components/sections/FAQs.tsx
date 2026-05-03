import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Faq { id: string; question: string; answer: string; category: string | null; }

export function FAQs() {
  const [items, setItems] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("faqs").select("id,question,answer,category").eq("visible", true).order("display_order")
      .then(({ data }) => setItems((data as Faq[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="faqs" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-primary" /> FAQs
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Frequently asked <span className="gradient-text">questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {items.map((f) => {
            const isOpen = open === f.id;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass-strong rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : f.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left">
                  <span className="font-medium">{f.question}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.answer}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

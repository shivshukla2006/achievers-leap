import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Item { id: string; title: string; body: string; type: string; }

export function AnnouncementBar() {
  const [items, setItems] = useState<Item[]>([]);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("dismissed_ann") ?? "[]"); } catch { return []; }
  });

  useEffect(() => {
    const now = new Date().toISOString();
    supabase.from("announcements").select("id,title,body,type")
      .eq("active", true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  const visible = items.filter((i) => !dismissed.includes(i.id));
  if (visible.length === 0) return null;
  const a = visible[0];

  const dismiss = () => {
    const next = [...dismissed, a.id];
    setDismissed(next);
    try { localStorage.setItem("dismissed_ann", JSON.stringify(next)); } catch { /* noop */ }
  };

  const tone = a.type === "urgent" ? "from-destructive to-destructive/70"
    : a.type === "warning" ? "from-amber-500 to-orange-500"
    : a.type === "success" ? "from-emerald-500 to-teal-500"
    : "from-primary to-primary-glow";

  return (
    <AnimatePresence>
      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
        className={`relative bg-gradient-to-r ${tone} text-primary-foreground`}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
          <Megaphone className="h-4 w-4 shrink-0" />
          <div className="flex-1 truncate"><b>{a.title}</b> <span className="opacity-90">— {a.body}</span></div>
          <button onClick={dismiss} className="rounded-full h-7 w-7 inline-flex items-center justify-center hover:bg-white/20">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

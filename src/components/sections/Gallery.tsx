import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Item { id: string; image_url: string; caption: string | null; }

export function Gallery() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    supabase.from("gallery").select("id,image_url,caption").eq("visible", true).order("display_order")
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold mb-4">
            <Camera className="h-3.5 w-3.5 text-primary" /> Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Life at <span className="gradient-text">Academic Achievers</span></h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((i, idx) => (
            <motion.div key={i.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
              className="glass-strong rounded-2xl overflow-hidden group relative aspect-square">
              <img src={i.image_url} alt={i.caption ?? ""} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {i.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {i.caption}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

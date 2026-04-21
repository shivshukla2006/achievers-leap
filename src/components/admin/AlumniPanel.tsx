import { useEffect, useState } from "react";
import { Plus, Trash2, Star, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
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
  visible: boolean;
}

export function AlumniPanel() {
  const [items, setItems] = useState<Alumnus[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("alumni").select("*").order("created_at", { ascending: false });
    setItems((data as Alumnus[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, key: "featured" | "visible", v: boolean) => {
    const { error } = await supabase.from("alumni").update({ [key]: !v }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this alumni profile?")) return;
    await supabase.from("alumni").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Alumni & Toppers</h1>
        <button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add alumnus
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12 glass rounded-2xl">No alumni added yet.</div>}
        {items.map((a) => (
          <div key={a.id} className="glass-strong rounded-2xl p-5 relative">
            {a.featured && <Star className="absolute top-3 right-3 h-4 w-4 fill-accent text-accent" />}
            <div className="flex items-center gap-3 mb-3">
              {a.image_url ? <img src={a.image_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> :
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">{a.name[0]}</div>}
              <div className="min-w-0">
                <div className="font-semibold truncate">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.student_class} · {a.exam}</div>
              </div>
            </div>
            <div className="flex gap-2 mb-3 text-xs">
              <span className="glass px-2 py-1 rounded gradient-text font-bold">{a.score}</span>
              {a.rank && <span className="glass px-2 py-1 rounded">Rank {a.rank}</span>}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{a.review}</p>
            <div className="flex gap-2">
              <button onClick={() => toggle(a.id, "featured", a.featured)} className="glass h-8 px-3 rounded-full text-xs flex-1 flex items-center justify-center gap-1">
                <Star className={`h-3 w-3 ${a.featured ? "fill-accent text-accent" : ""}`} /> {a.featured ? "Featured" : "Feature"}
              </button>
              <button onClick={() => toggle(a.id, "visible", a.visible)} className="glass h-8 px-3 rounded-full text-xs flex items-center justify-center">
                {a.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              <button onClick={() => remove(a.id)} className="glass h-8 px-3 rounded-full text-xs text-destructive flex items-center justify-center">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && <AddAlumnusModal onClose={() => { setOpen(false); load(); }} />}
    </div>
  );
}

function AddAlumnusModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", student_class: "Class 12", exam: "", score: "", rank: "", image_url: "", review: "", featured: false });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("alumni").insert({
      ...form, rank: form.rank || null, image_url: form.image_url || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Alumnus added"); onClose(); }
    setLoading(false);
  };

  const fld = "w-full h-10 rounded-xl bg-background/60 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 w-full max-w-lg space-y-3 shadow-glow max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl font-bold">Add alumnus</h3>
          <button type="button" onClick={onClose} className="glass h-8 w-8 rounded-full flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fld} />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Class (e.g., Class 12)" value={form.student_class} onChange={(e) => setForm({ ...form, student_class: e.target.value })} className={fld} />
          <input required placeholder="Exam (JEE, NEET...)" value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} className={fld} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Score (e.g., AIR 47)" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className={fld} />
          <input placeholder="Rank (optional)" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} className={fld} />
        </div>
        <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={fld} />
        <textarea required placeholder="Review / testimonial" rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })}
          className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
          Mark as Topper of the Month
        </label>
        <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

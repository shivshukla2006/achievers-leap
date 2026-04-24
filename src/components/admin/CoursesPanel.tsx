import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, X, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadSiteImage } from "@/lib/uploadImage";

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
  display_order: number;
  active: boolean;
}

const empty: Omit<Course, "id"> = {
  title: "", description: "", exam: "", class_range: "", duration: "",
  price: "", features: [], image_url: null, display_order: 0, active: true,
};

export function CoursesPanel() {
  const [items, setItems] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("display_order").order("created_at", { ascending: false });
    setItems((data as Course[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("courses").update({ active: !active }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Courses</h1>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add course
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12 glass rounded-2xl">No courses yet.</div>}
        {items.map((c) => (
          <div key={c.id} className={`glass-strong rounded-2xl overflow-hidden ${!c.active ? "opacity-60" : ""}`}>
            {c.image_url && <img src={c.image_url} alt="" className="w-full h-32 object-cover" />}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-display font-semibold">{c.title}</div>
                  <div className="text-[11px] text-accent uppercase tracking-wider mt-0.5">{c.class_range} · {c.exam}</div>
                </div>
                {c.price && <span className="text-xs glass px-2 py-1 rounded font-bold">{c.price}</span>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
              <div className="text-[11px] text-muted-foreground mb-4">{c.duration} · {c.features.length} features</div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(c); setOpen(true); }} className="glass h-8 px-3 rounded-full text-xs flex-1 flex items-center justify-center gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => toggle(c.id, c.active)} className="glass h-8 px-3 rounded-full text-xs flex items-center justify-center">
                  {c.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </button>
                <button onClick={() => remove(c.id)} className="glass h-8 px-3 rounded-full text-xs text-destructive flex items-center justify-center">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && <CourseModal initial={editing} onClose={() => { setOpen(false); load(); }} />}
    </div>
  );
}

function CourseModal({ initial, onClose }: { initial: Course | null; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Course, "id">>(initial ? {
    title: initial.title, description: initial.description, exam: initial.exam,
    class_range: initial.class_range, duration: initial.duration, price: initial.price ?? "",
    features: initial.features, image_url: initial.image_url, display_order: initial.display_order, active: initial.active,
  } : empty);
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadSiteImage(f, "courses");
      setForm({ ...form, image_url: url });
    } catch (e: any) { toast.error(e.message); }
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      price: form.price || null,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const { error } = initial
      ? await supabase.from("courses").update(payload).eq("id", initial.id)
      : await supabase.from("courses").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(initial ? "Updated" : "Course added"); onClose(); }
    setLoading(false);
  };

  const fld = "w-full h-10 rounded-xl bg-background/60 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 w-full max-w-xl space-y-3 shadow-glow max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl font-bold">{initial ? "Edit course" : "Add course"}</h3>
          <button type="button" onClick={onClose} className="glass h-8 w-8 rounded-full flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={fld} />
        <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Class range (e.g. 11–12)" value={form.class_range} onChange={(e) => setForm({ ...form, class_range: e.target.value })} className={fld} />
          <input required placeholder="Exam (JEE, NEET, Boards...)" value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} className={fld} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Duration (e.g. 1 year)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={fld} />
          <input placeholder="Price (optional)" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value })} className={fld} />
        </div>
        <textarea placeholder="Features (one per line)" rows={3} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)}
          className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Course image</label>
          {form.image_url && <img src={form.image_url} alt="" className="h-24 w-full object-cover rounded-xl" />}
          <label className="glass rounded-xl px-3 h-10 flex items-center justify-center text-sm cursor-pointer hover:scale-[1.01] transition-transform">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (form.image_url ? "Replace image" : "Upload image")}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <input type="number" placeholder="Display order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={fld} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-primary" />
            Active (visible on site)
          </label>
        </div>

        <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

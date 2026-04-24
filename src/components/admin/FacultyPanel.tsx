import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, X, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadSiteImage } from "@/lib/uploadImage";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  bio: string | null;
  image_url: string | null;
  experience_years: number;
  display_order: number;
  visible: boolean;
}

const empty: Omit<Teacher, "id"> = {
  name: "", subject: "", qualification: "", bio: "", image_url: null,
  experience_years: 0, display_order: 0, visible: true,
};

export function FacultyPanel() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("teachers").select("*").order("display_order").order("created_at", { ascending: false });
    setItems((data as Teacher[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, visible: boolean) => {
    await supabase.from("teachers").update({ visible: !visible }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this faculty member?")) return;
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Faculty</h1>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add faculty
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12 glass rounded-2xl">No faculty added yet.</div>}
        {items.map((t) => (
          <div key={t.id} className={`glass-strong rounded-2xl p-5 ${!t.visible ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3 mb-3">
              {t.image_url ? <img src={t.image_url} alt="" className="h-14 w-14 rounded-xl object-cover" /> :
                <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">{t.name[0]}</div>}
              <div className="min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.subject} · {t.experience_years}y exp</div>
              </div>
            </div>
            <div className="text-[11px] text-accent uppercase tracking-wider mb-2">{t.qualification}</div>
            {t.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{t.bio}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setEditing(t); setOpen(true); }} className="glass h-8 px-3 rounded-full text-xs flex-1 flex items-center justify-center gap-1">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => toggle(t.id, t.visible)} className="glass h-8 px-3 rounded-full text-xs flex items-center justify-center">
                {t.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              <button onClick={() => remove(t.id)} className="glass h-8 px-3 rounded-full text-xs text-destructive flex items-center justify-center">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && <FacultyModal initial={editing} onClose={() => { setOpen(false); load(); }} />}
    </div>
  );
}

function FacultyModal({ initial, onClose }: { initial: Teacher | null; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Teacher, "id">>(initial ? {
    name: initial.name, subject: initial.subject, qualification: initial.qualification,
    bio: initial.bio, image_url: initial.image_url, experience_years: initial.experience_years,
    display_order: initial.display_order, visible: initial.visible,
  } : empty);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadSiteImage(f, "teachers");
      setForm({ ...form, image_url: url });
    } catch (e: any) { toast.error(e.message); }
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, bio: form.bio || null };
    const { error } = initial
      ? await supabase.from("teachers").update(payload).eq("id", initial.id)
      : await supabase.from("teachers").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(initial ? "Updated" : "Faculty added"); onClose(); }
    setLoading(false);
  };

  const fld = "w-full h-10 rounded-xl bg-background/60 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 w-full max-w-lg space-y-3 shadow-glow max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl font-bold">{initial ? "Edit faculty" : "Add faculty"}</h3>
          <button type="button" onClick={onClose} className="glass h-8 w-8 rounded-full flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fld} />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Subject (e.g. Physics)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={fld} />
          <input required placeholder="Qualification (e.g. M.Sc. IIT)" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className={fld} />
        </div>
        <textarea placeholder="Bio (optional)" rows={3} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Photo</label>
          {form.image_url && <img src={form.image_url} alt="" className="h-24 w-24 object-cover rounded-xl" />}
          <label className="glass rounded-xl px-3 h-10 flex items-center justify-center text-sm cursor-pointer hover:scale-[1.01] transition-transform">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (form.image_url ? "Replace photo" : "Upload photo")}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3 items-center">
          <input type="number" placeholder="Years exp" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })} className={fld} />
          <input type="number" placeholder="Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className={fld} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="accent-primary" />
            Visible
          </label>
        </div>

        <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow disabled:opacity-60">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

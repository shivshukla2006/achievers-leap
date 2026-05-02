import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Eye, EyeOff, X, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Item { id: string; title: string; body: string; type: string; active: boolean; starts_at: string | null; ends_at: string | null; created_at: string; }

const TYPES = ["info", "success", "warning", "urgent"];

export function AnnouncementsPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim() || !editing?.body?.trim()) return toast.error("Fill title and body");
    const payload = {
      title: editing.title, body: editing.body, type: editing.type || "info",
      active: editing.active ?? true,
      starts_at: editing.starts_at || null, ends_at: editing.ends_at || null,
    };
    const { error } = editing.id
      ? await supabase.from("announcements").update(payload).eq("id", editing.id)
      : await supabase.from("announcements").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id); load();
  };
  const toggle = async (i: Item) => {
    await supabase.from("announcements").update({ active: !i.active }).eq("id", i.id); load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Announcements</h1>
        <button onClick={() => setEditing({})}
          className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add announcement
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && <div className="glass-strong rounded-2xl p-8 text-center text-muted-foreground">No announcements yet.</div>}
        {items.map((i) => (
          <div key={i.id} className="glass-strong rounded-2xl p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-violet flex items-center justify-center shrink-0">
              <Megaphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-medium">{i.title}</div>
                <span className="glass text-[10px] px-2 py-0.5 rounded-full uppercase">{i.type}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{i.body}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(i.created_at).toLocaleDateString()}
                {i.ends_at && ` · ends ${new Date(i.ends_at).toLocaleDateString()}`}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggle(i)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center" title={i.active ? "Deactivate" : "Activate"}>
                {i.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </button>
              <button onClick={() => setEditing(i)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => remove(i.id)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editing.id ? "Edit" : "New"} announcement</h2>
              <button onClick={() => setEditing(null)} className="glass rounded-full h-9 w-9 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="Title" className="glass rounded-xl h-11 px-4 w-full text-sm" />
            <textarea value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              placeholder="Body" rows={4} className="glass rounded-xl px-4 py-3 w-full text-sm resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <select value={editing.type ?? "info"} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="glass rounded-xl h-11 px-4 text-sm">
                {TYPES.map((t) => <option key={t} value={t} className="bg-card capitalize">{t}</option>)}
              </select>
              <input type="datetime-local" value={editing.ends_at ? editing.ends_at.slice(0, 16) : ""}
                onChange={(e) => setEditing({ ...editing, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="glass rounded-xl h-11 px-4 text-sm" />
            </div>
            <button onClick={save} className="bg-gradient-primary text-primary-foreground rounded-xl h-11 w-full font-semibold">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

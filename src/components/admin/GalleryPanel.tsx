import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

interface Item { id: string; image_url: string; caption: string | null; category: string | null; display_order: number; visible: boolean; }

export function GalleryPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("gallery").select("*").order("display_order");
    setItems((data as Item[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "gallery");
      setEditing({ ...editing, image_url: url });
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!editing?.image_url) return toast.error("Upload an image first");
    const payload = {
      image_url: editing.image_url, caption: editing.caption ?? null,
      category: editing.category ?? "general",
      display_order: editing.display_order ?? items.length,
      visible: editing.visible ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("gallery").update(payload).eq("id", editing.id)
      : await supabase.from("gallery").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery").delete().eq("id", id); load();
  };
  const toggle = async (i: Item) => {
    await supabase.from("gallery").update({ visible: !i.visible }).eq("id", i.id); load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Gallery</h1>
        <button onClick={() => setEditing({})}
          className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && <div className="col-span-full glass-strong rounded-2xl p-8 text-center text-muted-foreground">No images yet.</div>}
        {items.map((i) => (
          <div key={i.id} className="glass-strong rounded-2xl overflow-hidden group relative">
            <img src={i.image_url} alt={i.caption ?? ""} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="text-xs font-medium truncate">{i.caption || "—"}</div>
              <div className="text-[10px] text-muted-foreground">{i.category}</div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggle(i)} className="bg-card/90 backdrop-blur rounded-lg h-8 w-8 inline-flex items-center justify-center">
                {i.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              <button onClick={() => remove(i.id)} className="bg-card/90 backdrop-blur rounded-lg h-8 w-8 inline-flex items-center justify-center text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editing.id ? "Edit" : "New"} image</h2>
              <button onClick={() => setEditing(null)} className="glass rounded-full h-9 w-9 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            {editing.image_url ? (
              <img src={editing.image_url} alt="" className="rounded-xl w-full aspect-video object-cover" />
            ) : (
              <label className="glass rounded-xl border-2 border-dashed border-border h-40 flex items-center justify-center cursor-pointer text-sm text-muted-foreground">
                {uploading ? "Uploading…" : "Click to upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              </label>
            )}
            <input value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
              placeholder="Caption" className="glass rounded-xl h-11 px-4 w-full text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="Category (events, classroom…)" className="glass rounded-xl h-11 px-4 text-sm" />
              <input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                placeholder="Order" className="glass rounded-xl h-11 px-4 text-sm" />
            </div>
            <button onClick={save} disabled={uploading} className="bg-gradient-primary text-primary-foreground rounded-xl h-11 w-full font-semibold disabled:opacity-50">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

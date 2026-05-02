import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Faq { id: string; question: string; answer: string; category: string; display_order: number; visible: boolean; }

export function FaqsPanel() {
  const [items, setItems] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("faqs").select("*").order("display_order");
    setItems((data as Faq[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.question?.trim() || !editing?.answer?.trim()) return toast.error("Fill question and answer");
    const payload = {
      question: editing.question, answer: editing.answer,
      category: editing.category || "general",
      display_order: editing.display_order ?? items.length,
      visible: editing.visible ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("faqs").update(payload).eq("id", editing.id)
      : await supabase.from("faqs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const toggle = async (f: Faq) => {
    await supabase.from("faqs").update({ visible: !f.visible }).eq("id", f.id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">FAQs</h1>
        <button onClick={() => setEditing({})}
          className="bg-gradient-primary text-primary-foreground rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && <div className="glass-strong rounded-2xl p-8 text-center text-muted-foreground">No FAQs yet.</div>}
        {items.map((f) => (
          <div key={f.id} className="glass-strong rounded-2xl p-4 flex items-start gap-3">
            <div className="flex-1">
              <div className="font-medium">{f.question}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.answer}</div>
              <div className="text-xs text-muted-foreground mt-2">Category: {f.category} · Order: {f.display_order}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggle(f)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center" title={f.visible ? "Hide" : "Show"}>
                {f.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </button>
              <button onClick={() => setEditing(f)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => remove(f.id)} className="glass rounded-lg h-9 w-9 inline-flex items-center justify-center text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editing.id ? "Edit" : "New"} FAQ</h2>
              <button onClick={() => setEditing(null)} className="glass rounded-full h-9 w-9 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <input value={editing.question ?? ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              placeholder="Question" className="glass rounded-xl h-11 px-4 w-full text-sm" />
            <textarea value={editing.answer ?? ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
              placeholder="Answer" rows={5} className="glass rounded-xl px-4 py-3 w-full text-sm resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="Category (e.g. admissions)" className="glass rounded-xl h-11 px-4 text-sm" />
              <input type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                placeholder="Order" className="glass rounded-xl h-11 px-4 text-sm" />
            </div>
            <button onClick={save} className="bg-gradient-primary text-primary-foreground rounded-xl h-11 w-full font-semibold">Save FAQ</button>
          </div>
        </div>
      )}
    </div>
  );
}

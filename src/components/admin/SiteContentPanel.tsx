import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Block { id: string; block_key: string; title: string | null; body: string | null; data: Record<string, unknown>; }

const BLOCKS = [
  { key: "hero", label: "Hero section", fields: [{ k: "badge", label: "Badge text" }] },
  { key: "about", label: "About section", fields: [] },
  { key: "contact", label: "Contact info", fields: [
    { k: "phone", label: "Phone" }, { k: "email", label: "Email" }, { k: "address", label: "Address" },
  ] },
];

export function SiteContentPanel() {
  const [blocks, setBlocks] = useState<Record<string, Block>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*");
    const map: Record<string, Block> = {};
    (data ?? []).forEach((b) => { map[(b as Block).block_key] = b as Block; });
    setBlocks(map);
  };
  useEffect(() => { load(); }, []);

  const update = (key: string, patch: Partial<Block>) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...(prev[key] ?? { id: "", block_key: key, title: "", body: "", data: {} }), ...patch } }));
  };

  const save = async (key: string) => {
    setSaving(key);
    const b = blocks[key];
    const payload = { block_key: key, title: b?.title ?? null, body: b?.body ?? null, data: b?.data ?? {} };
    const { error } = b?.id
      ? await supabase.from("site_content").update(payload).eq("id", b.id)
      : await supabase.from("site_content").insert(payload);
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-display font-bold">Website content</h1>
        <p className="text-muted-foreground text-sm">Edit hero, about and contact sections shown on your website.</p>
      </div>

      <div className="space-y-4">
        {BLOCKS.map((cfg) => {
          const b = blocks[cfg.key];
          const data = (b?.data ?? {}) as Record<string, string>;
          return (
            <div key={cfg.key} className="glass-strong rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-bold">{cfg.label}</h3>
              <input value={b?.title ?? ""} onChange={(e) => update(cfg.key, { title: e.target.value })}
                placeholder="Title" className="glass rounded-xl h-11 px-4 w-full text-sm" />
              <textarea value={b?.body ?? ""} onChange={(e) => update(cfg.key, { body: e.target.value })}
                placeholder="Body" rows={3} className="glass rounded-xl px-4 py-3 w-full text-sm resize-none" />
              {cfg.fields.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {cfg.fields.map((f) => (
                    <input key={f.k} value={data[f.k] ?? ""} onChange={(e) => update(cfg.key, { data: { ...data, [f.k]: e.target.value } })}
                      placeholder={f.label} className="glass rounded-xl h-11 px-4 text-sm" />
                  ))}
                </div>
              )}
              <button onClick={() => save(cfg.key)} disabled={saving === cfg.key}
                className="bg-gradient-primary text-primary-foreground rounded-xl h-10 px-4 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving === cfg.key ? "Saving…" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

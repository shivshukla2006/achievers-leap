import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Download, Mail, Phone, X, MessageSquarePlus, UserCog2, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

interface Lead {
  id: string;
  name: string;
  student_class: string;
  exam: string;
  phone: string;
  email: string;
  message: string | null;
  status: string;
  priority: string | null;
  source: string | null;
  course_interest: string | null;
  assigned_to: string | null;
  last_contacted_at: string | null;
  created_at: string;
}

interface Teacher { id: string; name: string; subject: string; user_id: string | null; }
interface Note { id: string; note: string; author_name: string; created_at: string; }

const STATUSES = ["new", "contacted", "follow-up", "converted", "rejected"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  contacted: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  "follow-up": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

export function LeadsPanel({ role, mineOnly = false }: { role: "admin" | "teacher"; mineOnly?: boolean }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [leadsRes, teachersRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("teachers").select("id, name, subject, user_id").eq("visible", true),
    ]);
    if (leadsRes.error) toast.error(leadsRes.error.message);
    else setLeads((leadsRes.data as Lead[]) ?? []);
    setTeachers((teachersRes.data as Teacher[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadNotes = async (leadId: string) => {
    const { data } = await supabase
      .from("lead_notes").select("*").eq("lead_id", leadId).order("created_at", { ascending: false });
    setNotes((data as Note[]) ?? []);
  };

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    const updates: Partial<Lead> = { ...patch };
    if (patch.status === "contacted" || patch.status === "follow-up") {
      updates.last_contacted_at = new Date().toISOString();
    }
    const { error } = await supabase.from("leads").update(updates).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
    if (open?.id === id) setOpen({ ...open, ...patch } as Lead);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const addNote = async () => {
    if (!open || !newNote.trim() || !user) return;
    const authorName = user.user_metadata?.name || user.email || "Staff";
    const { error } = await supabase.from("lead_notes").insert({
      lead_id: open.id, author_id: user.id, author_name: authorName, note: newNote.trim(),
    });
    if (error) return toast.error(error.message);
    setNewNote("");
    loadNotes(open.id);
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (mineOnly) {
        // teacher dashboard: only show leads assigned to this teacher's record
        const myTeacher = teachers.find((t) => t.user_id === user?.id);
        if (!myTeacher || l.assigned_to !== myTeacher.id) return false;
      }
      if (filter !== "all" && l.status !== filter) return false;
      if (q && !`${l.name} ${l.email} ${l.phone} ${l.exam} ${l.course_interest ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [leads, teachers, mineOnly, filter, q, user]);

  const exportCsv = () => {
    const rows = [["Name", "Class", "Exam", "Course", "Phone", "Email", "Status", "Priority", "Assigned", "Source", "Date", "Message"]];
    filtered.forEach((l) => {
      const t = teachers.find((x) => x.id === l.assigned_to);
      rows.push([l.name, l.student_class, l.exam, l.course_interest ?? "", l.phone, l.email, l.status,
        l.priority ?? "", t?.name ?? "", l.source ?? "", new Date(l.created_at).toISOString(), l.message ?? ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const openLead = (l: Lead) => { setOpen(l); loadNotes(l.id); };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    STATUSES.forEach((s) => (c[s] = 0));
    leads.forEach((l) => {
      if (mineOnly) {
        const myTeacher = teachers.find((t) => t.user_id === user?.id);
        if (!myTeacher || l.assigned_to !== myTeacher.id) return;
      }
      c.all++;
      c[l.status] = (c[l.status] ?? 0) + 1;
    });
    return c;
  }, [leads, teachers, mineOnly, user]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="text-3xl font-display font-bold">{mineOnly ? "My Assigned Leads" : "Enquiries"}</h1>
        <button onClick={exportCsv} className="glass rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm hover:scale-105 transition-transform">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="glass rounded-full h-10 px-4 inline-flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, course..."
            className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <div className="glass rounded-full p-1 flex text-xs font-medium overflow-x-auto">
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3.5 h-8 rounded-full capitalize transition-all whitespace-nowrap ${filter === s ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s} <span className="opacity-60">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border/50">
              <tr>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Target</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Status</th>
                {!mineOnly && role === "admin" && <th className="text-left px-4 py-3">Assigned</th>}
                <th className="text-left px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No enquiries found.</td></tr>
              )}
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/30 hover:bg-muted/30 cursor-pointer" onClick={() => openLead(l)}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">Class {l.student_class}{l.course_interest ? ` · ${l.course_interest}` : ""}</div>
                  </td>
                  <td className="px-4 py-3"><span className="glass px-2 py-1 rounded text-xs font-medium">{l.exam}</span></td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <a href={`mailto:${l.email}`} className="flex items-center gap-1 text-xs hover:text-primary"><Mail className="h-3 w-3" />{l.email}</a>
                    <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-0.5"><Phone className="h-3 w-3" />{l.phone}</a>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select value={l.status} onChange={(e) => updateLead(l.id, { status: e.target.value })}
                      className={`rounded-full h-8 px-3 text-xs font-medium capitalize cursor-pointer ${STATUS_COLORS[l.status] ?? "glass"}`}>
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
                    </select>
                  </td>
                  {!mineOnly && role === "admin" && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select value={l.assigned_to ?? ""} onChange={(e) => updateLead(l.id, { assigned_to: e.target.value || null })}
                        className="glass rounded-full h-8 px-3 text-xs font-medium cursor-pointer max-w-[140px]">
                        <option value="">Unassigned</option>
                        {teachers.map((t) => <option key={t.id} value={t.id} className="bg-card">{t.name}</option>)}
                      </select>
                    </td>
                  )}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {role === "admin" && (
                      <button onClick={() => remove(l.id)} className="text-destructive hover:scale-110 transition-transform">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead detail drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end" onClick={() => setOpen(null)}>
          <div className="w-full max-w-xl h-full bg-card border-l border-border overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card/95 backdrop-blur p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">{open.name}</h2>
                <p className="text-xs text-muted-foreground">Class {open.student_class} · {open.exam}</p>
              </div>
              <button onClick={() => setOpen(null)} className="glass rounded-full h-9 w-9 inline-flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${open.phone}`} className="glass rounded-xl p-3 flex items-center gap-2 hover:bg-muted/50"><Phone className="h-4 w-4 text-primary" /><span className="text-sm">{open.phone}</span></a>
                <a href={`mailto:${open.email}`} className="glass rounded-xl p-3 flex items-center gap-2 hover:bg-muted/50"><Mail className="h-4 w-4 text-primary" /><span className="text-sm truncate">{open.email}</span></a>
                <a href={`https://wa.me/${open.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="glass rounded-xl p-3 flex items-center gap-2 hover:bg-muted/50 col-span-2 text-emerald-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  <span className="text-sm">WhatsApp</span>
                </a>
              </div>

              {open.message && (
                <div className="glass rounded-xl p-4 text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Message</div>
                  {open.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select value={open.status} onChange={(e) => updateLead(open.id, { status: e.target.value })}
                    className="glass rounded-xl h-10 px-3 text-sm w-full capitalize">
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-card">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                  <select value={open.priority ?? "normal"} onChange={(e) => updateLead(open.id, { priority: e.target.value })}
                    className="glass rounded-xl h-10 px-3 text-sm w-full capitalize">
                    {["low", "normal", "high", "urgent"].map((p) => <option key={p} value={p} className="bg-card">{p}</option>)}
                  </select>
                </div>
                {role === "admin" && (
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><UserCog2 className="h-3 w-3" /> Assigned teacher</label>
                    <select value={open.assigned_to ?? ""} onChange={(e) => updateLead(open.id, { assigned_to: e.target.value || null })}
                      className="glass rounded-xl h-10 px-3 text-sm w-full">
                      <option value="">— Unassigned —</option>
                      {teachers.map((t) => <option key={t.id} value={t.id} className="bg-card">{t.name} · {t.subject}</option>)}
                    </select>
                  </div>
                )}
                {open.last_contacted_at && (
                  <div className="col-span-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last contacted {new Date(open.last_contacted_at).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display font-semibold mb-2 flex items-center gap-2"><MessageSquarePlus className="h-4 w-4" /> Follow-up notes</h3>
                <div className="flex gap-2 mb-3">
                  <input value={newNote} onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
                    placeholder="Add a note about this contact attempt…"
                    className="glass rounded-xl h-10 px-3 text-sm flex-1" />
                  <button onClick={addNote} disabled={!newNote.trim()}
                    className="bg-gradient-primary text-primary-foreground rounded-xl h-10 px-4 text-sm font-semibold disabled:opacity-50">Add</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notes.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">No notes yet.</div>}
                  {notes.map((n) => (
                    <div key={n.id} className="glass rounded-xl p-3 text-sm">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{n.author_name}</span>
                        <span>{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      {n.note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

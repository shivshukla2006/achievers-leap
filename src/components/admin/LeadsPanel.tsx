import { useEffect, useState } from "react";
import { Search, Trash2, Download, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string;
  student_class: string;
  exam: string;
  phone: string;
  email: string;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "converted"] as const;

export function LeadsPanel({ role }: { role: "admin" | "teacher" }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setLeads((data as Lead[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const exportCsv = () => {
    const rows = [["Name", "Class", "Exam", "Phone", "Email", "Status", "Date", "Message"]];
    filtered.forEach((l) => rows.push([l.name, l.student_class, l.exam, l.phone, l.email, l.status, new Date(l.created_at).toISOString(), l.message ?? ""]));
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (q && !`${l.name} ${l.email} ${l.phone} ${l.exam}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Enquiries</h1>
        <button onClick={exportCsv} className="glass rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm hover:scale-105 transition-transform">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="glass rounded-full h-10 px-4 inline-flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone..." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <div className="glass rounded-full p-1 flex text-xs font-medium">
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3.5 h-8 rounded-full capitalize transition-all ${filter === s ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {s}
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
                <th className="text-left px-4 py-3">Date</th>
                {role === "admin" && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No enquiries yet.</td></tr>
              )}
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/30 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.student_class}</div>
                  </td>
                  <td className="px-4 py-3"><span className="glass px-2 py-1 rounded text-xs font-medium">{l.exam}</span></td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${l.email}`} className="flex items-center gap-1 text-xs hover:text-primary"><Mail className="h-3 w-3" />{l.email}</a>
                    <a href={`tel:${l.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-0.5"><Phone className="h-3 w-3" />{l.phone}</a>
                  </td>
                  <td className="px-4 py-3">
                    {role === "admin" ? (
                      <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}
                        className="glass rounded-full h-8 px-3 text-xs font-medium capitalize cursor-pointer">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span className="glass px-2.5 py-1 rounded-full text-xs font-medium capitalize">{l.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                  {role === "admin" && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(l.id)} className="text-destructive hover:scale-110 transition-transform"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

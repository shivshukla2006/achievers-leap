import { useEffect, useMemo, useState } from "react";
import { Download, TrendingUp, Users, Trophy, BookOpen, ArrowDownToLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string; status: string; created_at: string; exam: string;
  course_interest: string | null; assigned_to: string | null; source: string | null;
}
interface Teacher { id: string; name: string; subject: string; }

export function AnalyticsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [coursesCount, setCoursesCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [l, t, c] = await Promise.all([
        supabase.from("leads").select("id,status,created_at,exam,course_interest,assigned_to,source"),
        supabase.from("teachers").select("id,name,subject"),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("active", true),
      ]);
      setLeads((l.data as Lead[]) ?? []);
      setTeachers((t.data as Teacher[]) ?? []);
      setCoursesCount(c.count ?? 0);
    })();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last30 = leads.filter((l) => new Date(l.created_at) >= thirtyAgo);
    const converted = leads.filter((l) => l.status === "converted").length;
    const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

    // funnel
    const funnel = ["new", "contacted", "follow-up", "converted", "rejected"].map((s) => ({
      status: s, count: leads.filter((l) => l.status === s).length,
    }));

    // monthly trend (last 6 months)
    const months: { label: string; key: string; total: number; converted: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months.push({ label: d.toLocaleString("default", { month: "short" }), key, total: 0, converted: 0 });
    }
    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find((x) => x.key === key);
      if (m) {
        m.total++;
        if (l.status === "converted") m.converted++;
      }
    });

    // popular exams/courses
    const examMap: Record<string, number> = {};
    leads.forEach((l) => {
      const k = l.course_interest || l.exam || "Other";
      examMap[k] = (examMap[k] ?? 0) + 1;
    });
    const popular = Object.entries(examMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // top teachers (by assigned + converted)
    const teacherStats = teachers.map((t) => {
      const assigned = leads.filter((l) => l.assigned_to === t.id);
      return {
        ...t,
        assigned: assigned.length,
        converted: assigned.filter((l) => l.status === "converted").length,
      };
    }).sort((a, b) => b.converted - a.converted || b.assigned - a.assigned);

    // sources
    const sourceMap: Record<string, number> = {};
    leads.forEach((l) => { const k = l.source || "website"; sourceMap[k] = (sourceMap[k] ?? 0) + 1; });

    return { last30: last30.length, converted, conversionRate, funnel, months, popular, teacherStats, sourceMap };
  }, [leads, teachers]);

  const maxFunnel = Math.max(...stats.funnel.map((f) => f.count), 1);
  const maxMonth = Math.max(...stats.months.map((m) => m.total), 1);
  const maxPopular = Math.max(...stats.popular.map(([, n]) => n), 1);

  const exportFullReport = () => {
    const lines: string[] = [];
    lines.push("Academic Achievers — Analytics Report");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");
    lines.push("KPI,Value");
    lines.push(`Total enquiries,${leads.length}`);
    lines.push(`Last 30 days,${stats.last30}`);
    lines.push(`Converted,${stats.converted}`);
    lines.push(`Conversion rate,${stats.conversionRate}%`);
    lines.push(`Active courses,${coursesCount}`);
    lines.push(`Active teachers,${teachers.length}`);
    lines.push("");
    lines.push("Funnel");
    lines.push("Status,Count");
    stats.funnel.forEach((f) => lines.push(`${f.status},${f.count}`));
    lines.push("");
    lines.push("Monthly trend");
    lines.push("Month,Total,Converted");
    stats.months.forEach((m) => lines.push(`${m.label},${m.total},${m.converted}`));
    lines.push("");
    lines.push("Popular interests");
    lines.push("Interest,Count");
    stats.popular.forEach(([k, v]) => lines.push(`${k},${v}`));
    lines.push("");
    lines.push("Teacher performance");
    lines.push("Teacher,Subject,Assigned,Converted,Conversion %");
    stats.teacherStats.forEach((t) =>
      lines.push(`${t.name},${t.subject},${t.assigned},${t.converted},${t.assigned ? Math.round((t.converted / t.assigned) * 100) : 0}%`));
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `analytics-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Conversion funnel, growth & teacher performance.</p>
        </div>
        <button onClick={exportFullReport}
          className="glass rounded-full h-10 px-4 inline-flex items-center gap-2 text-sm hover:scale-105 transition-transform">
          <ArrowDownToLine className="h-4 w-4" /> Export full report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total enquiries", value: leads.length, icon: Users },
          { label: "Last 30 days", value: stats.last30, icon: TrendingUp },
          { label: "Conversion rate", value: `${stats.conversionRate}%`, icon: Trophy },
          { label: "Active courses", value: coursesCount, icon: BookOpen },
        ].map((c) => (
          <div key={c.label} className="glass-strong rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
            <c.icon className="h-5 w-5 text-primary mb-3" />
            <div className="text-3xl font-display font-bold gradient-text">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Funnel */}
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-display font-bold mb-4">Conversion funnel</h3>
          <div className="space-y-3">
            {stats.funnel.map((f) => (
              <div key={f.status}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize">{f.status}</span>
                  <span className="text-muted-foreground">{f.count}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${(f.count / maxFunnel) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-display font-bold mb-4">Last 6 months</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.months.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] text-muted-foreground">{m.total}</div>
                <div className="w-full rounded-lg bg-muted relative overflow-hidden flex flex-col-reverse" style={{ height: `${(m.total / maxMonth) * 100}%`, minHeight: m.total > 0 ? "8px" : "2px" }}>
                  <div className="bg-gradient-violet absolute inset-x-0 bottom-0" style={{ height: `${m.total ? (m.converted / m.total) * 100 : 0}%` }} />
                  <div className="bg-gradient-primary opacity-70 h-full" />
                </div>
                <div className="text-[10px] font-medium">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 text-[10px] mt-3 text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-gradient-primary" /> Total</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-gradient-violet" /> Converted</span>
          </div>
        </div>

        {/* Popular interests */}
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-display font-bold mb-4">Popular interests</h3>
          {stats.popular.length === 0 && <div className="text-sm text-muted-foreground">No data yet.</div>}
          <div className="space-y-2">
            {stats.popular.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-violet rounded-full" style={{ width: `${(v / maxPopular) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher performance */}
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="font-display font-bold mb-4">Teacher performance</h3>
          {stats.teacherStats.length === 0 && <div className="text-sm text-muted-foreground">No teachers yet.</div>}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.teacherStats.map((t) => (
              <div key={t.id} className="glass rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.subject}</div>
                </div>
                <div className="text-right text-xs">
                  <div><span className="font-bold gradient-text text-base">{t.converted}</span> / {t.assigned}</div>
                  <div className="text-muted-foreground">{t.assigned ? Math.round((t.converted / t.assigned) * 100) : 0}% conv.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

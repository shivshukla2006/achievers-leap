import { useEffect, useState } from "react";
import { Inbox, TrendingUp, GraduationCap, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function Overview() {
  const [stats, setStats] = useState({ total: 0, newLeads: 0, contacted: 0, converted: 0, alumni: 0 });

  useEffect(() => {
    (async () => {
      const [leads, newL, contactedL, convertedL, alumni] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "contacted"),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
        supabase.from("alumni").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        total: leads.count ?? 0,
        newLeads: newL.count ?? 0,
        contacted: contactedL.count ?? 0,
        converted: convertedL.count ?? 0,
        alumni: alumni.count ?? 0,
      });
    })();
  }, []);

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  const cards = [
    { label: "Total enquiries", value: stats.total, icon: Inbox, gradient: "bg-gradient-primary" },
    { label: "New / unhandled", value: stats.newLeads, icon: Inbox, gradient: "bg-gradient-violet" },
    { label: "Conversion rate", value: `${conversionRate}%`, icon: TrendingUp, gradient: "bg-gradient-primary" },
    { label: "Converted", value: stats.converted, icon: UserCheck, gradient: "bg-gradient-violet" },
    { label: "Alumni profiles", value: stats.alumni, icon: GraduationCap, gradient: "bg-gradient-primary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-1">Overview</h1>
        <p className="text-muted-foreground text-sm">Real-time snapshot of your coaching pipeline.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-strong rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${c.gradient} opacity-20 blur-2xl`} />
            <c.icon className="h-5 w-5 text-primary mb-3" />
            <div className="text-3xl font-display font-bold gradient-text">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

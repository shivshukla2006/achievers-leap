import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

interface Notif { id: string; type: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string; }

export function NotificationsBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*")
      .eq("recipient_id", user.id).order("created_at", { ascending: false }).limit(30);
    setItems((data as Notif[]) ?? []);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const channel = supabase
      .channel("notifications-bell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as Notif;
          setItems((prev) => [n, ...prev]);
          toast(n.title, { description: n.body ?? undefined });
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unread = items.filter((i) => !i.read).length;

  const markAll = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("recipient_id", user.id).eq("read", false);
    load();
  };

  const markOne = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, read: true } : p)));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="glass rounded-full h-10 w-10 inline-flex items-center justify-center relative hover:scale-105 transition-transform">
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 max-h-[70vh] overflow-hidden glass-strong rounded-2xl shadow-2xl flex flex-col">
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <div className="font-display font-bold text-sm">Notifications</div>
              {unread > 0 && (
                <button onClick={markAll} className="text-xs text-primary inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {items.length === 0 && <div className="text-center text-xs text-muted-foreground p-6">No notifications.</div>}
              {items.map((n) => (
                <button key={n.id} onClick={() => markOne(n.id)}
                  className={`w-full text-left p-3 border-b border-border/30 hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {!n.read && <span className="h-2 w-2 rounded-full bg-gradient-primary shrink-0" />}
                    {n.title}
                  </div>
                  {n.body && <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>}
                  <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

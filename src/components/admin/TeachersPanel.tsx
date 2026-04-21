import { useEffect, useState } from "react";
import { Trash2, UserCog, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RoleRow {
  id: string;
  user_id: string;
  role: string;
}
interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export function TeachersPanel() {
  const [rows, setRows] = useState<(Profile & { role: string; roleId: string })[]>([]);

  const load = async () => {
    const { data: roles } = await supabase.from("user_roles").select("*").eq("role", "teacher");
    const teacherRoles = (roles ?? []) as RoleRow[];
    if (teacherRoles.length === 0) { setRows([]); return; }
    const ids = teacherRoles.map((r) => r.user_id);
    const { data: profiles } = await supabase.from("profiles").select("*").in("id", ids);
    const map = new Map((profiles ?? []).map((p: Profile) => [p.id, p]));
    setRows(teacherRoles.map((r) => ({ ...(map.get(r.user_id) as Profile), role: r.role, roleId: r.id })).filter((r) => r.id));
  };

  useEffect(() => { load(); }, []);

  const removeRole = async (roleId: string) => {
    if (!confirm("Remove teacher role from this user?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) return toast.error(error.message);
    toast.success("Teacher role removed");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Teachers</h1>
      </div>

      <div className="glass rounded-2xl p-4 flex gap-3 items-start text-sm">
        <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div className="text-muted-foreground">
          To add a teacher, ask them to sign up at <a href="/signup" className="text-primary underline">/signup</a> — they'll
          automatically be assigned the <b>teacher</b> role (only the very first user becomes admin). You can revoke teacher access here.
        </div>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/50">
            <tr><th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Joined</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">No teachers yet.</td></tr>}
            {rows.map((t) => (
              <tr key={t.roleId} className="border-b border-border/30">
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-violet flex items-center justify-center text-primary-foreground text-xs font-bold">
                    <UserCog className="h-4 w-4" />
                  </div>
                  {t.name || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => removeRole(t.roleId)} className="text-destructive hover:scale-110 transition-transform">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

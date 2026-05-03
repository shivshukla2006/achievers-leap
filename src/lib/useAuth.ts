import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Role = "admin" | "teacher" | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async (uid: string) => {
      setRoleLoading(true);
      // small delay & retry — the signup trigger may be inserting the row
      let roles: string[] = [];
      for (let i = 0; i < 5; i++) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        roles = (data ?? []).map((r) => r.role);
        if (roles.length > 0) break;
        await new Promise((r) => setTimeout(r, 400));
      }
      setRole(roles.includes("admin") ? "admin" : roles.includes("teacher") ? "teacher" : null);
      setRoleLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchRole(session.user!.id), 0);
      } else {
        setRole(null);
        setRoleLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      } else {
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, role, loading: loading || roleLoading };
}

export function useRequireRole(required: ("admin" | "teacher")[]) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (role && !required.includes(role)) navigate({ to: "/" });
  }, [loading, user, role, navigate, required]);
  return { user, role, loading };
}

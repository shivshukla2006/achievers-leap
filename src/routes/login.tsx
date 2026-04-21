import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Shield, GraduationCap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Staff Login — Academic Achievers" },
      { name: "description", content: "Secure login portal for Academic Achievers admins and teachers." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"admin" | "teacher">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      toast.error(error?.message ?? "Login failed");
      setLoading(false);
      return;
    }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const list = (roles ?? []).map((r) => r.role);
    if (list.includes("admin")) navigate({ to: "/admin" });
    else if (list.includes("teacher")) navigate({ to: "/admin" });
    else {
      toast.error("Your account has no staff role assigned.");
      await supabase.auth.signOut();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 glass rounded-full px-4 h-10 flex items-center gap-2 text-sm hover:scale-105 transition-transform">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 w-full max-w-md shadow-glow"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Academic <span className="gradient-text">Achievers</span></span>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-1">Staff Portal</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Sign in to manage enquiries & content</p>

        <div className="glass rounded-full p-1 grid grid-cols-2 mb-6 text-sm font-medium">
          <button onClick={() => setTab("admin")} className={`h-9 rounded-full flex items-center justify-center gap-1.5 transition-all ${tab === "admin" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
          <button onClick={() => setTab("teacher")} className={`h-9 rounded-full flex items-center justify-center gap-1.5 transition-all ${tab === "teacher" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
            <GraduationCap className="h-3.5 w-3.5" /> Teacher
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
              className="w-full h-11 rounded-xl bg-background/60 border border-border px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required
              className="w-full h-11 rounded-xl bg-background/60 border border-border px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button disabled={loading} type="submit"
            className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
            {loading ? "Signing in..." : `Sign in as ${tab === "admin" ? "Admin" : "Teacher"}`}
          </button>
        </form>
        <p className="text-[11px] text-center text-muted-foreground mt-5">
          New here? <Link to="/signup" className="text-primary hover:underline">Create staff account</Link>
        </p>
      </motion.div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import signupBg from "@/assets/signup-bg.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Staff Signup — Academic Achievers" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const redirectUrl = `${window.location.origin}/admin`;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl, data: { name } },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // First user auto-promote to admin (if no admin exists)
    if (data.user) {
      const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      const role = (count ?? 0) === 0 ? "admin" : "teacher";
      await supabase.from("user_roles").insert({ user_id: data.user.id, role });
      toast.success(`Account created! Assigned role: ${role}`);
      navigate({ to: "/admin" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hero grid-bg flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-6 left-6 glass rounded-full px-4 h-10 flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 w-full max-w-md shadow-glow">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Academic <span className="gradient-text">Achievers</span></span>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-1">Create staff account</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">First account becomes Admin automatically</p>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Full name" value={name} onChange={setName} type="text" />
          <Input label="Email" value={email} onChange={setEmail} type="email" />
          <Input label="Password (min 6)" value={password} onChange={setPassword} type="password" />
          <button disabled={loading} type="submit"
            className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-60">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-[11px] text-center text-muted-foreground mt-5">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

function Input({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} required minLength={type === "password" ? 6 : undefined}
        className="w-full h-11 rounded-xl bg-background/60 border border-border px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </div>
  );
}

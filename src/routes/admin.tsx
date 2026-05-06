import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, LayoutDashboard, Inbox, GraduationCap, UserCog, Loader2, BookOpen, Users, BarChart3, HelpCircle, Image as ImageIcon, Megaphone, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Overview } from "@/components/admin/Overview";
import { LeadsPanel } from "@/components/admin/LeadsPanel";
import { AlumniPanel } from "@/components/admin/AlumniPanel";
import { TeachersPanel } from "@/components/admin/TeachersPanel";
import { CoursesPanel } from "@/components/admin/CoursesPanel";
import { FacultyPanel } from "@/components/admin/FacultyPanel";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { FaqsPanel } from "@/components/admin/FaqsPanel";
import { GalleryPanel } from "@/components/admin/GalleryPanel";
import { AnnouncementsPanel } from "@/components/admin/AnnouncementsPanel";
import { SiteContentPanel } from "@/components/admin/SiteContentPanel";
import { NotificationsBell } from "@/components/admin/NotificationsBell";
import signupBg from "@/assets/signup-bg.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Academic Achievers" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "overview" | "leads" | "analytics" | "courses" | "faculty" | "alumni" | "teachers" | "faqs" | "gallery" | "announcements" | "content";

function AdminPage() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    if (!loading && user && !role) navigate({ to: "/" });
  }, [loading, user, role, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-hero"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "Enquiries", icon: Inbox },
    { id: "analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "faculty", label: "Faculty", icon: Users },
    { id: "alumni", label: "Alumni", icon: GraduationCap },
    { id: "announcements", label: "Announcements", icon: Megaphone, adminOnly: true },
    { id: "faqs", label: "FAQs", icon: HelpCircle, adminOnly: true },
    { id: "gallery", label: "Gallery", icon: ImageIcon, adminOnly: true },
    { id: "content", label: "Site content", icon: FileText, adminOnly: true },
    { id: "teachers", label: "Teacher access", icon: UserCog, adminOnly: true },
  ];

  const visibleTabs = tabs.filter((t) => !t.adminOnly || role === "admin");

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-none" />
      <div className="relative z-10">
      <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Academic <span className="gradient-text">Achievers</span></span>
            <span className="text-xs glass px-2 py-0.5 rounded-full ml-2 capitalize">{role}</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <ThemeToggle />
            <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
              className="glass rounded-full px-4 h-10 flex items-center gap-2 text-sm hover:scale-105 transition-transform">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {visibleTabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all ${tab === t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:scale-105"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {tab === "overview" && <Overview />}
          {tab === "leads" && <LeadsPanel role={role!} />}
          {tab === "analytics" && role === "admin" && <AnalyticsPanel />}
          {tab === "courses" && <CoursesPanel />}
          {tab === "faculty" && <FacultyPanel />}
          {tab === "alumni" && <AlumniPanel />}
          {tab === "announcements" && role === "admin" && <AnnouncementsPanel />}
          {tab === "faqs" && role === "admin" && <FaqsPanel />}
          {tab === "gallery" && role === "admin" && <GalleryPanel />}
          {tab === "content" && role === "admin" && <SiteContentPanel />}
          {tab === "teachers" && role === "admin" && <TeachersPanel />}
        </motion.div>
      </div>
      </div>
    </div>
  );
}

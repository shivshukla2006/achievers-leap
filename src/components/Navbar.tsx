import { Link } from "@tanstack/react-router";
import { Menu, X, Zap, ZapOff } from "lucide-react";
import logoUrl from "@/assets/logo-option-2.png";
import { useState } from "react";
import { useScrollSpy, scrollToId } from "@/lib/useScrollSpy";
import { useReducedMotionPref } from "@/lib/useReducedMotion";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(["courses", "alumni", "enquiry"]);
  const { reduced, toggle } = useReducedMotionPref();
  const close = () => setOpen(false);
  const enquiryActive = active === "enquiry";

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    scrollToId(id);
  };

  const linkCls = (id: string) =>
    `transition-colors hover:text-foreground ${active === id ? "text-foreground font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-gradient-primary" : ""}`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoUrl} alt="Academic Achievers" width={40} height={40} className="h-10 w-10 object-contain drop-shadow-[0_2px_8px_rgba(255,215,0,0.35)]" />
          <span className="font-display font-bold text-lg tracking-tight">
            Academic <span className="gradient-text">Achievers</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#courses" onClick={go("courses")} className={linkCls("courses")}>Courses</a>
          <a href="#alumni" onClick={go("alumni")} className={linkCls("alumni")}>Toppers</a>
          <a href="#enquiry" onClick={go("enquiry")} className={linkCls("enquiry")}>Enquire</a>
          <Link to="/login" className="hover:text-foreground transition-colors">Staff Login</Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={reduced ? "Enable animations" : "Reduce motion"}
            title={reduced ? "Animations off" : "Animations on"}
            className="glass h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            {reduced ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4 text-accent" />}
          </button>
          <a
            href="#enquiry"
            onClick={go("enquiry")}
            className={`hidden sm:inline-flex h-10 items-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform ${enquiryActive ? "ring-2 ring-accent ring-offset-2 ring-offset-background animate-pulse-glow" : ""}`}
          >
            Free Counselling
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden glass h-10 w-10 rounded-full flex items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden glass-strong max-w-6xl mx-auto rounded-2xl mt-2 p-4 flex flex-col gap-3 text-sm font-medium">
          <a href="#courses" onClick={go("courses")} className={`py-2 ${active === "courses" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>Courses</a>
          <a href="#alumni" onClick={go("alumni")} className={`py-2 ${active === "alumni" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>Toppers</a>
          <a href="#enquiry" onClick={go("enquiry")} className={`py-2 ${active === "enquiry" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>Enquire</a>
          <Link to="/login" onClick={close} className="py-2 text-muted-foreground">Staff Login</Link>
          <a
            href="#enquiry"
            onClick={go("enquiry")}
            className={`inline-flex justify-center h-11 items-center rounded-full bg-gradient-primary px-5 font-semibold text-primary-foreground shadow-glow ${enquiryActive ? "ring-2 ring-accent" : ""}`}
          >
            Free Counselling
          </a>
        </div>
      )}
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Academic <span className="gradient-text">Achievers</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a href="#courses" className="hover:text-foreground transition-colors">Courses</a>
          <a href="#alumni" className="hover:text-foreground transition-colors">Toppers</a>
          <a href="#enquiry" className="hover:text-foreground transition-colors">Enquire</a>
          <Link to="/login" className="hover:text-foreground transition-colors">Staff Login</Link>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#enquiry"
            className="hidden sm:inline-flex h-10 items-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
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
          <a href="#courses" onClick={close} className="py-2">Courses</a>
          <a href="#alumni" onClick={close} className="py-2">Toppers</a>
          <a href="#enquiry" onClick={close} className="py-2">Enquire</a>
          <Link to="/login" onClick={close} className="py-2">Staff Login</Link>
          <a
            href="#enquiry"
            onClick={close}
            className="inline-flex justify-center h-11 items-center rounded-full bg-gradient-primary px-5 font-semibold text-primary-foreground shadow-glow"
          >
            Free Counselling
          </a>
        </div>
      )}
    </header>
  );
}

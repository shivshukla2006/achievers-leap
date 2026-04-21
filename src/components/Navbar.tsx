import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
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
          <ThemeToggle />
          <a
            href="#enquiry"
            className="hidden sm:inline-flex h-10 items-center rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
          >
            Free Counselling
          </a>
        </div>
      </nav>
    </header>
  );
}

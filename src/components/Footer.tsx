import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Academic <span className="gradient-text">Achievers</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            A trusted coaching institute for Class 1–12 — experienced faculty, small batches and a proven record of toppers in Boards, JEE, NEET and Olympiads.
          </p>
        </div>
        <div>
          <div className="font-semibold text-sm mb-3">Programs</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#courses" className="hover:text-foreground">Foundation</a></li>
            <li><a href="#courses" className="hover:text-foreground">JEE / NEET</a></li>
            <li><a href="#courses" className="hover:text-foreground">Olympiads</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-sm mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#alumni" className="hover:text-foreground">Toppers</a></li>
            <li><a href="#enquiry" className="hover:text-foreground">Contact</a></li>
            <li><Link to="/login" className="hover:text-foreground">Staff Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Academic Achievers · Crafted for future toppers
      </div>
    </footer>
  );
}

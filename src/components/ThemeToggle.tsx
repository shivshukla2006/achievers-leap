import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolved, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
      className="glass relative h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {resolved === "dark" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-primary" />}
    </button>
  );
}

import { createContext, useContext, useEffect } from "react";

type Ctx = { resolved: "dark" };
const ThemeContext = createContext<Ctx>({ resolved: "dark" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    try { localStorage.setItem("theme", "dark"); } catch {}
  }, []);
  return <ThemeContext.Provider value={{ resolved: "dark" }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

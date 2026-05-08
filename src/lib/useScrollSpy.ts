import { useEffect, useState } from "react";

const KEY = "scroll-spy-active";

export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(KEY);
  });

  useEffect(() => {
    // Restore scroll to last active section on mount (e.g. after route nav back)
    const stored = sessionStorage.getItem(KEY);
    if (stored && ids.includes(stored) && window.scrollY < 50) {
      const el = document.getElementById(stored);
      if (el) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: el.offsetTop - offset + 20, behavior: "auto" });
        });
      }
    }

    const onScroll = () => {
      const y = window.scrollY + offset;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }
      setActive(current);
      if (current) sessionStorage.setItem(KEY, current);
      else sessionStorage.removeItem(KEY);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}

/** Smoothly scroll to an element id with the navbar offset. Safe from modals/menus. */
export function scrollToId(id: string, offset = 96) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = document.documentElement.dataset.reducedMotion === "true";
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
}

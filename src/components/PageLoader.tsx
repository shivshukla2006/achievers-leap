import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionPref } from "@/lib/useReducedMotion";

const MIN_VISIBLE_MS = 350; // avoid flicker on very fast transitions
const SHOW_DELAY_MS = 120;  // don't show at all if it resolves quickly

export function PageLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const { reduced } = useReducedMotionPref();

  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const shownAt = useRef<number | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  // Initial splash (only first mount, skipped if reduced motion)
  const [splash, setSplash] = useState(!reduced);
  useEffect(() => {
    if (reduced) { setSplash(false); return; }
    const t = setTimeout(() => setSplash(false), 700);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (isLoading) {
      // Defer showing — if route resolves within SHOW_DELAY_MS, skip entirely
      if (showTimer.current) clearTimeout(showTimer.current);
      showTimer.current = setTimeout(() => {
        setShown(true);
        shownAt.current = Date.now();
        setProgress(reduced ? 70 : 18);
        if (!reduced) {
          const tick = () => {
            setProgress((p) => (p < 88 ? p + (92 - p) * 0.035 : p));
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        }
      }, SHOW_DELAY_MS);
    } else {
      if (showTimer.current) clearTimeout(showTimer.current);
      cancelAnimationFrame(rafRef.current);
      if (shown) {
        setProgress(100);
        const elapsed = shownAt.current ? Date.now() - shownAt.current : MIN_VISIBLE_MS;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
          setShown(false);
          setProgress(0);
          shownAt.current = null;
        }, remaining + 250);
      }
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoading, reduced, shown]);

  return (
    <>
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none"
        style={{
          opacity: shown && progress > 0 ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      >
        <div
          className="h-full bg-gradient-primary shadow-[0_0_10px_rgba(120,119,198,0.7)]"
          style={{
            width: `${progress}%`,
            transition: reduced
              ? "none"
              : "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>

      {splash && (
        <div
          className="fixed inset-0 z-[199] grid place-items-center bg-background pointer-events-none"
          style={{ animation: "fade-out 450ms ease-out 250ms forwards" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              {!reduced && (
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin" />
              )}
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-display">
              Academic Achievers
            </span>
          </div>
        </div>
      )}
    </>
  );
}

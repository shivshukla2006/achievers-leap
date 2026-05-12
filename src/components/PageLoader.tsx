import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/** Top progress bar that shows during route transitions and on initial mount. */
export function PageLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  // Initial page load fade-out
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;
    if (isLoading) {
      setProgress(15);
      const tick = () => {
        setProgress((p) => (p < 85 ? p + (90 - p) * 0.04 : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else if (progress > 0) {
      setProgress(100);
      timeout = setTimeout(() => setProgress(0), 350);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <>
      {/* Top progress bar */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none"
        style={{ opacity: progress > 0 ? 1 : 0, transition: "opacity 300ms" }}
      >
        <div
          className="h-full bg-gradient-primary shadow-[0_0_12px_rgba(120,119,198,0.8)]"
          style={{
            width: `${progress}%`,
            transition: "width 200ms ease-out",
          }}
        />
      </div>

      {/* Initial splash overlay */}
      {visible && (
        <div className="fixed inset-0 z-[199] grid place-items-center bg-background animate-fade-out pointer-events-none"
             style={{ animation: "fade-out 500ms ease-out 300ms forwards" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin" />
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

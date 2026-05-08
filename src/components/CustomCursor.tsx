import { useEffect, useRef, useState } from "react";

/** Global custom cursor: glowing dot + soft trailing ring. Disabled on touch & reduced-motion. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = document.documentElement.dataset.reducedMotion === "true";
    if (isTouch || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let dx = rx, dy = ry;
    let raf = 0;

    const move = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a, button, [role='button'], input, textarea, select, label");
      setHovering(interactive);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    const tick = () => {
      rx += (dx - rx) * 0.15;
      ry += (dy - ry) * 0.15;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-[#FFD700] shadow-[0_0_12px_4px_rgba(255,215,0,0.7)] mix-blend-screen"
        style={{ transition: "width 120ms, height 120ms" }}
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-[#FFD700]/60 backdrop-blur-[1px] mix-blend-screen transition-[width,height,background-color,border-color] duration-150 ${
          pressed ? "h-6 w-6 bg-[#FFD700]/30" : hovering ? "h-12 w-12 bg-[#FFD700]/10" : "h-8 w-8"
        }`}
      />
    </>
  );
}

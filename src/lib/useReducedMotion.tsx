import { createContext, useContext, useEffect, useState } from "react";

type Ctx = { reduced: boolean; toggle: () => void; setReduced: (v: boolean) => void };
const C = createContext<Ctx>({ reduced: false, toggle: () => {}, setReduced: () => {} });

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReducedState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("reduced-motion");
    const sys = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedState(stored ? stored === "1" : sys);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reduced ? "true" : "false";
  }, [reduced]);

  const setReduced = (v: boolean) => {
    setReducedState(v);
    localStorage.setItem("reduced-motion", v ? "1" : "0");
  };

  return (
    <C.Provider value={{ reduced, setReduced, toggle: () => setReduced(!reduced) }}>{children}</C.Provider>
  );
}

export const useReducedMotionPref = () => useContext(C);

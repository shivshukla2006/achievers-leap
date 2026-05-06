import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      if (!dismissed) setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installed = () => setVisible(false);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (!visible || !deferred) return null;

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  };

  const dismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:bottom-4 z-[60] glass-strong rounded-2xl p-4 shadow-glow max-w-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Download className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold">Install Academic Achievers</div>
          <p className="text-xs text-muted-foreground mt-1">Add the app to your home screen for fast access.</p>
          <div className="flex gap-2 mt-3">
            <button onClick={install} className="h-9 px-4 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
              Install
            </button>
            <button onClick={dismiss} className="h-9 px-4 rounded-full glass text-sm">Later</button>
          </div>
        </div>
        <button aria-label="Close" onClick={dismiss} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

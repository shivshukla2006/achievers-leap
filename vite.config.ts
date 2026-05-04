// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel (env var VERCEL=1 is set automatically) we disable the Cloudflare
// plugin and enable TanStack Start's SPA mode so a static build with index.html
// is emitted that Vercel can serve. SSR-less is fine for this app — every
// data call goes through the browser Supabase client.
const isVercel = !!process.env.VERCEL;

export default defineConfig(
  isVercel
    ? {
        cloudflare: false,
        tanstackStart: {
          spa: { enabled: true },
        },
      }
    : {},
);

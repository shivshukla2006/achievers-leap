# Deploying to Vercel

This TanStack Start project deploys to Lovable (Cloudflare) by default. The
config below also lets the same code deploy to Vercel as a static SPA.

## How it works

- `vite.config.ts` checks for `VERCEL=1` (Vercel sets this automatically).
  When present, it disables the Cloudflare plugin and turns on TanStack
  Start's SPA mode (`tanstackStart.spa.enabled = true`), which produces
  `dist/client/_shell.html` — a static HTML shell that hydrates into the full
  React app on the client.
- `vercel.json` copies `_shell.html` to `index.html` after build, sets
  `dist/client` as the output directory, and rewrites every URL to
  `index.html` so client-side routing works on refresh / deep links.

This app makes ALL data calls through the browser Supabase client, so a
SPA build is fully functional — no SSR or server functions are needed.

## One-time setup on Vercel

1. Push this repo to GitHub (use Lovable's GitHub sync).
2. In Vercel: **New Project → Import** the repo.
3. Framework preset: **Other**. `vercel.json` configures the rest.
4. Add Environment Variables (copy from your local `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Deploy. Vercel runs `bun install && bun run build`, sees `VERCEL=1`,
   produces `dist/client/`, and serves it as a SPA.

## Notes

- Lovable's "Publish" still deploys to Lovable hosting independently — both
  deployments can run side by side from the same repo.
- Backend (Lovable Cloud / Supabase) is unchanged: it's an external API from
  Vercel's perspective and works the same way.

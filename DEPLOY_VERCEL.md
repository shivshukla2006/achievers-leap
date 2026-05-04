# Deploying to Vercel

This project is a TanStack Start app. It runs on Lovable's hosting by default
(Cloudflare Workers under the hood). The config below also lets you deploy the
exact same codebase to Vercel.

## How it works

`vite.config.ts` checks for the `VERCEL=1` environment variable (Vercel sets
this automatically during builds). When present, it:

1. Disables the Cloudflare plugin from the Lovable preset.
2. Tells TanStack Start to use the `vercel` deployment target, which emits the
   Vercel Build Output API in `.vercel/output/`.

`vercel.json` points Vercel at that output directory.

Locally, none of this changes — `bun run dev` and `bun run build` still target
Cloudflare for Lovable's preview/publish.

## One-time setup on Vercel

1. Push this repo to GitHub (use Lovable's GitHub sync).
2. In Vercel, **New Project → Import** the repo.
3. Framework preset: **Other** (the `vercel.json` already configures everything).
4. Add Environment Variables (copy from your `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — do NOT prefix with `VITE_`)
   - Any other secrets your server functions read from `process.env`.
5. Deploy. Vercel will run `bun install && bun run build`, detect `VERCEL=1`,
   and produce the Vercel Build Output that supports SSR + server functions.

## Notes

- Server functions (`createServerFn`) work on Vercel as Node.js serverless
  functions. No code changes required.
- Lovable Cloud (Supabase) keeps working — it's just an external API from
  Vercel's perspective.
- Lovable's "Publish" button still deploys to Lovable hosting independently.
  You can keep both deployments running side by side.

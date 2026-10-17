# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev               # Next.js dev server, http://localhost:3000 (Jean's page at /jean)
npm run build             # Static export to ./out
npm run lint              # ESLint (eslint-config-next)
npm run typecheck:worker  # Type-check the Cloudflare Worker (worker/tsconfig.json)
npm run preview           # build + `wrangler dev`: http://localhost:8787 and http://jean.localhost:8787
npm run deploy            # build + `wrangler deploy`
npm run cf-typegen        # Regenerate worker-configuration.d.ts (global `Env` type)
```

There is no test suite. The README uses npm, but both `package-lock.json` and `pnpm-lock.yaml` are committed.

## Architecture

Site for humanoydev.com and jean.humanoydev.com. Content and code comments are in Spanish; keep them that way.

- **Static export + Worker.** `next.config.ts` sets `output: "export"`, so there's no Next server at runtime: no route handlers, middleware, server actions, image optimization (`images.unoptimized`), or `cacheComponents`. Next builds HTML to `./out`, and `worker/index.ts` serves it as Cloudflare static assets (`wrangler.jsonc`, `run_worker_first: true`).
- **Subdomain routing is in the Worker, not Next.** `jean.<host>/` is rewritten to `/jean`; asset paths (`/_next/*`, files with extensions) pass through on the subdomain; any other path on `jean.` redirects 301 to the apex. On the production apex, `/jean` redirects 301 to `jean.humanoydev.com`, and `www` redirects to the apex. If you add a page meant for the jean subdomain, or change asset paths, update `worker/index.ts` too. Plain `npm run dev` doesn't exercise any of this; use `npm run preview`.
- **Route layout.** `src/app/(site)/` holds the main site pages and shares the header/footer layout. `src/app/jean/` sits outside that group on purpose, so it has its own chrome.
- **Content lives in `src/content/site.ts`.** Posts, talks, projects, categories, contact email and public URLs (`SITE_URL`/`JEAN_URL`, which `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_JEAN_URL` can override) are all there. Edit content there, not in the components. `href: "#"` marks a placeholder link.
- **Styling** is one global stylesheet, `src/app/globals.css`, with design tokens as CSS variables on `:root`. There's no Tailwind and there are no CSS modules. Fonts are self-hosted via `@fontsource-variable/*` and imported in `src/app/layout.tsx`.

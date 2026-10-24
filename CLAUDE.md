# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev               # Next.js dev server, http://localhost:3000 (Jean's page at /jean)
npm run build             # Static export to ./out
npm run lint              # ESLint (eslint-config-next)
npm run typecheck:worker  # Type-check the Cloudflare Worker (worker/tsconfig.json)
npm run preview           # build + `wrangler dev`: http://localhost:8787, http://jean.localhost:8787, http://jeanpaulandre.localhost:8787
npm run deploy            # build + `wrangler deploy`
npm run cf-typegen        # Regenerate worker-configuration.d.ts (global `Env` type)
npx wrangler d1 migrations apply jeanpaulandre --local -c wrangler.local.jsonc  # D1 schema for preview (--remote for production)
```

Requires Node 22+ (`.nvmrc`; run `nvm use` first): Wrangler refuses to start on Node 20. There is no test suite. The README uses npm, but both `package-lock.json` and `pnpm-lock.yaml` are committed.

## Architecture

Site for humanoydev.com and jean.humanoydev.com. Content is in Spanish with an English version under `/en`; code comments are in Spanish; keep them that way.

- **Static export + Worker.** `next.config.ts` sets `output: "export"`, so there's no Next server at runtime: no route handlers, middleware, server actions, image optimization (`images.unoptimized`), or `cacheComponents`. Next builds HTML to `./out`, and `worker/index.ts` serves it as Cloudflare static assets (`wrangler.jsonc`, `run_worker_first: true`).
- **Subdomain routing is in the Worker, not Next.** `jean.<host>/` is rewritten to `/jean` and `jean.<host>/en` to `/en/jean`; asset paths (`/_next/*`, files with extensions) pass through on the subdomain; any other path on `jean.` redirects 301 to the apex. On the production apex, `/jean` redirects 301 to `jean.humanoydev.com` (and `/en/jean` to `jean.humanoydev.com/en`), and `www` redirects to the apex. If you add a page meant for the jean subdomain, or change asset paths, update `worker/index.ts` too. The Worker also adds security headers (`SECURITY_HEADERS`) to every response. Plain `npm run dev` doesn't exercise any of this; use `npm run preview`.
- **Route layout.** There are two root layouts, one per language, each setting its own `<html lang>`: `src/app/(es)/` (Spanish, unprefixed URLs) and `src/app/(en)/en/` (English, under `/en`, with English slugs like `/en/explore`). Inside each, `(site)/` holds the main site pages and shares the header/footer layout, and `jean/` sits outside that group on purpose, so it has its own chrome. Because there is no single root layout, the 404 is `src/app/global-not-found.tsx` (needs `experimental.globalNotFound`); `src/app/(en)/en/404/` exports `out/en/404.html`, which Cloudflare's `404-page` handling serves for broken URLs under `/en`; and fonts/CSS are imported from `src/app/styles.ts`.
- **Bilingual (ES/EN): every addition or change goes in both languages, in the same change.** That covers content (`site.ts` ↔ `site.en.ts`), pages (`(es)/…` ↔ `(en)/en/…`) and component copy. If you're given text in only one language, translate it and flag the translation for review. Every page exists in both languages as separate files; when you change a page, change its counterpart too. `src/content/i18n.ts` maps each page's ES and EN paths: it drives the header's language switch and the `hreflang` alternates (`pageAlternates`). Add new pages there.
- **Jean Paul André's site (`jeanpaulandre.humanoydev.com`)** is the exception to the bilingual rule: Spanish only. Its page is `src/app/(es)/jeanpaulandre/`, its content `src/content/jeanpaulandre.ts`, its styles the `.jpa` block in `globals.css` (it redefines the tokens), and it's `noindex` (a minor's site, shared only with family). The Worker routes it through `SUBSITES`, like `jean.`. Its baby shower invitation (`/babyshower?i=<token>`) and guest admin (`/admin`) talk to the Worker's API on that subdomain (`/api/*`, `worker/babyshower.ts`): guests, visits and RSVPs live in D1 (binding `DB`, schema in `migrations/`); the venue is the `BABYSHOWER_VENUE` secret (`.dev.vars` locally) because the repo is public; `/api/admin/*` requires a Cloudflare Access JWT (`ACCESS_TEAM_DOMAIN`/`ACCESS_AUD` vars), and with those empty it's only open on `*.localhost`.
- **Content lives in `src/content/site.ts`.** Posts, talks, projects, categories, contact email and public URLs (`SITE_URL`/`JEAN_URL`, which `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_JEAN_URL` can override) are all there. Edit content there, not in the components. The English copy is in `src/content/site.en.ts`; keep both in sync. `href: "#"` marks a placeholder link.
- **Styling** is one global stylesheet, `src/app/globals.css`, with design tokens as CSS variables on `:root`. There's no Tailwind and there are no CSS modules. Fonts are self-hosted via `@fontsource-variable/*` and imported in `src/app/layout.tsx`.

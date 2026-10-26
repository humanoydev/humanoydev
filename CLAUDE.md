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

Site for humanoydev.com, jean.humanoydev.com and jeanpaulandre.humanoydev.com (see its own section below). Content is in Spanish with an English version under `/en`; code comments are in Spanish; keep them that way.

- **Static export + Worker.** `next.config.ts` sets `output: "export"`, so there's no Next server at runtime: no route handlers, middleware, server actions, image optimization (`images.unoptimized`), or `cacheComponents`. Next builds HTML to `./out`, and `worker/index.ts` serves it as Cloudflare static assets (`wrangler.jsonc`, `run_worker_first: true`).
- **Subdomain routing is in the Worker, not Next.** `jean.<host>/` is rewritten to `/jean` and `jean.<host>/en` to `/en/jean`; asset paths (`/_next/*`, files with extensions) pass through on the subdomain; any other path on `jean.` redirects 301 to the apex. On the production apex, `/jean` redirects 301 to `jean.humanoydev.com` (and `/en/jean` to `jean.humanoydev.com/en`), and `www` redirects to the apex. If you add a page meant for the jean subdomain, or change asset paths, update `worker/index.ts` too. The Worker also adds security headers (`SECURITY_HEADERS`) to every response. Plain `npm run dev` doesn't exercise any of this; use `npm run preview`.
- **Route layout.** There are two root layouts, one per language, each setting its own `<html lang>`: `src/app/(es)/` (Spanish, unprefixed URLs) and `src/app/(en)/en/` (English, under `/en`, with English slugs like `/en/explore`). Inside each, `(site)/` holds the main site pages and shares the header/footer layout, and `jean/` sits outside that group on purpose, so it has its own chrome. Because there is no single root layout, the 404 is `src/app/global-not-found.tsx` (needs `experimental.globalNotFound`); `src/app/(en)/en/404/` exports `out/en/404.html`, which Cloudflare's `404-page` handling serves for broken URLs under `/en`; and fonts/CSS are imported from `src/app/styles.ts`.
- **Bilingual (ES/EN): every addition or change goes in both languages, in the same change.** That covers content (`site.ts` ↔ `site.en.ts`), pages (`(es)/…` ↔ `(en)/en/…`) and component copy. If you're given text in only one language, translate it and flag the translation for review. Every page exists in both languages as separate files; when you change a page, change its counterpart too. `src/content/i18n.ts` maps each page's ES and EN paths: it drives the header's language switch and the `hreflang` alternates (`pageAlternates`). Add new pages there.
- **Jean Paul André's site (`jeanpaulandre.humanoydev.com`)** is the exception to the bilingual rule: Spanish only. See [Jean Paul André's site](#jean-paul-andrés-site-jeanpaulandrehumanoydevcom).
- **Content lives in `src/content/site.ts`.** Posts, talks, projects, categories, contact email and public URLs (`SITE_URL`/`JEAN_URL`, which `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_JEAN_URL` can override) are all there. Edit content there, not in the components. The English copy is in `src/content/site.en.ts`; keep both in sync. `href: "#"` marks a placeholder link.
- **Styling** is one global stylesheet, `src/app/globals.css`, with design tokens as CSS variables on `:root`. There's no Tailwind and there are no CSS modules. Fonts are self-hosted via `@fontsource-variable/*` and imported in `src/app/layout.tsx`.

## Jean Paul André's site (`jeanpaulandre.humanoydev.com`)

The site of Jean's son, a "time capsule" meant to grow with him (chapters: I · La espera = baby shower, II · Llegaste = birth, still unwritten). Spanish only, `noindex` (a minor's site, shared only with family). The repo is public: keep anything private out of it.

- **Files.** Pages in `src/app/(es)/jeanpaulandre/` (`/`, `/babyshower`, `/admin`, `og.png/route.tsx`; `layout.tsx` only wraps them in `.jpa`). Content in `src/content/jeanpaulandre.ts`, components in `src/components/jeanpaulandre/`. Two separate design lines in `globals.css`: the invitation (`/babyshower`, `.jpa*` blocks: warm pastels, Fredoka, Newsreader, page-wide `BubbleField`, `Parallax`, toys and music; it opens behind an `Envelope` overlay whose tap is the user gesture browsers require for audio, and that dispatches `jpa:opened` to start `ToyShow`) and the home page, the time capsule (`.jpc*` blocks: blue/lavender keepsake album, Fraunces, Nunito, Caveat, `Reveal` on scroll). Keep them apart; Jean wants the home page to look different from the invitation. The Worker routes it through `SUBSITES`, like `jean.`; paths are served without the `/jeanpaulandre` prefix, so internal links use `<a href="/…">`, never `<Link>` (it would navigate client-side to humanoydev's own `/`).
- **Baby shower API** (`worker/babyshower.ts`, only on that subdomain): `POST /api/invite` (opens an invitation by token and logs the visit), `POST /api/invite` also stores per-visit data to spot forwarded links: a random per-browser id (localStorage `jpa-device`), the phone model (Android only), Cloudflare's city/country and a salted hash of the IP's network (never the IP); the admin flags "Posible reenvío" when there's more than one device and another network or city. `PUT /api/rsvp` (saves the answer and emails the parents via `ctx.waitUntil`), `PUT /api/gifts` (the gift list, with units taken, only comes with a personal invitation in `/api/invite`; a guest reserves or releases units, checked against `max` in a single conditional INSERT, 409 when someone got there first; no email), and `/api/admin/guests` (list/add/edit name and phone/delete, with each guest's gifts; editing keeps the token, so the link sent stays valid). The gift list itself is a draft meant to be refined: it lives in `src/content/jeanpaulandre-gifts.ts` (the Worker imports it), and D1 only stores each guest's picks (`gift_picks`, by gift `id`, so don't rename ids that were already picked). Guests, visits and RSVPs live in D1 (binding `DB`, database `jeanpaulandre`, schema in `migrations/`). Tokens are 10 random alphanumerics. A guest's `name` is the greeting and may be empty ("¡Hola!"); `alias` is a private label for the parents (admin and emails) and never reaches the invitation; a guest needs at least one of the two. Bulk add takes "name, alias, phone" per line (alias defaults to the name). `side` (`papa`/`mama`/`ambos`) marks whose guest it is, chosen for the whole batch; admin only.
- **Private data lives in Worker secrets, not in the repo**: `BABYSHOWER_VENUE` (JSON: `name`, `address`, `note`, `lat`, `lng`, `mapsUrl`, `uberName`, `uberNote`), `BABYSHOWER_PHOTOS` (optional JSON `[{src, alt, caption?}]` pointing to `/jeanpaulandre/images/lugar/…`; the Worker adds it to the venue as `photos`), `NOTIFY_TO` (comma-separated recipients) and `NETWORK_SALT` (salt for the visit network hash). Locally they're in `.dev.vars` (gitignored). Update with `wrangler secret put` (no redeploy needed). The ultrasound video and poster and the venue photos (`images/lugar/`) in `public/jeanpaulandre/` are gitignored too: they only exist on Jean's Mac, so deploy from there.
- **Admin auth.** Cloudflare Access protects `/admin` and `/api/admin` (policy "Papá y Mamá"), and the Worker verifies the Access JWT itself (`ACCESS_TEAM_DOMAIN`/`ACCESS_AUD` in `wrangler.jsonc` vars). They're empty in `wrangler.local.jsonc`, so locally the admin is open on `*.localhost` only; in production, empty vars deny everything.
- **Email.** `send_email` binding `NOTIFY_EMAIL`, sending from `babyshower@humanoydev.com` through Email Routing (recipients must be verified destination addresses).
- **Local data.** After a fresh clone: `npx wrangler d1 migrations apply jeanpaulandre --local -c wrangler.local.jsonc`, then add guests at `http://jeanpaulandre.localhost:8787/admin`.

### Gotchas we already hit

- `next build` wipes `./out`, and a running `wrangler dev` crashes when it does: restart it after each build. Two `wrangler dev` processes at once lock the local D1 (`SQLITE_BUSY`).
- MapLibre (venue map, OpenFreeMap tiles, loaded only on personal invitations): under Turbopack its worker URL isn't http(s), so it's set explicitly with `setWorkerUrl` (jsDelivr, same version). Its CSS sets `position: relative` on the container, hence `.jpa__venue .jpa__map-canvas`. CARTO and tile.openstreetmap.org tiles don't work without a key / are blocked.
- `og.png` is generated with `ImageResponse` (satori): inside an `<svg>` it only accepts intrinsic elements and no `<text>`. That's why `Doodles.tsx` builds SVG parts with functions (`eye()`, `bearFace()`, `block()`) instead of components, and `Blocks letters={false}` draws the letters on top. Fonts must be woff/ttf (`assets/fonts/`, OFL).
- Toys (`Toy.tsx`): `.jpa .jpa-toy { display: block }` beats single-class rules, so hiding a toy on mobile needs `.jpa .jpa-toy.<class> { display: none }`. Parallax uses `translate`, idle/reaction animations use `transform`, so they don't clash; don't center a toy with `translate`.
- Anything in front of the page-wide bubbles canvas needs `position: relative` (e.g. `.jpa__footer`, `.jpa-admin`).
- Safari only plays video with HTTP range requests; the Worker answers them (`withRangeSupport`).
- WhatsApp links use `api.whatsapp.com/send` (not `wa.me`, whose redirect breaks some emoji). Uber deep links: open `uber://` first on mobile (the universal link loses the destination when not intercepted), replace `+` with a full-width `＋`, and note that Uber titles the drop-off by its nearest known place regardless of `nickname`.


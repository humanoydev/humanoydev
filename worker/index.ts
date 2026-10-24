/**
 * Worker de humanoydev.
 *
 * Sirve el export estático de Next.js (carpeta /out) y resuelve el enrutamiento
 * por subdominio, que Next.js no puede hacer en modo `output: "export"`:
 *
 *   humanoydev.com/            → sitio principal
 *   jean.humanoydev.com/       → contenido de /jean
 *   jean.humanoydev.com/en     → contenido de /en/jean (versión en inglés)
 *   jean.humanoydev.com/x/     → archivos estáticos de public/jean/x/ (p. ej. diapositivas)
 *   humanoydev.com/jean/x      → redirección 301 a jean.humanoydev.com/x
 *   humanoydev.com/en/jean     → redirección 301 a jean.humanoydev.com/en
 *   www.humanoydev.com/*       → redirección 301 a humanoydev.com
 *   jean.humanoydev.com/otra   → redirección 301 a humanoydev.com/otra
 *
 * jeanpaulandre.humanoydev.com funciona igual con /jeanpaulandre (sin versión en inglés),
 * y además atiende la API del baby shower en /api/* (worker/babyshower.ts).
 *
 * En local funciona con http://localhost:8787, http://jean.localhost:8787
 * y http://jeanpaulandre.localhost:8787.
 */

// El tipo global `Env` lo genera `npm run cf-typegen` (worker-configuration.d.ts).

import { handleBabyShowerApi } from "./babyshower";

const APEX = "humanoydev.com";

// Subdominios que sirven una sección del export estático como su raíz.
// `en`: tiene versión en inglés en /en/<seccion>.
type Subsite = { subdomain: string; section: string; en: boolean };
const SUBSITES: Subsite[] = [
  { subdomain: "jean", section: "/jean", en: true },
  { subdomain: "jeanpaulandre", section: "/jeanpaulandre", en: false },
];

// Archivos que las páginas de los subdominios necesitan en su propio subdominio.
function isAsset(pathname: string): boolean {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

// Las redirecciones de los assets (p. ej. añadir la barra final) apuntan a /jean/...;
// en el subdominio deben apuntar a la ruta sin el prefijo.
function withoutSectionPrefix(response: Response, section: string): Response {
  const location = response.headers.get("Location");
  if (!location?.startsWith(`${section}/`)) return response;
  const fixed = new Response(response.body, response);
  fixed.headers.set("Location", location.slice(section.length));
  return fixed;
}

// Cabeceras de seguridad para todas las respuestas, redirecciones incluidas.
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
};

function withSecurityHeaders(response: Response): Response {
  // Las respuestas de ASSETS y Response.redirect tienen cabeceras inmutables.
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value);
  return secured;
}

// Safari (iPhone) solo reproduce un video si el servidor responde pedidos por rango (206),
// y los assets siempre devuelven el archivo completo. Para videos, el rango se resuelve aquí.
async function withRangeSupport(request: Request, response: Response): Promise<Response> {
  if (request.method !== "GET" || response.status !== 200) return response;
  if (!response.headers.get("Content-Type")?.startsWith("video/")) return response;

  const body = await response.arrayBuffer();
  const size = body.byteLength;
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range") ?? "");
  if (!match || (match[1] === "" && match[2] === "")) return new Response(body, { status: 200, headers });

  // "bytes=-N" pide los últimos N bytes.
  const start = match[1] === "" ? Math.max(0, size - Number(match[2])) : Number(match[1]);
  const end = match[1] !== "" && match[2] !== "" ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start > end) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}

async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const host = url.hostname;
  const isProduction = host === APEX || host.endsWith(`.${APEX}`);

  // www → dominio raíz
  if (host === `www.${APEX}`) {
    url.hostname = APEX;
    return Response.redirect(url.toString(), 301);
  }

  // API del baby shower (jeanpaulandre.humanoydev.com/api/...)
  if (host.startsWith("jeanpaulandre.") && url.pathname.startsWith("/api/")) {
    return handleBabyShowerApi(request, env, ctx, url);
  }

  // jean.humanoydev.com, jeanpaulandre.humanoydev.com (o *.localhost en desarrollo)
  const subsite = SUBSITES.find((s) => host.startsWith(`${s.subdomain}.`));
  if (subsite) {
    const { section } = subsite;
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const rewritten = new URL(url);
      rewritten.pathname = section;
      return env.ASSETS.fetch(new Request(rewritten, request));
    }
    if (subsite.en && (url.pathname === "/en" || url.pathname === "/en/")) {
      const rewritten = new URL(url);
      rewritten.pathname = `/en${section}`;
      return env.ASSETS.fetch(new Request(rewritten, request));
    }
    // Páginas y archivos de la sección (p. ej. public/jean/) se sirven sin el prefijo.
    if (!url.pathname.startsWith("/_next/")) {
      const rewritten = new URL(url);
      rewritten.pathname = `${section}${url.pathname}`;
      const response = await env.ASSETS.fetch(new Request(rewritten, request));
      if (response.status !== 404) return withoutSectionPrefix(response, section);
    }
    if (isAsset(url.pathname)) {
      return env.ASSETS.fetch(request);
    }
    // Cualquier otra página pertenece al sitio principal.
    const target = new URL(url);
    target.hostname = host.slice(subsite.subdomain.length + 1);
    return Response.redirect(target.toString(), 301);
  }

  if (isProduction) {
    for (const { subdomain, section, en } of SUBSITES) {
      // URL canónica de la versión en inglés
      if (en && (url.pathname === `/en${section}` || url.pathname === `/en${section}/`)) {
        const target = new URL(url);
        target.hostname = `${subdomain}.${APEX}`;
        target.pathname = "/en";
        return Response.redirect(target.toString(), 301);
      }
      // URL canónica de la sección
      if (url.pathname === section || url.pathname.startsWith(`${section}/`)) {
        const target = new URL(url);
        target.hostname = `${subdomain}.${APEX}`;
        target.pathname = url.pathname.slice(section.length) || "/";
        return Response.redirect(target.toString(), 301);
      }
    }
  }

  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return withSecurityHeaders(await withRangeSupport(request, await route(request, env, ctx)));
  },
} satisfies ExportedHandler<Env>;

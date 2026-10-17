/**
 * Worker de humanoydev.
 *
 * Sirve el export estático de Next.js (carpeta /out) y resuelve el enrutamiento
 * por subdominio, que Next.js no puede hacer en modo `output: "export"`:
 *
 *   humanoydev.com/            → sitio principal
 *   jean.humanoydev.com/       → contenido de /jean
 *   jean.humanoydev.com/x/     → archivos estáticos de public/jean/x/ (p. ej. diapositivas)
 *   humanoydev.com/jean/x      → redirección 301 a jean.humanoydev.com/x
 *   www.humanoydev.com/*       → redirección 301 a humanoydev.com
 *   jean.humanoydev.com/otra   → redirección 301 a humanoydev.com/otra
 *
 * En local funciona con http://localhost:8787 y http://jean.localhost:8787.
 */

// El tipo global `Env` lo genera `npm run cf-typegen` (worker-configuration.d.ts).

const APEX = "humanoydev.com";
const JEAN_PREFIX = "jean.";

// Archivos que la página de jean necesita en su propio subdominio.
function isAsset(pathname: string): boolean {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

// Las redirecciones de los assets (p. ej. añadir la barra final) apuntan a /jean/...;
// en el subdominio deben apuntar a la ruta sin el prefijo.
function withoutJeanPrefix(response: Response): Response {
  const location = response.headers.get("Location");
  if (!location?.startsWith("/jean/")) return response;
  const fixed = new Response(response.body, response);
  fixed.headers.set("Location", location.slice("/jean".length));
  return fixed;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname;
    const isProduction = host === APEX || host.endsWith(`.${APEX}`);

    // www → dominio raíz
    if (host === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }

    // jean.humanoydev.com (o jean.localhost en desarrollo)
    if (host.startsWith(JEAN_PREFIX)) {
      if (url.pathname === "/" || url.pathname === "/index.html") {
        const rewritten = new URL(url);
        rewritten.pathname = "/jean";
        return env.ASSETS.fetch(new Request(rewritten, request));
      }
      // Archivos de public/jean/ (p. ej. diapositivas) se sirven sin el prefijo /jean.
      if (!url.pathname.startsWith("/_next/")) {
        const rewritten = new URL(url);
        rewritten.pathname = `/jean${url.pathname}`;
        const response = await env.ASSETS.fetch(new Request(rewritten, request));
        if (response.status !== 404) return withoutJeanPrefix(response);
      }
      if (isAsset(url.pathname)) {
        return env.ASSETS.fetch(request);
      }
      // Cualquier otra página pertenece al sitio principal.
      const target = new URL(url);
      target.hostname = host.slice(JEAN_PREFIX.length);
      return Response.redirect(target.toString(), 301);
    }

    // URL canónica de la página de Jean en producción
    if (isProduction && (url.pathname === "/jean" || url.pathname.startsWith("/jean/"))) {
      const target = new URL(url);
      target.hostname = `${JEAN_PREFIX}${APEX}`;
      target.pathname = url.pathname.slice("/jean".length) || "/";
      return Response.redirect(target.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

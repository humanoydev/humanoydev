/**
 * Worker de humanoydev.
 *
 * Sirve el export estático de Next.js (carpeta /out) y resuelve el enrutamiento
 * por subdominio, que Next.js no puede hacer en modo `output: "export"`:
 *
 *   humanoydev.com/            → sitio principal
 *   jean.humanoydev.com/       → contenido de /jean
 *   humanoydev.com/jean        → redirección 301 a jean.humanoydev.com
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
      return Response.redirect(`https://${JEAN_PREFIX}${APEX}/`, 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

# humanoydev

Sitio de [humanoydev.com](https://humanoydev.com) y [jean.humanoydev.com](https://jean.humanoydev.com).

Next.js (App Router) exportado como HTML estático y servido desde un Cloudflare Worker con static assets.
El Worker se encarga de lo que un export estático no puede hacer: enrutar por subdominio y las redirecciones.

## Estructura

```
src/app/(site)/        Páginas de humanoydev.com: inicio, explorar, comunidad, acerca
src/app/jean/          Página de jean.humanoydev.com (el Worker reescribe "/" → "/jean")
src/components/        Encabezado, pie, marca, listas
src/content/site.ts    Contenido editable: publicaciones, charlas, proyectos, URLs y correo
worker/index.ts        Enrutamiento por subdominio y redirecciones
wrangler.jsonc         Configuración del Worker y de los assets (./out)
```

## Desarrollo

```bash
npm install
npm run dev        # Next.js en http://localhost:3000 (la página de Jean está en /jean)
npm run preview    # build + Worker local: http://localhost:8787 y http://jean.localhost:8787
```

## Publicar

```bash
npx wrangler login
npm run deploy     # next build + wrangler deploy
```

Para usar el dominio propio, `humanoydev.com` debe estar en tu cuenta de Cloudflare.
Luego descomenta `routes` en `wrangler.jsonc` y vuelve a ejecutar `npm run deploy`.

## Pendientes

- Correo de contacto en `src/content/site.ts` (`CONTACT_EMAIL`).
- Enlaces reales de diapositivas y proyectos (los `href: "#"`).
- Título y fecha de la charla en GDG Lima.
- Foto en `src/app/jean/page.tsx`.
- Versión en inglés (enlace "EN") y formulario de la newsletter.

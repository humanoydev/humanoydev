/**
 * API del baby shower de Jean Paul André, en jeanpaulandre.humanoydev.com/api/...
 *
 *   POST /api/invite  { token }                       → datos de la invitación; registra la visita
 *   PUT  /api/rsvp    { token, attending, message }   → guarda (o cambia) la respuesta
 *
 * Administración (protegida con Cloudflare Access, ver isAdmin):
 *   GET    /api/admin/guests                      → invitados con visitas y respuesta
 *   POST   /api/admin/guests  { guests: [{ name, phone? }] } → agrega invitados con su token
 *   DELETE /api/admin/guests/:id                  → elimina un invitado (y sus visitas y respuesta)
 *
 * Cada respuesta manda un aviso por correo a papá y mamá (ver notifyRsvp).
 *
 * Invitados, visitas y respuestas viven en D1 (binding DB, migrations/). El lugar está en el
 * secreto BABYSHOWER_VENUE (JSON) y no en el código: el repo es público y la dirección solo
 * la ve quien tiene un link personal.
 */

type Guest = { id: number; name: string };
type Body = Record<string, unknown>;

const NO_STORE = { "Cache-Control": "no-store" };

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: NO_STORE });
}

async function readBody(request: Request): Promise<Body | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" ? (body as Body) : null;
  } catch {
    return null;
  }
}

// Los tokens son alfanuméricos; cualquier otra cosa ni se consulta.
async function findGuest(env: Env, token: unknown): Promise<Guest | null> {
  if (typeof token !== "string" || !/^[A-Za-z0-9]{6,32}$/.test(token)) return null;
  return env.DB.prepare("SELECT id, name FROM guests WHERE token = ?").bind(token).first<Guest>();
}

async function openInvite(request: Request, env: Env): Promise<Response> {
  const guest = await findGuest(env, (await readBody(request))?.token);
  if (!guest) return json({ error: "not_found" }, 404);

  const [rsvp] = await env.DB.batch<{ attending: number; message: string }>([
    env.DB.prepare("SELECT attending, message FROM rsvps WHERE guest_id = ?").bind(guest.id),
    env.DB.prepare("INSERT INTO visits (guest_id, user_agent) VALUES (?, ?)").bind(
      guest.id,
      request.headers.get("User-Agent")?.slice(0, 300) ?? null,
    ),
  ]);
  const answer = rsvp.results[0];
  return json({
    name: guest.name,
    venue: JSON.parse(env.BABYSHOWER_VENUE),
    rsvp: answer ? { attending: answer.attending === 1, message: answer.message } : null,
  });
}

// Aviso por correo a papá y mamá cuando alguien responde. Usa el envío de correo de Cloudflare
// (binding NOTIFY_EMAIL: requiere Email Routing en humanoydev.com con las direcciones
// verificadas) y las direcciones del secreto NOTIFY_TO, separadas por comas. Si falta algo o
// falla, no se envía nada: la respuesta ya quedó guardada.
async function notifyRsvp(env: Env, origin: string, name: string, attending: boolean, message: string) {
  // Sin el secreto (p. ej. en otro entorno), NOTIFY_TO llega vacío aunque el tipo diga string.
  const mailer = env.NOTIFY_EMAIL;
  const to = env.NOTIFY_TO?.split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (!mailer || !to?.length) return;

  const answer = attending ? "va al baby shower" : "no podrá ir";
  try {
    await mailer.send({
      from: { name: "Baby shower de Jean Paul André", email: "babyshower@humanoydev.com" },
      to,
      subject: `${attending ? "✅" : "❌"} ${name} ${answer}${attending ? " 🎉" : ""}`,
      text: [
        `${name} ${answer}.`,
        message && `Su mensaje para Jean Paul André:\n“${message}”`,
        `Ver todos los invitados: ${origin}/admin`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });
  } catch (error) {
    console.error("No se pudo enviar el aviso de la respuesta", error);
  }
}

async function saveRsvp(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const body = await readBody(request);
  const guest = await findGuest(env, body?.token);
  if (!guest) return json({ error: "not_found" }, 404);
  const message = body?.message ?? "";
  if (typeof body?.attending !== "boolean" || typeof message !== "string") return json({ error: "invalid" }, 400);

  await env.DB.prepare(
    `INSERT INTO rsvps (guest_id, attending, message, updated_at) VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT (guest_id) DO UPDATE SET attending = excluded.attending, message = excluded.message, updated_at = excluded.updated_at`,
  )
    .bind(guest.id, body.attending ? 1 : 0, message.trim().slice(0, 1000))
    .run();
  // El aviso sale después de responder, sin hacer esperar al invitado.
  ctx.waitUntil(
    notifyRsvp(env, new URL(request.url).origin, guest.name, body.attending, message.trim().slice(0, 1000)),
  );
  return new Response(null, { status: 204, headers: NO_STORE });
}

// --- Administración ---

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

// Cloudflare Access protege /admin y /api/admin/* y manda un JWT firmado en
// Cf-Access-Jwt-Assertion. Lo verificamos igual (firma, audiencia, emisor y vencimiento):
// si Access quedara mal configurado, la API no se abre. Sin ACCESS_TEAM_DOMAIN/ACCESS_AUD
// se niega todo, salvo en local (*.localhost), donde no hay Access.
async function isAdmin(request: Request, env: Env, url: URL): Promise<boolean> {
  const team = env.ACCESS_TEAM_DOMAIN;
  const audience = env.ACCESS_AUD;
  if (!team || !audience) return url.hostname.endsWith(".localhost");

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  const [header, payload, signature] = token?.split(".") ?? [];
  if (!header || !payload || !signature) return false;
  try {
    const { kid } = JSON.parse(new TextDecoder().decode(base64UrlDecode(header)));
    const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    const { keys } = await (
      await fetch(`${team}/cdn-cgi/access/certs`)
    ).json<{ keys: (JsonWebKey & { kid: string })[] }>();
    const jwk = keys.find((key) => key.kid === kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, [
      "verify",
    ]);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64UrlDecode(signature),
      new TextEncoder().encode(`${header}.${payload}`),
    );
    const audiences: unknown[] = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    return valid && audiences.includes(audience) && claims.iss === team && claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Token de 10 caracteres alfanuméricos al azar (~59 bits): imposible de adivinar.
function newToken(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function listGuests(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT g.id, g.token, g.name, g.phone, g.created_at AS createdAt,
            COUNT(v.id) AS visits, MAX(v.visited_at) AS lastVisit,
            r.attending, r.message, r.updated_at AS answeredAt
     FROM guests g
     LEFT JOIN visits v ON v.guest_id = g.id
     LEFT JOIN rsvps r ON r.guest_id = g.id
     GROUP BY g.id
     ORDER BY g.id DESC`,
  ).all<{ attending: number | null }>();
  return json(results.map((row) => ({ ...row, attending: row.attending === null ? null : row.attending === 1 })));
}

async function addGuests(request: Request, env: Env): Promise<Response> {
  const list = (await readBody(request))?.guests;
  if (!Array.isArray(list) || list.length === 0 || list.length > 300) return json({ error: "invalid" }, 400);
  const guests = list.map((item) => ({
    name: typeof item?.name === "string" ? item.name.trim().slice(0, 80) : "",
    phone: typeof item?.phone === "string" ? item.phone.replace(/[^\d+]/g, "").slice(0, 20) || null : null,
  }));
  if (guests.some((guest) => !guest.name)) return json({ error: "invalid" }, 400);

  await env.DB.batch(
    guests.map((guest) =>
      env.DB.prepare("INSERT INTO guests (token, name, phone) VALUES (?, ?, ?)").bind(
        newToken(),
        guest.name,
        guest.phone,
      ),
    ),
  );
  return json({ added: guests.length }, 201);
}

async function deleteGuest(env: Env, id: string): Promise<Response> {
  // Las visitas y la respuesta se borran en cascada; por si D1 no aplica las claves foráneas, también a mano.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM visits WHERE guest_id = ?").bind(id),
    env.DB.prepare("DELETE FROM rsvps WHERE guest_id = ?").bind(id),
    env.DB.prepare("DELETE FROM guests WHERE id = ?").bind(id),
  ]);
  return new Response(null, { status: 204, headers: NO_STORE });
}

async function handleAdmin(request: Request, env: Env, url: URL): Promise<Response> {
  if (!(await isAdmin(request, env, url))) return json({ error: "forbidden" }, 403);
  if (url.pathname === "/api/admin/guests" && request.method === "GET") return listGuests(env);
  if (url.pathname === "/api/admin/guests" && request.method === "POST") return addGuests(request, env);
  const match = /^\/api\/admin\/guests\/(\d+)$/.exec(url.pathname);
  if (match && request.method === "DELETE") return deleteGuest(env, match[1]);
  return json({ error: "not_found" }, 404);
}

export async function handleBabyShowerApi(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  if (url.pathname.startsWith("/api/admin/")) return handleAdmin(request, env, url);
  if (url.pathname === "/api/invite" && request.method === "POST") return openInvite(request, env);
  if (url.pathname === "/api/rsvp" && request.method === "PUT") return saveRsvp(request, env, ctx);
  return json({ error: "not_found" }, 404);
}

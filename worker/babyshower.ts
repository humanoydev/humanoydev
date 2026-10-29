/**
 * API del baby shower de Jean Paul André, en jeanpaulandre.humanoydev.com/api/...
 *
 *   POST /api/invite  { token, device?, model? }      → datos de la invitación; registra la visita
 *   PUT  /api/rsvp    { token, attending, message }   → guarda (o cambia) la respuesta
 *   PUT  /api/gifts   { token, giftId, qty }          → aparta qty unidades de un regalo (0: lo suelta)
 *
 * Administración (protegida con Cloudflare Access, ver isAdmin):
 *   GET    /api/admin/guests                      → invitados con visitas y respuesta
 *   POST   /api/admin/guests  { guests: [{ name, phone?, alias?, side? }] } → agrega invitados con su token
 *   PATCH  /api/admin/guests/:id  { name, phone?, alias?, side? } → corrige sus datos (el link no cambia)
 *   POST   /api/admin/guests/:id/sent             → marca la invitación como enviada (guarda la primera vez)
 *   PUT    /api/admin/guests/:id/rsvp  { attending } → anota la respuesta que dio por otro lado (sin correo)
 *   GET    /api/admin/guests/:id/visits           → cada visita: fecha, navegador, ciudad y país
 *   DELETE /api/admin/guests/:id                  → elimina un invitado (y sus visitas, respuesta y regalos)
 *
 * El nombre es el del saludo y puede ir vacío; el alias es solo para papá y mamá (nunca sale en
 * la invitación). Un invitado necesita al menos uno de los dos. `side` dice si es invitado de papá,
 * de mamá o de los dos ("papa", "mama", "ambos"); también es solo para el admin.
 *
 * Cada respuesta (no los regalos) manda un aviso por correo a papá y mamá (ver notifyRsvp).
 *
 * La lista de regalos está en src/content/jeanpaulandre-gifts.ts; lo que aparta cada invitado, en D1.
 *
 * Invitados, visitas y respuestas viven en D1 (binding DB, migrations/). El lugar está en el
 * secreto BABYSHOWER_VENUE (JSON; las fotos, en BABYSHOWER_PHOTOS) y no en el código: el repo es
 * público y la dirección solo la ve quien tiene un link personal.
 */

import { GIFT_LIST } from "../src/content/jeanpaulandre-gifts";

type Guest = { id: number; name: string; alias: string | null };
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

// Cómo lo ven papá y mamá en los correos: "Rocío (Mamá Rocío)", o solo el nombre o el alias.
const guestLabel = ({ name, alias }: Guest) =>
  name && alias && alias !== name ? `${name} (${alias})` : name || alias || "";

// Los tokens son alfanuméricos; cualquier otra cosa ni se consulta.
async function findGuest(env: Env, token: unknown): Promise<Guest | null> {
  if (typeof token !== "string" || !/^[A-Za-z0-9]{6,32}$/.test(token)) return null;
  return env.DB.prepare("SELECT id, name, alias FROM guests WHERE token = ?").bind(token).first<Guest>();
}

// Texto corto y simple que manda el navegador (identificador o modelo); si no, null.
function cleanText(value: unknown, max: number): string | null {
  return typeof value === "string" && /^[\w .()+-]{1,200}$/.test(value) ? value.slice(0, max) : null;
}

// Modelo del teléfono según el User-Agent ("Android 14; SM-A546E;" → "SM-A546E"). Chrome lo
// oculta ("K"); en ese caso lo manda la invitación si el navegador lo informa. iPhone nunca lo dice.
function modelFromUserAgent(ua: string | null): string | null {
  const model = ua?.match(/Android [\d.]+; (?:[a-z]{2}-[a-z]{2}; )?([^;)]+?)(?: Build[^;)]*)?[;)]/)?.[1]?.trim();
  return model && model !== "K" ? cleanText(model, 40) : null;
}

// Red de la visita como hash con sal (NETWORK_SALT) de la IP: permite ver si dos visitas
// vienen de la misma red sin guardar la IP. En IPv6 se usa el prefijo /64 (las operadoras
// rotan el resto de la dirección).
async function networkHash(request: Request, env: Env): Promise<string | null> {
  const ip = request.headers.get("CF-Connecting-IP");
  if (!ip || !env.NETWORK_SALT) return null;
  const network = ip.includes(":") ? ip.split(":").slice(0, 4).join(":") : ip;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${env.NETWORK_SALT}:${network}`));
  return Array.from(new Uint8Array(digest).slice(0, 6), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const GIFTS = new Map(GIFT_LIST.flatMap(({ gifts }) => gifts.map((gift) => [gift.id, gift])));

// La lista de regalos con lo que ya apartaron todos (`taken`, más lo cubierto por fuera de la
// invitación, `covered`) y este invitado (`mine`). Quién apartó qué solo se ve en el admin.
async function giftList(env: Env, guestId: number) {
  const { results } = await env.DB.prepare(
    `SELECT gift_id AS id, SUM(qty) AS taken, SUM(CASE WHEN guest_id = ? THEN qty ELSE 0 END) AS mine
     FROM gift_picks GROUP BY gift_id`,
  )
    .bind(guestId)
    .all<{ id: string; taken: number; mine: number }>();
  const picks = new Map(results.map((row) => [row.id, row]));
  return GIFT_LIST.map(({ category, gifts }) => ({
    category,
    gifts: gifts.map((gift) => ({
      ...gift,
      taken: (picks.get(gift.id)?.taken ?? 0) + (gift.covered ?? 0),
      mine: picks.get(gift.id)?.mine ?? 0,
    })),
  }));
}

async function openInvite(request: Request, env: Env): Promise<Response> {
  const body = await readBody(request);
  const guest = await findGuest(env, body?.token);
  if (!guest) return json({ error: "not_found" }, 404);
  const userAgent = request.headers.get("User-Agent")?.slice(0, 300) ?? null;

  const [rsvp] = await env.DB.batch<{ attending: number; message: string }>([
    env.DB.prepare("SELECT attending, message FROM rsvps WHERE guest_id = ?").bind(guest.id),
    // Navegador, ciudad, país, dispositivo y red de la visita; la IP no se guarda.
    env.DB.prepare(
      `INSERT INTO visits (guest_id, user_agent, city, country, device_id, model, network)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      guest.id,
      userAgent,
      request.cf?.city ?? null,
      request.cf?.country ?? null,
      cleanText(body?.device, 40),
      cleanText(body?.model, 40) ?? modelFromUserAgent(userAgent),
      await networkHash(request, env),
    ),
  ]);
  const answer = rsvp.results[0];
  // Las fotos del lugar van en su propio secreto (opcional), para cambiarlas sin tocar la dirección.
  const photos = env.BABYSHOWER_PHOTOS ? JSON.parse(env.BABYSHOWER_PHOTOS) : undefined;
  return json({
    name: guest.name,
    venue: { ...JSON.parse(env.BABYSHOWER_VENUE), photos },
    rsvp: answer ? { attending: answer.attending === 1, message: answer.message } : null,
    gifts: await giftList(env, guest.id),
  });
}

// Aparta (o cambia, o suelta con qty 0) un regalo. Responde con la lista al día; 409 si ya no
// quedan suficientes unidades porque alguien se adelantó.
async function pickGift(request: Request, env: Env): Promise<Response> {
  const body = await readBody(request);
  const guest = await findGuest(env, body?.token);
  if (!guest) return json({ error: "not_found" }, 404);
  const gift = typeof body?.giftId === "string" ? GIFTS.get(body.giftId) : undefined;
  const qty = body?.qty;
  if (!gift || typeof qty !== "number" || !Number.isInteger(qty) || qty < 0 || qty > gift.max)
    return json({ error: "invalid" }, 400);

  let saved = true;
  if (qty === 0) {
    await env.DB.prepare("DELETE FROM gift_picks WHERE guest_id = ? AND gift_id = ?").bind(guest.id, gift.id).run();
  } else {
    // Una sola consulta: solo se guarda si, con lo que apartaron los demás, no pasa del máximo
    // (sin contar lo ya cubierto por fuera).
    // Así, si dos personas piden la última unidad a la vez, solo una se la lleva.
    const { meta } = await env.DB.prepare(
      `INSERT INTO gift_picks (guest_id, gift_id, qty, updated_at)
       SELECT ?1, ?2, ?3, datetime('now')
       WHERE ?3 + (SELECT COALESCE(SUM(qty), 0) FROM gift_picks WHERE gift_id = ?2 AND guest_id <> ?1) <= ?4
       ON CONFLICT (guest_id, gift_id) DO UPDATE SET qty = excluded.qty, updated_at = excluded.updated_at`,
    )
      .bind(guest.id, gift.id, qty, gift.max - (gift.covered ?? 0))
      .run();
    saved = meta.changes > 0;
  }
  return json({ gifts: await giftList(env, guest.id) }, saved ? 200 : 409);
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
    notifyRsvp(env, new URL(request.url).origin, guestLabel(guest), body.attending, message.trim().slice(0, 1000)),
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
    `SELECT g.id, g.token, g.name, g.alias, g.side, g.phone, g.created_at AS createdAt, g.sent_at AS sentAt,
            COUNT(v.id) AS visits, MAX(v.visited_at) AS lastVisit,
            COUNT(DISTINCT COALESCE(v.device_id, v.user_agent)) AS devices,
            COUNT(DISTINCT v.network) AS networks, COUNT(DISTINCT v.city) AS cities,
            r.attending, r.message, r.updated_at AS answeredAt,
            (SELECT json_group_array(json_object('id', gift_id, 'qty', qty))
             FROM gift_picks WHERE guest_id = g.id) AS gifts
     FROM guests g
     LEFT JOIN visits v ON v.guest_id = g.id
     LEFT JOIN rsvps r ON r.guest_id = g.id
     GROUP BY g.id
     ORDER BY g.id DESC`,
  ).all<{ attending: number | null; devices: number; networks: number; cities: number; gifts: string }>();
  return json(
    results.map(({ networks, cities, gifts, ...row }) => ({
      ...row,
      // Si un regalo ya no está en la lista (se editó), se muestra con su id.
      gifts: (JSON.parse(gifts) as { id: string; qty: number }[]).map(({ id, qty }) => ({
        id,
        qty,
        name: GIFTS.get(id)?.name ?? `${id} (fuera de la lista)`,
        max: GIFTS.get(id)?.max ?? null,
      })),
      attending: row.attending === null ? null : row.attending === 1,
      // Pista, no prueba: más de un dispositivo y además otra red u otra ciudad. La misma persona
      // en WhatsApp y en Chrome, en la misma red, no cuenta.
      possibleShare: row.devices > 1 && (networks > 1 || cities > 1),
    })),
  );
}

// Nombre (el del saludo, puede ir vacío), alias y teléfono como se guardan. Sin nombre ni alias,
// el invitado no es válido.
const cleanGuest = (item: Body | null | undefined) => ({
  name: typeof item?.name === "string" ? item.name.trim().slice(0, 80) : "",
  alias: typeof item?.alias === "string" ? item.alias.trim().slice(0, 80) || null : null,
  side: item?.side === "papa" || item?.side === "mama" || item?.side === "ambos" ? item.side : null,
  phone: typeof item?.phone === "string" ? item.phone.replace(/[^\d+]/g, "").slice(0, 20) || null : null,
});

async function addGuests(request: Request, env: Env): Promise<Response> {
  const list = (await readBody(request))?.guests;
  if (!Array.isArray(list) || list.length === 0 || list.length > 300) return json({ error: "invalid" }, 400);
  const guests = list.map(cleanGuest);
  if (guests.some((guest) => !guest.name && !guest.alias)) return json({ error: "invalid" }, 400);

  await env.DB.batch(
    guests.map((guest) =>
      env.DB.prepare("INSERT INTO guests (token, name, alias, side, phone) VALUES (?, ?, ?, ?, ?)").bind(
        newToken(),
        guest.name,
        guest.alias,
        guest.side,
        guest.phone,
      ),
    ),
  );
  return json({ added: guests.length }, 201);
}

async function updateGuest(request: Request, env: Env, id: string): Promise<Response> {
  const guest = cleanGuest(await readBody(request));
  if (!guest.name && !guest.alias) return json({ error: "invalid" }, 400);
  const { meta } = await env.DB.prepare("UPDATE guests SET name = ?, alias = ?, side = ?, phone = ? WHERE id = ?")
    .bind(guest.name, guest.alias, guest.side, guest.phone, id)
    .run();
  if (!meta.changes) return json({ error: "not_found" }, 404);
  return new Response(null, { status: 204, headers: NO_STORE });
}

async function markSent(env: Env, id: string): Promise<Response> {
  const { meta } = await env.DB.prepare("UPDATE guests SET sent_at = COALESCE(sent_at, datetime('now')) WHERE id = ?")
    .bind(id)
    .run();
  if (!meta.changes) return json({ error: "not_found" }, 404);
  return new Response(null, { status: 204, headers: NO_STORE });
}

// Respuesta que el invitado dio por WhatsApp o en persona. Si ya había dejado un mensaje, se queda.
// Él puede cambiarla después desde su invitación.
async function setRsvp(request: Request, env: Env, id: string): Promise<Response> {
  const attending = (await readBody(request))?.attending;
  if (typeof attending !== "boolean") return json({ error: "invalid" }, 400);
  const { meta } = await env.DB.prepare(
    `INSERT INTO rsvps (guest_id, attending, updated_at) SELECT id, ?, datetime('now') FROM guests WHERE id = ?
     ON CONFLICT (guest_id) DO UPDATE SET attending = excluded.attending, updated_at = excluded.updated_at`,
  )
    .bind(attending ? 1 : 0, id)
    .run();
  if (!meta.changes) return json({ error: "not_found" }, 404);
  return new Response(null, { status: 204, headers: NO_STORE });
}

async function listVisits(env: Env, id: string): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT visited_at AS visitedAt, user_agent AS userAgent, city, country,
            device_id AS deviceId, model, network
     FROM visits WHERE guest_id = ? ORDER BY id DESC LIMIT 100`,
  )
    .bind(id)
    .all();
  return json(results);
}

async function deleteGuest(env: Env, id: string): Promise<Response> {
  // Las visitas y la respuesta se borran en cascada; por si D1 no aplica las claves foráneas, también a mano.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM visits WHERE guest_id = ?").bind(id),
    env.DB.prepare("DELETE FROM rsvps WHERE guest_id = ?").bind(id),
    env.DB.prepare("DELETE FROM gift_picks WHERE guest_id = ?").bind(id),
    env.DB.prepare("DELETE FROM guests WHERE id = ?").bind(id),
  ]);
  return new Response(null, { status: 204, headers: NO_STORE });
}

async function handleAdmin(request: Request, env: Env, url: URL): Promise<Response> {
  if (!(await isAdmin(request, env, url))) return json({ error: "forbidden" }, 403);
  if (url.pathname === "/api/admin/guests" && request.method === "GET") return listGuests(env);
  if (url.pathname === "/api/admin/guests" && request.method === "POST") return addGuests(request, env);
  const match = /^\/api\/admin\/guests\/(\d+)(\/visits|\/sent|\/rsvp)?$/.exec(url.pathname);
  if (match?.[2] === "/visits" && request.method === "GET") return listVisits(env, match[1]);
  if (match?.[2] === "/sent" && request.method === "POST") return markSent(env, match[1]);
  if (match?.[2] === "/rsvp" && request.method === "PUT") return setRsvp(request, env, match[1]);
  if (match && !match[2] && request.method === "PATCH") return updateGuest(request, env, match[1]);
  if (match && !match[2] && request.method === "DELETE") return deleteGuest(env, match[1]);
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
  if (url.pathname === "/api/gifts" && request.method === "PUT") return pickGift(request, env);
  return json({ error: "not_found" }, 404);
}

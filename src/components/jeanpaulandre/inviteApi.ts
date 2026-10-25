import type { Gift as BaseGift } from "@/content/jeanpaulandre-gifts";

// Datos de cada invitado: los pide la invitación con el token de su link (?i=...) a la API
// del Worker (worker/babyshower.ts). Con `npm run dev` no hay Worker: usa `npm run preview`.

// `address` y `note` son opcionales. `lat`/`lng` ubican el mapa y los links a las apps.
// `uberName` es el nombre que se le manda a Uber (aunque Uber titula el destino según las
// coordenadas) y `uberNote`, un aviso bajo las apps para que nadie se confunda con ese título.
// `photos` son fotos del lugar para que la gente sepa a dónde llega: los archivos están en
// public/jeanpaulandre/images/lugar/ (fuera del repo), y sus rutas solo las ve quien tiene link.
export type Venue = {
  name: string;
  address?: string;
  note?: string;
  uberName?: string;
  uberNote?: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  photos?: { src: string; alt: string; caption?: string }[];
};
export type Rsvp = { attending: boolean; message: string };
export type Invite = { name: string; venue: Venue; rsvp: Rsvp | null; gifts: GiftCategory[] };

// Regalo de la lista (src/content/jeanpaulandre-gifts.ts) con lo ya apartado por todos
// (`taken`) y por quien abre la invitación (`mine`).
export type Gift = BaseGift & { taken: number; mine: number };
export type GiftCategory = { category: string; gifts: Gift[] };

const jsonBody = (data: unknown) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// Identificador al azar de este navegador, para saber si un link se abrió en otros
// dispositivos (posible reenvío). No dice nada de la persona. Sin localStorage, null.
function deviceId(): string | null {
  try {
    let id = localStorage.getItem("jpa-device");
    if (!id) {
      id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      localStorage.setItem("jpa-device", id);
    }
    return id;
  } catch {
    return null;
  }
}

type UserAgentData = { getHighEntropyValues(hints: string[]): Promise<{ model?: string }> };

// Modelo del teléfono en Chrome para Android (que lo oculta del User-Agent). Safari no lo da.
async function deviceModel(): Promise<string | null> {
  const data = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
  try {
    return (await data?.getHighEntropyValues(["model"]))?.model || null;
  } catch {
    return null;
  }
}

// Abre la invitación (y queda registrada la visita). null si el token no existe.
export async function getInvite(token: string): Promise<Invite | null> {
  const body = { token, device: deviceId(), model: await deviceModel() };
  const response = await fetch("/api/invite", { method: "POST", ...jsonBody(body) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No se pudo abrir la invitación (${response.status})`);
  return response.json();
}

export async function sendRsvp(token: string, rsvp: Rsvp): Promise<void> {
  const response = await fetch("/api/rsvp", { method: "PUT", ...jsonBody({ token, ...rsvp }) });
  if (!response.ok) throw new Error(`No se pudo guardar la respuesta (${response.status})`);
}

// Aparta qty unidades de un regalo (0: lo suelta). Devuelve la lista al día; `saved` es false si
// alguien se adelantó y ya no quedaban.
export async function pickGift(token: string, giftId: string, qty: number) {
  const response = await fetch("/api/gifts", { method: "PUT", ...jsonBody({ token, giftId, qty }) });
  if (!response.ok && response.status !== 409) throw new Error(`No se pudo apartar el regalo (${response.status})`);
  const { gifts }: { gifts: GiftCategory[] } = await response.json();
  return { gifts, saved: response.ok };
}

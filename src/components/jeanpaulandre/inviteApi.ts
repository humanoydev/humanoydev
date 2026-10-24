// Datos de cada invitado: los pide la invitación con el token de su link (?i=...) a la API
// del Worker (worker/babyshower.ts). Con `npm run dev` no hay Worker: usa `npm run preview`.

// `address` y `note` son opcionales. `lat`/`lng` ubican el mapa y los links a las apps.
// `uberName` es el nombre con el que Uber busca el destino, si difiere de `name`.
export type Venue = {
  name: string;
  address?: string;
  note?: string;
  uberName?: string;
  lat: number;
  lng: number;
  mapsUrl: string;
};
export type Rsvp = { attending: boolean; message: string };
export type Invite = { name: string; venue: Venue; rsvp: Rsvp | null };

const jsonBody = (data: unknown) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// Abre la invitación (y queda registrada la visita). null si el token no existe.
export async function getInvite(token: string): Promise<Invite | null> {
  const response = await fetch("/api/invite", { method: "POST", ...jsonBody({ token }) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No se pudo abrir la invitación (${response.status})`);
  return response.json();
}

export async function sendRsvp(token: string, rsvp: Rsvp): Promise<void> {
  const response = await fetch("/api/rsvp", { method: "PUT", ...jsonBody({ token, ...rsvp }) });
  if (!response.ok) throw new Error(`No se pudo guardar la respuesta (${response.status})`);
}

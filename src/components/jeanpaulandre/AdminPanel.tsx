"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BABY_NAME, babyShower } from "@/content/jeanpaulandre";

// Panel de invitados del baby shower. Habla con la API de admin del Worker
// (worker/babyshower.ts), protegida con Cloudflare Access.

type Guest = {
  id: number;
  token: string;
  name: string;
  phone: string | null;
  createdAt: string;
  visits: number;
  // Navegadores distintos que abrieron el link: más de uno sugiere que se reenvió.
  devices: number;
  lastVisit: string | null;
  attending: boolean | null;
  message: string | null;
  answeredAt: string | null;
};

type Visit = { visitedAt: string; userAgent: string | null; city: string | null; country: string | null };

type Filter = "todos" | "sin-abrir" | "sin-responder" | "asisten" | "no-asisten";

const FILTERS: { id: Filter; label: string; match: (guest: Guest) => boolean }[] = [
  { id: "todos", label: "Todos", match: () => true },
  { id: "sin-abrir", label: "Sin abrir", match: (g) => g.visits === 0 },
  { id: "sin-responder", label: "Abrieron, sin responder", match: (g) => g.visits > 0 && g.attending === null },
  { id: "asisten", label: "Asisten", match: (g) => g.attending === true },
  { id: "no-asisten", label: "No asisten", match: (g) => g.attending === false },
];

// D1 guarda las fechas en UTC sin zona ("2026-11-01 18:30:00"); se muestran en hora de Lima.
function formatDate(value: string) {
  return new Date(`${value.replace(" ", "T")}Z`).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

// "iPhone · Safari", "Android · navegador de una app"... a partir del User-Agent guardado.
function describeBrowser(ua: string | null) {
  if (!ua) return "Navegador desconocido";
  const device = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? /Mobile/.test(ua)
          ? "Android"
          : "Tablet Android"
        : /Macintosh/.test(ua)
          ? "Mac"
          : /Windows/.test(ua)
            ? "Windows"
            : /Linux/.test(ua)
              ? "Linux"
              : "Otro dispositivo";
  const browser = /Instagram/.test(ua)
    ? "Instagram"
    : /FBAN|FBAV/.test(ua)
      ? "Facebook"
      : /; wv\)/.test(ua)
        ? "navegador de una app"
        : /EdgA?\/|EdgiOS/.test(ua)
          ? "Edge"
          : /SamsungBrowser/.test(ua)
            ? "Samsung Internet"
            : /CriOS|Chrome\//.test(ua)
              ? "Chrome"
              : /FxiOS|Firefox\//.test(ua)
                ? "Firefox"
                : /Safari\//.test(ua)
                  ? "Safari"
                  : "otro navegador";
  return `${device} · ${browser}`;
}

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

// "Lima, Perú"; en local (sin datos de Cloudflare) no hay ubicación.
function describePlace(visit: Visit) {
  const country = visit.country ? regionNames.of(visit.country) : null;
  return [visit.city, country].filter(Boolean).join(", ") || "Ubicación desconocida";
}

const inviteLink = (token: string) => `${window.location.origin}/babyshower?i=${token}`;

// Teléfonos peruanos de 9 dígitos (9xx xxx xxx) van con el código de país 51.
function waPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 9 && digits.startsWith("9") ? `51${digits}` : digits;
}

const fecha = babyShower.dateLabel.toLowerCase();

// Mensajes de WhatsApp: la invitación y el recordatorio para quien aún no confirma.
const MESSAGES = {
  invite: (guest: Guest) =>
    `¡Hola, ${guest.name}! 🥳 Te invitamos al baby shower de ${BABY_NAME}, el ${fecha}. ` +
    `Aquí está tu invitación: ${inviteLink(guest.token)}`,
  reminder: (guest: Guest) =>
    `¡Hola, ${guest.name}! 💛 Te recordamos el baby shower de ${BABY_NAME}, el ${fecha}. ` +
    `¿Nos acompañas? Confírmanos antes del ${babyShower.rsvpByLabel} aquí: ${inviteLink(guest.token)}`,
};

function whatsappLink(guest: Guest, message: keyof typeof MESSAGES = "invite") {
  const text = MESSAGES[message](guest);
  // api.whatsapp.com y no wa.me: la redirección de wa.me rompe algunos emojis (salen como �).
  const params = new URLSearchParams({ text });
  if (guest.phone) params.set("phone", waPhone(guest.phone));
  return `https://api.whatsapp.com/send?${params}`;
}

// "Nombre, teléfono" (o separado por tab, al pegar desde una hoja de cálculo); una persona por línea.
function parseList(text: string) {
  return text
    .split("\n")
    .map((line) => line.split(/[,\t;]/).map((part) => part.trim()))
    .filter(([name]) => name)
    .map(([name, phone]) => ({ name, phone: phone || undefined }));
}

function status(guest: Guest) {
  if (guest.attending === true) return { label: "Asiste", tone: "yes" };
  if (guest.attending === false) return { label: "No asiste", tone: "no" };
  if (guest.visits > 0)
    return { label: `Abrió ${guest.visits === 1 ? "1 vez" : `${guest.visits} veces`}`, tone: "seen" };
  return { label: "Sin abrir", tone: "new" };
}

function toCsv(guests: Guest[]) {
  const cell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = guests.map((g) =>
    [g.name, g.phone, status(g).label, g.visits, g.lastVisit && formatDate(g.lastVisit), g.message, inviteLink(g.token)]
      .map(cell)
      .join(","),
  );
  return ["Nombre,Teléfono,Estado,Visitas,Última visita,Mensaje,Link", ...rows].join("\n");
}

async function api(path: string, init?: RequestInit) {
  const response = await fetch(`/api/admin${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 403) throw new Error("No tienes acceso. Vuelve a iniciar sesión.");
  if (!response.ok) throw new Error(`Algo falló (${response.status}). Inténtalo de nuevo.`);
  return response.status === 204 ? null : response.json();
}

export function AdminPanel() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<Filter>("todos");
  const [copied, setCopied] = useState<number | null>(null);
  // Invitado con la lista de visitas abierta, y las visitas cargadas de cada uno.
  const [openVisits, setOpenVisits] = useState<number | null>(null);
  const [visits, setVisits] = useState<Record<number, Visit[]>>({});

  const load = useCallback(async () => {
    try {
      setGuests(await api("/guests"));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // Carga inicial; después de cada cambio, load() vuelve a pedir la lista.
  useEffect(() => {
    let active = true;
    api("/guests").then(
      (list) => active && setGuests(list),
      (e: Error) => active && setError(e.message),
    );
    return () => {
      active = false;
    };
  }, []);

  const parsed = useMemo(() => parseList(list), [list]);
  const shown = (guests ?? []).filter(FILTERS.find((f) => f.id === filter)!.match);
  const count = (id: Filter) => (guests ?? []).filter(FILTERS.find((f) => f.id === id)!.match).length;

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (parsed.length === 0) return;
    setSaving(true);
    try {
      await api("/guests", { method: "POST", body: JSON.stringify({ guests: parsed }) });
      setList("");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(guest: Guest) {
    if (!window.confirm(`¿Eliminar a ${guest.name}? Su link dejará de funcionar y se borra su respuesta.`)) return;
    try {
      await api(`/guests/${guest.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function toggleVisits(guest: Guest) {
    if (openVisits === guest.id) return setOpenVisits(null);
    setOpenVisits(guest.id);
    try {
      const list: Visit[] = await api(`/guests/${guest.id}/visits`);
      setVisits((current) => ({ ...current, [guest.id]: list }));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function copy(guest: Guest) {
    await navigator.clipboard.writeText(inviteLink(guest.token));
    setCopied(guest.id);
    window.setTimeout(() => setCopied((current) => (current === guest.id ? null : current)), 1500);
  }

  function exportCsv() {
    const blob = new Blob([`﻿${toCsv(guests ?? [])}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invitados-baby-shower.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="container jpa-admin">
      <h1 className="jpa-admin__title">Invitados del baby shower</h1>

      {error && (
        <p className="jpa__error" role="alert">
          {error}
        </p>
      )}

      <dl className="jpa-admin__stats">
        <div>
          <dt>Invitados</dt>
          <dd>{guests?.length ?? "–"}</dd>
        </div>
        <div>
          <dt>Abrieron</dt>
          <dd>{guests ? guests.filter((g) => g.visits > 0).length : "–"}</dd>
        </div>
        <div>
          <dt>Asisten</dt>
          <dd>{guests ? count("asisten") : "–"}</dd>
        </div>
        <div>
          <dt>No asisten</dt>
          <dd>{guests ? count("no-asisten") : "–"}</dd>
        </div>
        <div>
          <dt>Sin respuesta</dt>
          <dd>{guests ? guests.filter((g) => g.attending === null).length : "–"}</dd>
        </div>
      </dl>

      <form className="jpa__card jpa__card--mint jpa-admin__add" onSubmit={add}>
        <label className="jpa__field">
          <span className="jpa__field-label">Agregar invitados</span>
          <span className="jpa__field-hint">
            Una persona por línea: <strong>Nombre, teléfono</strong>. El teléfono es opcional; sin él, WhatsApp te deja
            elegir el chat. También puedes pegar dos columnas desde Excel o Google Sheets.
          </span>
          <textarea
            value={list}
            onChange={(e) => setList(e.target.value)}
            rows={5}
            placeholder={"Tía Carmen, 987654321\nAbuelo Jorge, 912345678\nPrima Lucía"}
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={saving || parsed.length === 0}>
          {saving
            ? "Agregando…"
            : parsed.length > 0
              ? `Agregar ${parsed.length === 1 ? "1 invitado" : `${parsed.length} invitados`}`
              : "Agregar invitados"}
        </button>
      </form>

      <div className="jpa-admin__toolbar">
        <div className="jpa-admin__filters" role="group" aria-label="Filtrar invitados">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="jpa__chip"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span className="jpa-admin__count">{guests ? count(f.id) : ""}</span>
            </button>
          ))}
        </div>
        <button type="button" className="jpa__chip" onClick={exportCsv} disabled={!guests?.length}>
          Exportar CSV
        </button>
      </div>

      {guests && shown.length === 0 && (
        <p className="jpa__card-text">
          {guests.length === 0 ? "Todavía no hay invitados. Agrega la lista arriba." : "Nadie en este filtro."}
        </p>
      )}

      <ul className="jpa-admin__list">
        {shown.map((guest) => {
          const s = status(guest);
          return (
            <li key={guest.id} className="jpa-admin__guest">
              <div className="jpa-admin__who">
                <p className="jpa-admin__name">{guest.name}</p>
                <p className="jpa-admin__meta">
                  {guest.phone ?? "Sin teléfono"}
                  {guest.lastVisit && ` · Última visita: ${formatDate(guest.lastVisit)}`}
                  {guest.devices > 1 && ` · Abierto en ${guest.devices} dispositivos`}
                </p>
                {guest.visits > 0 && (
                  <button
                    type="button"
                    className="jpa-admin__visits-toggle"
                    onClick={() => toggleVisits(guest)}
                    aria-expanded={openVisits === guest.id}
                  >
                    {openVisits === guest.id ? "Ocultar visitas" : `Ver visitas (${guest.visits})`}
                  </button>
                )}
                {guest.message && <p className="jpa-admin__message">“{guest.message}”</p>}
              </div>
              <span className={`jpa-admin__status jpa-admin__status--${s.tone}`}>{s.label}</span>
              <div className="jpa-admin__actions">
                <a className="jpa__chip" href={whatsappLink(guest)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                {guest.attending === null && (
                  <a
                    className="jpa__chip jpa-admin__remind"
                    href={whatsappLink(guest, "reminder")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Recordar
                  </a>
                )}
                <button type="button" className="jpa__chip" onClick={() => copy(guest)}>
                  {copied === guest.id ? "¡Copiado!" : "Copiar link"}
                </button>
                <button type="button" className="jpa__chip jpa-admin__delete" onClick={() => remove(guest)}>
                  Eliminar
                </button>
              </div>
              {openVisits === guest.id && (
                <ol className="jpa-admin__visits">
                  {!visits[guest.id] && <li>Cargando…</li>}
                  {visits[guest.id]?.map((visit, index) => (
                    <li key={index}>
                      <span className="jpa-admin__visit-date">{formatDate(visit.visitedAt)}</span>
                      <span>{describeBrowser(visit.userAgent)}</span>
                      <span className="jpa-admin__visit-place">{describePlace(visit)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

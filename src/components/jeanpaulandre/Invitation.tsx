"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DaysUntil } from "@/components/DaysUntil";
import { BABY_NAME, babyShower } from "@/content/jeanpaulandre";
import { Balloons, Blocks, Cloud, Heart, HeroScene, HotAirBalloon, Kite } from "./Doodles";
import { Toy } from "./Toy";
import { VenueCard } from "./VenueCard";
import { getInvite, sendRsvp, type Invite, type Rsvp, type Venue } from "./inviteApi";

const subscribe = () => () => {};
const readToken = () => new URLSearchParams(window.location.search).get("i");

const eventTitle = `Baby shower de ${BABY_NAME}`;

// Fecha en el formato de los calendarios, en UTC: 20261115T210000Z
function calendarDate(iso: string) {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

// Lugar para el calendario: nombre y, si la hay, dirección.
const venueLocation = (venue: Venue) => [venue.name, venue.address].filter(Boolean).join(", ");

function googleCalendarUrl(venue: Venue) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle,
    dates: `${calendarDate(babyShower.start)}/${calendarDate(babyShower.end)}`,
    location: venueLocation(venue),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Archivo .ics para Apple Calendar y Outlook.
function downloadIcs(venue: Venue) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//humanoydev//jeanpaulandre//ES",
    "BEGIN:VEVENT",
    "UID:babyshower@jeanpaulandre.humanoydev.com",
    `DTSTAMP:${calendarDate(new Date().toISOString())}`,
    `DTSTART:${calendarDate(babyShower.start)}`,
    `DTEND:${calendarDate(babyShower.end)}`,
    `SUMMARY:${eventTitle}`,
    `LOCATION:${venueLocation(venue).replace(/[,;]/g, "\\$&")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "baby-shower-jean-paul-andre.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Invitación personal: el token del link (?i=...) trae el nombre, la dirección y su respuesta.
// Sin token válido se ve la versión general, sin dirección ni formulario.
export function Invitation() {
  // undefined: todavía no sabemos (HTML estático e hidratación).
  const token = useSyncExternalStore<string | null | undefined>(subscribe, readToken, () => undefined);
  const [loaded, setLoaded] = useState<{ token: string; invite: Invite | null } | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    // Si la API falla, se muestra la invitación general (sin dirección ni formulario).
    getInvite(token)
      .catch(() => null)
      .then((invite) => {
        if (active) setLoaded({ token, invite });
      });
    return () => {
      active = false;
    };
  }, [token]);

  const loading = token === undefined || (token !== null && loaded?.token !== token);
  const invite = token && loaded?.token === token ? loaded.invite : null;

  return (
    <>
      <section aria-labelledby="jpa-invite-title">
        <HeroScene>
          <p className="jpa__pill">Baby shower</p>
          <p className="jpa__hello">{loading ? " " : invite ? `¡Hola, ${invite.name}!` : "¡Hola!"}</p>
          <h1 id="jpa-invite-title" className="jpa__invite-title">
            Te invitamos a celebrar la llegada de
            <span className="jpa__name">
              Jean Paul <span className="jpa__name-accent">André</span>
            </span>
          </h1>
          <p className="serif jpa__tagline">ven a acompañarnos mientras lo esperamos.</p>
        </HeroScene>
      </section>

      <section className="jpa-scene">
        <Toy play="loop" className="jpa-deco jpa-deco--kite-left jpa-px jpa-px--near">
          <Kite />
        </Toy>
        <Toy play="fly" className="jpa-deco jpa-deco--balloon-right jpa-px jpa-px--mid">
          <HotAirBalloon color="butter" />
        </Toy>
        <div className="container jpa__details">
          <div className="jpa__card jpa__card--sky">
            <h2 className="jpa__label">Cuándo</h2>
            <p className="jpa__card-title">{babyShower.dateLabel}</p>
            <p className="jpa__card-text">{babyShower.timeLabel}</p>
            <p className="jpa__countdown-pill">
              <DaysUntil date={babyShower.date} />
            </p>
            {invite && (
              <div className="jpa__card-actions">
                <a
                  href={googleCalendarUrl(invite.venue)}
                  className="jpa__chip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Calendar
                </a>
                <button type="button" className="jpa__chip" onClick={() => downloadIcs(invite.venue)}>
                  Apple / Outlook
                </button>
              </div>
            )}
          </div>

          {invite ? (
            <VenueCard venue={invite.venue} />
          ) : (
            <div className="jpa__card jpa__card--peach">
              <h2 className="jpa__label">Dónde</h2>
              {!loading && (
                <p className="jpa__card-text">
                  La dirección está en tu invitación personal. Ábrela desde el link que te enviamos por WhatsApp.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="jpa-scene">
        <Toy play="float-away" className="jpa-deco jpa-deco--balloons-right jpa-px jpa-px--near">
          <Balloons />
        </Toy>
        <Toy play="tumble" className="jpa-deco jpa-deco--blocks-left jpa-px jpa-px--mid">
          <Blocks />
        </Toy>
        <div className="container jpa__rsvp">
          {invite && token ? (
            <RsvpForm key={token} token={token} name={invite.name} initial={invite.rsvp} />
          ) : (
            !loading && (
              <div className="jpa__card jpa__card--mint">
                <h2 className="jpa__card-title">¿Nos acompañas?</h2>
                <p className="jpa__card-text">Para confirmar, abre el link personal que te enviamos por WhatsApp.</p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

function RsvpForm({ token, name, initial }: { token: string; name: string; initial: Rsvp | null }) {
  const [attending, setAttending] = useState<boolean | null>(initial?.attending ?? null);
  const [message, setMessage] = useState(initial?.message ?? "");
  const [sent, setSent] = useState<Rsvp | null>(initial);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null) return;
    const rsvp = { attending, message: message.trim() };
    setSending(true);
    setError(false);
    try {
      await sendRsvp(token, rsvp);
      setSent(rsvp);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="jpa__card jpa__card--mint jpa__thanks" role="status">
        <Heart className="jpa__thanks-heart" />
        <h2 className="jpa__card-title">
          {sent.attending ? `¡Gracias, ${name}! Te esperamos.` : `Gracias por avisarnos, ${name}.`}
        </h2>
        <p className="jpa__card-text">
          {sent.attending ? "Ya guardamos tu confirmación." : "Te vamos a extrañar. Ya guardamos tu respuesta."}
          {sent.message && " Tu mensaje ya está en la cápsula del tiempo de Jean Paul André."}
        </p>
        <button type="button" className="btn btn--outline" onClick={() => setSent(null)}>
          Cambiar mi respuesta
        </button>
      </div>
    );
  }

  return (
    <form className="jpa__card jpa__card--mint" onSubmit={submit}>
      <h2 className="jpa__card-title">¿Nos acompañas?</h2>
      <p className="jpa__card-text">Por favor confírmanos antes del {babyShower.rsvpByLabel}.</p>
      <fieldset className="jpa__choices">
        <legend className="sr-only">Tu respuesta</legend>
        {/* Al elegir "Sí" el corazón late y suelta corazoncitos; al elegir "No", la nube llueve. */}
        <label className="jpa__choice jpa__choice--yes">
          <input
            type="radio"
            name="attending"
            checked={attending === true}
            onChange={() => setAttending(true)}
            required
          />
          <span className="jpa__choice-icon" aria-hidden="true">
            <Heart />
            <span className="jpa__burst">
              <Heart />
              <Heart />
              <Heart />
              <Heart />
              <Heart />
              <Heart />
            </span>
          </span>
          ¡Sí, ahí estaré!
        </label>
        <label className="jpa__choice jpa__choice--no">
          <input type="radio" name="attending" checked={attending === false} onChange={() => setAttending(false)} />
          <span className="jpa__choice-icon" aria-hidden="true">
            <Cloud />
            <span className="jpa__rain">
              <i />
              <i />
              <i />
            </span>
          </span>
          No podré ir
        </label>
      </fieldset>
      <label className="jpa__field">
        <span className="jpa__field-label">
          Un mensaje para Jean Paul André <span className="jpa__optional">(opcional)</span>
        </span>
        <span className="jpa__field-hint">
          Lo guardaremos en su cápsula del tiempo para que lo lea cuando sea grande.
        </span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={1000} />
      </label>
      {error && (
        <p className="jpa__error" role="alert">
          No pudimos guardar tu respuesta. Inténtalo de nuevo.
        </p>
      )}
      <button type="submit" className="btn btn--primary" disabled={sending}>
        {sending ? "Enviando…" : "Enviar respuesta"}
      </button>
    </form>
  );
}

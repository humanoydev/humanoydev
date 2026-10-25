"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Venue } from "./inviteApi";
import { VenueRoute } from "./VenueRoute";

// Tarjeta "Dónde" con el mapa de fondo y un selector de apps para llegar; debajo, si hay fotos,
// el recorrido por el lugar (VenueRoute).
// El mapa es de OpenFreeMap (datos de OpenStreetMap): gratis, sin clave, con atribución.
// MapLibre lo dibuja y se descarga solo cuando aparece esta tarjeta (invitación personal).
// El mapa es fondo: no se arrastra; un botón encima abre el selector de apps.

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const ZOOM = 16;

// Parámetros de Uber con los corchetes literales, como en su documentación.
// Uber lee los "+" como espacios ("SoHo+" sale "SoHo"): se cambian por el "＋" de ancho
// completo, que se ve igual.
function uberQuery(venue: Venue) {
  const label = (text: string) => encodeURIComponent(text.replace(/\+/g, "＋"));
  const place = [venue.name, venue.address].filter(Boolean).join(", ");
  return [
    "action=setPickup",
    "pickup=my_location",
    `dropoff[latitude]=${venue.lat}`,
    `dropoff[longitude]=${venue.lng}`,
    `dropoff[nickname]=${label(venue.uberName ?? venue.name)}`,
    `dropoff[formatted_address]=${label(place)}`,
  ].join("&");
}

type App = { label: string; href: string; onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void };

function directions(venue: Venue): App[] {
  const { lat, lng, name } = venue;
  const uberWeb = `https://m.uber.com/ul/?${uberQuery(venue)}`;
  return [
    { label: "Google Maps", href: venue.mapsUrl },
    { label: "Apple Maps", href: `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}` },
    { label: "Waze", href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
    {
      label: "Uber",
      href: uberWeb,
      // El link universal de Uber pierde el destino si el teléfono no lo intercepta (p. ej.
      // dentro de WhatsApp): pasa por un redirector que abre la app sin parámetros. En el
      // celular abrimos la app directo con uber://; si en 1,5 s no se abrió, vamos al link web.
      onClick: (event) => {
        if (!window.matchMedia("(pointer: coarse)").matches) return;
        event.preventDefault();
        window.location.href = `uber://?${uberQuery(venue)}`;
        window.setTimeout(() => {
          if (document.visibilityState === "visible") window.location.href = uberWeb;
        }, 1500);
      },
    },
  ];
}

export function VenueCard({ venue }: { venue: Venue }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Carga MapLibre y centra el mapa para que el lugar quede bajo el pin (--pin-x, --pin-y).
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;
    let map: import("maplibre-gl").Map | undefined;
    let resizer: ResizeObserver | undefined;
    let cancelled = false;

    import("maplibre-gl").then(({ Map, getVersion, setWorkerUrl }) => {
      if (cancelled) return;
      // MapLibre busca su worker junto a su propio archivo, pero con Turbopack esa ruta no es
      // http(s) y lo descarta: el mapa queda sin calles. Lo cargamos del CDN, misma versión.
      setWorkerUrl(`https://cdn.jsdelivr.net/npm/maplibre-gl@${getVersion()}/dist/maplibre-gl-worker.mjs`);
      map = new Map({
        container,
        style: MAP_STYLE,
        center: [venue.lng, venue.lat],
        zoom: ZOOM,
        interactive: false,
        attributionControl: false,
      });
      const placePin = () => {
        if (!map) return;
        map.resize();
        const styles = getComputedStyle(container);
        const pinX = parseFloat(styles.getPropertyValue("--pin-x")) / 100;
        const pinY = parseFloat(styles.getPropertyValue("--pin-y")) / 100;
        map.jumpTo({ center: [venue.lng, venue.lat], zoom: ZOOM });
        // panBy mueve la vista: el centro se desplaza y el lugar queda en el pin.
        map.panBy([(0.5 - pinX) * container.clientWidth, (0.5 - pinY) * container.clientHeight], { duration: 0 });
      };
      map.on("load", placePin);
      resizer = new ResizeObserver(placePin);
      resizer.observe(container);
    });

    return () => {
      cancelled = true;
      resizer?.disconnect();
      map?.remove();
    };
  }, [venue.lat, venue.lng]);

  // Al abrir, el foco va a la primera app; Escape cierra.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="jpa__card jpa__card--peach jpa__venue">
      <div className="jpa__venue-top">
        <div ref={mapRef} className="jpa__map-canvas" aria-hidden="true" />
        <button
          type="button"
          className="jpa__map"
          onClick={() => setOpen(true)}
          aria-label="Ver el mapa y elegir cómo llegar"
          aria-expanded={open}
        >
          <svg viewBox="0 0 40 52" className="jpa__map-pin" aria-hidden="true">
            <path
              d="M20 50s16-17 16-29A16 16 0 0 0 4 21c0 12 16 29 16 29z"
              fill="#b4532f"
              stroke="#fff"
              strokeWidth="2.5"
            />
            <path d="M20 29s-6.5-4-8-7.6A4.4 4.4 0 0 1 20 17.4a4.4 4.4 0 0 1 8 4c-1.5 3.6-8 7.6-8 7.6z" fill="#fff" />
          </svg>
        </button>

        <div className="jpa__venue-text">
          <h2 className="jpa__label">Dónde</h2>
          <p className="jpa__card-title">{venue.name}</p>
          {venue.address && <p className="jpa__card-text">{venue.address}</p>}
          {venue.note && <p className="jpa__venue-note">{venue.note}</p>}
          <div className="jpa__card-actions">
            <button type="button" className="jpa__chip" onClick={() => setOpen(true)} aria-expanded={open}>
              Cómo llegar
            </button>
          </div>
        </div>

        <p className="jpa__map-credit">
          <a href="https://openfreemap.org">OpenFreeMap</a> · <a href="https://www.openmaptiles.org/">© OpenMapTiles</a>{" "}
          · Datos de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        </p>

        {open && (
          <div ref={panel} className="jpa__directions" role="dialog" aria-label="Elige cómo llegar">
            <p className="jpa__directions-title">¿Con qué app quieres llegar?</p>
            <div className="jpa__directions-list">
              {directions(venue).map((app) => (
                <a
                  key={app.label}
                  href={app.href}
                  onClick={app.onClick}
                  className="jpa__chip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.label}
                </a>
              ))}
            </div>
            {venue.uberNote && <p className="jpa__directions-note">{venue.uberNote}</p>}
            <button type="button" className="jpa__directions-close" onClick={() => setOpen(false)} aria-label="Cerrar">
              ×
            </button>
          </div>
        )}
      </div>
      {venue.photos?.length ? <VenueRoute photos={venue.photos} /> : null}
    </div>
  );
}

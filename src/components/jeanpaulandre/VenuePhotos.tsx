"use client";

import { useRef, useState } from "react";
import type { Venue } from "./inviteApi";

type Photo = NonNullable<Venue["photos"]>[number];

// Fotos del lugar bajo la tarjeta "Dónde", para que la gente reconozca a dónde llega.
// Se deslizan de lado; al tocar una se ve en grande (cierra con un toque o Escape).
export function VenuePhotos({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<Photo | null>(null);

  function show(photo: Photo) {
    setCurrent(photo);
    dialog.current?.showModal();
  }

  return (
    <div className="jpa__card jpa__card--peach jpa__photos">
      <h2 className="jpa__label">Antes de llegar</h2>
      <p className="jpa__card-text">
        Te mostramos el camino hasta el SUM, un salón interior donde vamos a celebrar. Así sabrás a dónde llegas y
        qué ponerte.
      </p>
      <ul className="jpa__photos-strip">
        {photos.map((photo) => (
          <li key={photo.src}>
            <button type="button" className="jpa__photo" onClick={() => show(photo)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              {photo.caption && <span className="jpa__photo-caption">{photo.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="jpa__lightbox" onClick={() => dialog.current?.close()}>
        {current && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} />
            {current.caption && <figcaption>{current.caption}</figcaption>}
          </figure>
        )}
        <button type="button" className="jpa__directions-close" aria-label="Cerrar">
          ×
        </button>
      </dialog>
    </div>
  );
}

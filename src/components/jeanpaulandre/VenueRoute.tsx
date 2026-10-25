"use client";

import { useRef, useState } from "react";
import type { Venue } from "./inviteApi";

type Photo = NonNullable<Venue["photos"]>[number];

// El recorrido en fotos, debajo del mapa de la tarjeta "Dónde": pasos numerados unidos por una
// línea punteada, para que cada quien vea cómo es el lugar antes de ir. Sin texto que lo
// explique: las fotos hablan solas. Al tocar una se ve en grande (cierra con un toque o Escape).
export function VenueRoute({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<Photo | null>(null);

  function show(photo: Photo) {
    setCurrent(photo);
    dialog.current?.showModal();
  }

  return (
    <div className="jpa__route">
      <ol className="jpa__route-list" aria-label="El lugar, paso a paso">
        {photos.map((photo, index) => (
          <li key={photo.src} className="jpa__route-step">
            <p className="jpa__route-caption">
              <span className="jpa__route-number" aria-hidden="true">
                {index + 1}
              </span>
              {photo.caption}
            </p>
            <button type="button" className="jpa__route-photo" onClick={() => show(photo)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          </li>
        ))}
      </ol>
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

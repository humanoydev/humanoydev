"use client";

import { useEffect, useState } from "react";
import { getGifts, pickGift, type Gift, type GiftCategory } from "./inviteApi";

// Lista de regalos (src/content/jeanpaulandre-gifts.ts). Con link personal se aparta un regalo
// con "Lo llevo yo"; lo apartado sube a "Lo que vas a traer", donde se cambia la cantidad o se
// suelta. Los demás solo ven cuánto queda: quién lleva qué lo ven papá y mamá en el admin.

const TAGS = { indispensable: "⭐ Indispensable", favorito: "💛 Favorito" };

// Aviso junto a donde se tocó: en un regalo de la lista (su id) o en "Lo que vas a traer".
type Note = { at: string; text: string; error?: boolean };

export function GiftList({ token, initial }: { token: string | null; initial: GiftCategory[] | null }) {
  const [list, setList] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  // Sin link personal, la lista se pide aparte, solo para mirarla.
  useEffect(() => {
    if (initial) return;
    let active = true;
    getGifts().then(
      (gifts) => active && setList(gifts),
      () => {},
    );
    return () => {
      active = false;
    };
  }, [initial]);

  async function pick(gift: Gift, qty: number, at: string) {
    if (!token) return;
    setBusy(true);
    setNote(null);
    try {
      const { gifts, saved } = await pickGift(token, gift.id, qty);
      setList(gifts);
      setNote(
        !saved
          ? { at, text: "Uy, alguien se te adelantó. Ya actualizamos la lista.", error: true }
          : qty === 0
            ? { at, text: `Listo, soltamos “${gift.name}”: queda libre para alguien más.` }
            : gift.mine === 0
              ? { at, text: "¡Anotado! Jean Paul André ya te debe una 💛" }
              : { at, text: "Listo, cambiamos la cantidad." },
      );
    } catch {
      setNote({ at, text: "No pudimos guardarlo. Inténtalo de nuevo.", error: true });
    } finally {
      setBusy(false);
    }
  }

  const noteFor = (at: string) =>
    note?.at === at && (
      <p className={note.error ? "jpa__error" : "jpa__status"} role={note.error ? "alert" : "status"}>
        {note.text}
      </p>
    );

  const mine = (list ?? []).flatMap(({ gifts }) => gifts).filter((gift) => gift.mine > 0);

  return (
    <div className="jpa__card jpa__card--butter jpa__gifts">
      <h2 className="jpa__label">Regalitos</h2>
      <p className="jpa__card-title">Por si te preguntas qué traer</p>
      <p className="jpa__card-text">
        Lo que más queremos es verte ahí, de verdad. Pero si te provoca engreír a Jean Paul André, aquí van algunas
        ideas.
      </p>
      <p className="jpa__card-text">
        Confesión: esta lista no la hicimos a mano, nos ayudó una inteligencia artificial (hola, IA 👋). Tómala como
        inspiración, no como encargo. Las de ⭐ son las que más nos van a salvar en las madrugadas.
      </p>
      <p className="jpa__card-text">
        {token
          ? "Si eliges algo, lo apartamos a tu nombre para que no lleguen tres bañeras 🛁."
          : "Para apartar un regalo, abre el link personal que te enviamos por WhatsApp."}
      </p>

      {mine.length > 0 && (
        <div className="jpa__gifts-mine">
          <h3 className="jpa__gifts-mine-title">Lo que vas a traer 🎁</h3>
          <ul>
            {mine.map((gift) => (
              <li key={gift.id}>
                <span className="jpa__gift-name">{gift.name}</span>
                {gift.max > 1 && (
                  <span className="jpa__stepper">
                    <button
                      type="button"
                      onClick={() => pick(gift, gift.mine - 1, "mine")}
                      disabled={busy || gift.mine <= 1}
                      aria-label={`Uno menos de ${gift.name}`}
                    >
                      −
                    </button>
                    <span>{gift.mine}</span>
                    <button
                      type="button"
                      onClick={() => pick(gift, gift.mine + 1, "mine")}
                      // Entre todos (contando lo suyo) ya se apartó el máximo.
                      disabled={busy || gift.taken >= gift.max}
                      aria-label={`Uno más de ${gift.name}`}
                    >
                      +
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  className="jpa__gift-release"
                  onClick={() => pick(gift, 0, "mine")}
                  disabled={busy}
                >
                  Mejor no
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {noteFor("mine")}

      {list?.map(({ category, gifts }) => (
        <details key={category} className="jpa__gift-group">
          <summary>
            {category}
            <span className="jpa__gift-count">{gifts.length} ideas</span>
          </summary>
          <ul className="jpa__gift-list">
            {gifts.map((gift) => {
              const left = gift.max - gift.taken;
              return (
                <li key={gift.id} className={`jpa__gift${left === 0 && !gift.mine ? " is-covered" : ""}`}>
                  <div className="jpa__gift-info">
                    <p className="jpa__gift-name">{gift.name}</p>
                    <p className="jpa__gift-meta">
                      {gift.tag && <span className="jpa__gift-tag">{TAGS[gift.tag]}</span>}
                      {gift.mine > 0 ? (
                        <span className="jpa__gift-yours">✓ Lo llevas tú{gift.mine > 1 && ` (${gift.mine})`}</span>
                      ) : left === 0 ? (
                        <span>¡Ya está cubierto!</span>
                      ) : (
                        gift.max > 1 && (
                          <span>
                            Quedan {left} de {gift.max}
                          </span>
                        )
                      )}
                    </p>
                    {noteFor(gift.id)}
                  </div>
                  <div className="jpa__gift-actions">
                    <a className="jpa__chip" href={gift.url} target="_blank" rel="noopener noreferrer">
                      Ver en la tienda
                    </a>
                    {token && gift.mine === 0 && left > 0 && (
                      <button
                        type="button"
                        className="jpa__chip jpa__gift-pick"
                        onClick={() => pick(gift, 1, gift.id)}
                        disabled={busy}
                      >
                        Lo llevo yo
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </details>
      ))}

      <p className="jpa__gifts-end">¿Prefieres sorprendernos con otra cosa? ¡Felices de la vida!</p>
    </div>
  );
}

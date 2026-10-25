-- Regalos que aparta cada invitado de la lista (src/content/jeanpaulandre-gifts.ts, por su id).
-- La lista y el máximo de cada regalo viven en el código; aquí solo lo elegido.
CREATE TABLE gift_picks (
  guest_id INTEGER NOT NULL REFERENCES guests (id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (guest_id, gift_id)
);

CREATE INDEX gift_picks_gift_id ON gift_picks (gift_id);

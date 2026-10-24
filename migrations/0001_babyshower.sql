-- Invitados al baby shower de Jean Paul André, sus visitas a la invitación y sus respuestas.
-- Cada invitado entra con su link personal: jeanpaulandre.humanoydev.com/babyshower?i=<token>

CREATE TABLE guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Una fila por cada vez que el invitado abre su invitación.
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests (id) ON DELETE CASCADE,
  visited_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT
);

CREATE INDEX visits_guest_id ON visits (guest_id);

-- Última respuesta de cada invitado (puede cambiarla con el mismo link).
CREATE TABLE rsvps (
  guest_id INTEGER PRIMARY KEY REFERENCES guests (id) ON DELETE CASCADE,
  attending INTEGER NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

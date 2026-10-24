-- Para detectar si un link se reenvió: identificador al azar que la invitación guarda en cada
-- navegador (localStorage), modelo del teléfono (solo Android lo informa) y la red, como hash
-- con sal de la IP (worker/babyshower.ts, networkHash): sirve para comparar, no para ver la IP.
ALTER TABLE visits ADD COLUMN device_id TEXT;
ALTER TABLE visits ADD COLUMN model TEXT;
ALTER TABLE visits ADD COLUMN network TEXT;

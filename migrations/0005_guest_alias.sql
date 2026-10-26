-- Alias de cada invitado, solo para papá y mamá (admin y correos): "Vecina del 502", "Mamá Rocío".
-- El nombre es el del saludo y puede quedar vacío ('') si no lo sabemos: la invitación dice "¡Hola!".
ALTER TABLE guests ADD COLUMN alias TEXT;

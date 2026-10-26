-- De quién es cada invitado: de papá, de mamá o de los dos. Solo se ve en el admin.
ALTER TABLE guests ADD COLUMN side TEXT CHECK (side IN ('papa', 'mama', 'ambos'));

-- Cuándo se le mandó la invitación por primera vez (al tocar WhatsApp o "Copiar link" en el admin).
ALTER TABLE guests ADD COLUMN sent_at TEXT;

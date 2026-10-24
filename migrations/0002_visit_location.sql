-- Ciudad y país de cada visita (de request.cf de Cloudflare). No se guarda la IP.
ALTER TABLE visits ADD COLUMN city TEXT;
ALTER TABLE visits ADD COLUMN country TEXT;

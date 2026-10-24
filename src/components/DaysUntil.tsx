"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Fecha de hoy en Lima, en formato AAAA-MM-DD.
function todayInLima() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

// Días que faltan hasta `date` (AAAA-MM-DD). Se calcula en el navegador porque el
// HTML estático se generó otro día; en el build no muestra nada.
export function DaysUntil({ date }: { date: string }) {
  const today = useSyncExternalStore(subscribe, todayInLima, () => null);
  if (!today) return null;
  const days = Math.round((Date.parse(date) - Date.parse(today)) / 86_400_000);
  if (days < 0) return null;
  return <>{days === 0 ? "Es hoy" : days === 1 ? "Falta 1 día" : `Faltan ${days} días`}</>;
}

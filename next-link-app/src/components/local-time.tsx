"use client";

import { useMemo } from "react";

export function LocalTime({ value }: { value: string }) {
  const formatted = useMemo(() => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, [value]);

  return <>{formatted}</>;
}

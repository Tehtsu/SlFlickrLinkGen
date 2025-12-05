"use client";

import dynamic from "next/dynamic";

const SnowEffect = dynamic(
  () => import("./snow-effect").then((m) => m.SnowEffect),
  { ssr: false }
);

export function SnowClient() {
  return <SnowEffect />;
}

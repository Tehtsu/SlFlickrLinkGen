"use client";

import { useState } from "react";

type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  blur: number;
  sparkle: boolean;
};

function isSnowSeason(now: Date) {
  const month = now.getMonth(); // 0 = Jan, 11 = Dec
  const day = now.getDate();
  // From 1 Dec through 5 Jan inclusive
  return (
    (month === 11 && day >= 1) || (month === 0 && day <= 5)
  );
}

export function SnowEffect() {
  const [flakes] = useState<Flake[]>(() => {
    if (!isSnowSeason(new Date())) return [];
    const count = 50;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 5 + Math.random() * 10,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.6 + Math.random() * 0.4,
      drift: Math.random() * 60 - 30,
      blur: Math.random() * 2.5,
      sparkle: Math.random() > 0.85,
    }));
  });

  if (flakes.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes snowFall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(
                var(--drift, 0px),
                110vh,
                0
              )
              rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 30,
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        {flakes.map((flake) => (
          <span
            key={flake.id}
            style={{
              position: "absolute",
              top: "-10vh",
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              borderRadius: "50%",
              background: flake.sparkle
                ? "radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.85), rgba(255,255,255,0.6))"
                : "radial-gradient(circle at 30% 30%, #f8fbff, rgba(255,255,255,0.75))",
              opacity: flake.opacity,
              filter: `blur(${flake.blur}px) drop-shadow(0 0 5px rgba(255,255,255,0.7))`,
              animation: `snowFall ${flake.duration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              transform: "translateZ(0)",
              willChange: "transform",
              // @ts-expect-error custom prop for CSS var
              "--drift": `${flake.drift}px`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "60px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, white 40%, white 100%)",
          }}
        />
      </div>
    </>
  );
}

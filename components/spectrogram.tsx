"use client";

import { useMemo } from "react";

export function Spectrogram({ seed = 7, compact = false }: { seed?: number; compact?: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: compact ? 34 : 64 }, (_, index) => {
        const raw = Math.sin((index + seed) * 0.74) * 44 + Math.cos((index + seed) * 0.19) * 26 + 48;
        return Math.max(12, Math.min(100, Math.round(raw)));
      }),
    [compact, seed]
  );

  return (
    <div className={`relative overflow-hidden border border-ion/20 bg-black/30 ${compact ? "h-24" : "h-56"} shadow-glow`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(118,247,213,0.12),transparent_40%,rgba(157,124,255,0.12))]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-ion/40" />
      <div className="absolute inset-0 flex items-end gap-1 px-3 pb-3">
        {bars.map((height, index) => (
          <div
            key={`${seed}-${index}`}
            className="flex-1 bg-gradient-to-t from-violet via-ion to-white/80 opacity-80"
            style={{
              height: `${height}%`,
              filter: `blur(${index % 7 === 0 ? 1 : 0}px)`
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ion/70">spectral placeholder</div>
    </div>
  );
}

import type { AcousticFeatures } from "@/lib/types";

export function AcousticFeaturePanel({ features, compact = false }: { features?: AcousticFeatures; compact?: boolean }) {
  if (!features) {
    return (
      <div className="border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Acoustic feature layer</p>
        <p className="mt-2 text-sm text-slate-400">Waiting for decoded audio evidence.</p>
      </div>
    );
  }

  const metrics = [
    { label: "Duration", value: features.durationMs ? `${(features.durationMs / 1000).toFixed(2)}s` : "fallback" },
    { label: "Centroid", value: features.spectralCentroidHz ? `${features.spectralCentroidHz} Hz` : "n/a" },
    { label: "Pitch", value: features.estimatedPitchHz ? `${features.estimatedPitchHz} Hz` : "unlocked" },
    { label: "Pulses", value: String(features.pulseCount) },
    { label: "Pulse rate", value: `${features.pulseRatePerSecond}/s` },
    { label: "Band", value: features.dominantBand }
  ];

  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Acoustic feature layer</p>
          <p className="mt-1 font-mono text-xs text-ion">{features.source === "decoded-audio" ? "decoded with Web Audio API" : "byte fallback signature"}</p>
        </div>
        <span className="w-fit border border-ion/20 bg-ion/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ion">Phase 2</span>
      </div>
      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-3"}`}>
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-white/10 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{metric.label}</p>
            <p className="mt-2 truncate font-mono text-sm text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

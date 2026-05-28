import type { Recording } from "@/lib/types";
import { ConfidenceBar, Panel } from "@/components/ui";
import { Spectrogram } from "@/components/spectrogram";

export function ReadingCard({ recording }: { recording: Recording }) {
  return (
    <Panel className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ion">Bioacoustic Reading</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{recording.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{new Date(recording.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Likely species</p>
          <p className="mt-1 text-sm text-white">{recording.analysis.likelySpecies}</p>
        </div>
      </div>

      <Spectrogram seed={recording.spectrogramSeed} />

      <div className="grid gap-4 md:grid-cols-3">
        <ConfidenceBar label="Signal confidence" value={recording.analysis.signalConfidence} />
        <ConfidenceBar label="Pattern strength" value={recording.analysis.patternStrength} />
        <ConfidenceBar label="Profile maturity" value={recording.analysis.profileMaturity} />
      </div>

      <div className="border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signal category</p>
        <p className="mt-2 font-mono text-sm text-violet">{recording.analysis.signalCategory}</p>
        <p className="mt-4 text-base leading-7 text-slate-100">{recording.analysis.interpretation}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Supporting evidence</p>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            {recording.analysis.supportingEvidence.map((item) => (
              <li key={item} className="border-l border-ion/40 pl-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-ion/20 bg-ion/5 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-ion">Recommended observation</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{recording.analysis.recommendedObservation}</p>
        </div>
      </div>
    </Panel>
  );
}

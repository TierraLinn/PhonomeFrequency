import Link from "next/link";
import type { AnimalProfile } from "@/lib/types";
import { ConfidenceBar } from "@/components/ui";

export function ProfileCard({ profile }: { profile: AnimalProfile }) {
  const latestConfidence = profile.confidenceTrend.at(-1) ?? 0;

  return (
    <Link href={`/profiles/detail?id=${profile.id}`} className="block border border-white/10 bg-white/[0.03] p-5 transition hover:border-ion/40 hover:bg-ion/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{profile.species}</p>
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ion">{profile.profileMaturity}% mature</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{profile.temperament}</p>
      <div className="mt-5 space-y-4">
        <ConfidenceBar label="Confidence trend" value={latestConfidence} />
        <ConfidenceBar label="Profile maturity" value={profile.profileMaturity} />
      </div>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Strongest repeated signal</p>
        <p className="mt-2 font-mono text-sm text-ion">{profile.strongestRepeatedSignal}</p>
      </div>
    </Link>
  );
}

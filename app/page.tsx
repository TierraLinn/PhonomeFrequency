"use client";

import Link from "next/link";
import { Activity, Archive, AudioLines, BrainCircuit, Database, Dna } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { ProfileCard } from "@/components/profile-card";
import { Spectrogram } from "@/components/spectrogram";
import { Metric, Panel } from "@/components/ui";
import { usePhonomeStore } from "@/components/store-provider";

const chamberCards = [
  { label: "Signal Chamber", icon: AudioLines, copy: "Upload or record vocal samples and add behavioral context." },
  { label: "Bioacoustic Reading", icon: BrainCircuit, copy: "Generate probability-based meaning estimates with evidence." },
  { label: "Echo Archive", icon: Archive, copy: "Track repeated recordings, outcomes, and confidence movement." },
  { label: "Research Vault", icon: Database, copy: "Keep language serious, scientific, and honest about uncertainty." }
];

export default function LandingPage() {
  const { store } = usePhonomeStore();
  const latest = store.recordings[0];
  const averageMaturity = Math.round(store.profiles.reduce((sum, profile) => sum + profile.profileMaturity, 0) / store.profiles.length);

  return (
    <div className="space-y-8">
      <section className="grid min-h-[72vh] items-center gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.36em] text-ion">PhonomeFrequency</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-7xl">Map the frequency of animal meaning.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            An animal communication intelligence platform that detects acoustic patterns, context signals, and repeated observations to build probability-based translation maps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signal-chamber" className="border border-ion/40 bg-ion px-5 py-3 text-sm font-semibold text-abyss shadow-glow">
              Open Signal Chamber
            </Link>
            <Link href="/profiles" className="border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              View Species Matrix
            </Link>
          </div>
        </div>
        <Panel className="relative overflow-hidden">
          <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">scientific oracle interface</div>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-12 place-items-center border border-ion/40 bg-ion/10">
              <Dna className="size-6 text-ion" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-ion">Communication Reading</p>
              <h2 className="text-2xl font-semibold text-white">{latest ? latest.name : "Awaiting first signal"}</h2>
            </div>
          </div>
          <Spectrogram seed={latest?.spectrogramSeed ?? 19} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="Signal Confidence" value={latest?.analysis.signalConfidence ?? 72} />
            <Metric label="Pattern Strength" value={latest?.analysis.patternStrength ?? 66} tone="violet" />
            <Metric label="Profile Maturity" value={latest?.analysis.profileMaturity ?? averageMaturity} tone="ember" />
          </div>
        </Panel>
      </section>

      <Disclaimer />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {chamberCards.map((item) => {
          const Icon = item.icon;
          return (
            <Panel key={item.label}>
              <Icon className="size-6 text-ion" />
              <h3 className="mt-5 text-lg font-semibold text-white">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
            </Panel>
          );
        })}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-violet">Species Matrix</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Seed animal profiles</h2>
          </div>
          <Activity className="hidden size-7 text-violet sm:block" />
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {store.profiles.slice(0, 4).map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Spectrogram } from "@/components/spectrogram";
import { usePhonomeStore } from "@/components/store-provider";
import { ConfidenceBar, EmptyState, Metric, PageHeader, Panel } from "@/components/ui";

export default function AnimalProfileDetailPage() {
  return (
    <Suspense fallback={<EmptyState title="Loading profile" copy="Preparing the animal communication profile." />}>
      <AnimalProfileDetailContent />
    </Suspense>
  );
}

function AnimalProfileDetailContent() {
  const params = useSearchParams();
  const profileId = params.get("id") ?? "";
  const { store } = usePhonomeStore();
  const profile = store.profiles.find((item) => item.id === profileId);
  const recordings = store.recordings.filter((item) => item.animalId === profileId);

  if (!profile) {
    return <EmptyState title="Profile not found" copy="Return to the Species Matrix and select an existing animal profile." />;
  }

  const latestConfidence = profile.confidenceTrend.at(-1) ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title={profile.name} copy={`${profile.species}. ${profile.temperament}`} actionHref="/signal-chamber" actionLabel="Add recording" />

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Recordings" value={recordings.length} />
        <Metric label="Latest Confidence" value={`${latestConfidence}%`} tone="violet" />
        <Metric label="Profile Maturity" value={`${profile.profileMaturity}%`} tone="ember" />
      </div>

      <Panel>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ion">Animal vocal profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{profile.strongestRepeatedSignal}</h2>
            <div className="mt-5 space-y-4">
              <ConfidenceBar label="Confidence trend" value={latestConfidence} />
              <ConfidenceBar label="Profile maturity" value={profile.profileMaturity} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.confirmedContextLabels.length ? (
                profile.confirmedContextLabels.map((label) => (
                  <span key={label} className="border border-ion/20 bg-ion/5 px-3 py-1.5 font-mono text-xs text-ion">
                    {label}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No confirmed context labels yet.</span>
              )}
            </div>
          </div>
          <Spectrogram seed={profile.name.length * 11 + profile.profileMaturity} />
        </div>
      </Panel>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">Profile recordings</h2>
        {recordings.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {recordings.map((recording) => (
              <Link key={recording.id} href={`/reading?recording=${recording.id}`} className="border border-white/10 bg-white/[0.03] p-4 transition hover:border-ion/40">
                <Spectrogram seed={recording.spectrogramSeed} compact />
                <h3 className="mt-4 text-lg font-semibold text-white">{recording.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{recording.analysis.interpretation}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No recordings attached" copy="Add a recording from the Signal Chamber to begin building this animal's individual vocal profile." />
        )}
      </section>
    </div>
  );
}

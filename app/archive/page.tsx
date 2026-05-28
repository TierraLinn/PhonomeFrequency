"use client";

import Link from "next/link";
import { Spectrogram } from "@/components/spectrogram";
import { usePhonomeStore } from "@/components/store-provider";
import { EmptyState, PageHeader } from "@/components/ui";

export default function ArchivePage() {
  const { store } = usePhonomeStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Echo Archive" copy="A local development archive of uploaded recordings, generated readings, context notes, and post-reading feedback." actionHref="/signal-chamber" actionLabel="Add signal" />
      {store.recordings.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {store.recordings.map((recording) => {
            const profile = store.profiles.find((item) => item.id === recording.animalId);
            return (
              <Link key={recording.id} href={`/reading?recording=${recording.id}`} className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 transition hover:border-ion/40 md:grid-cols-[180px_1fr]">
                <Spectrogram seed={recording.spectrogramSeed} bands={recording.acousticFeatures?.spectralBands} compact />
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{recording.name}</h2>
                      <p className="mt-1 text-sm text-slate-400">{profile?.name ?? "Unknown"} - {recording.fileName}</p>
                    </div>
                    <span className="font-mono text-xs text-ion">{recording.analysis.signalConfidence}%</span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">{recording.analysis.interpretation}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    <span className="border border-white/10 px-2 py-1">{recording.analysis.signalCategory}</span>
                    <span className="border border-white/10 px-2 py-1">{recording.sizeLabel}</span>
                    <span className="border border-white/10 px-2 py-1">{recording.acousticFeatures ? "feature layer" : "sim layer"}</span>
                    <span className="border border-white/10 px-2 py-1">{recording.feedback ? "feedback logged" : "feedback open"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Echo Archive is empty" copy="Every generated reading will appear here with its spectrogram placeholder, evidence, and feedback state." />
      )}
    </div>
  );
}

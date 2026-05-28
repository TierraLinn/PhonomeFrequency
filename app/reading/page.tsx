"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { FeedbackForm } from "@/components/feedback-form";
import { ReadingCard } from "@/components/reading-card";
import { usePhonomeStore } from "@/components/store-provider";
import { EmptyState, PageHeader } from "@/components/ui";

export default function ReadingPage() {
  return (
    <Suspense fallback={<EmptyState title="Loading reading" copy="Preparing the latest bioacoustic reading." />}>
      <ReadingContent />
    </Suspense>
  );
}

function ReadingContent() {
  const params = useSearchParams();
  const { store } = usePhonomeStore();
  const id = params.get("recording");
  const recording = (id ? store.recordings.find((item) => item.id === id) : store.recordings[0]) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bioacoustic Reading"
        copy="PhonomeFrequency presents structured interpretation as probability, evidence, and observation guidance. It does not claim perfect translation."
        actionHref="/signal-chamber"
        actionLabel="Analyze another signal"
      />
      {recording ? (
        <>
          <ReadingCard recording={recording} />
          <FeedbackForm recording={recording} />
          <Disclaimer />
        </>
      ) : (
        <div className="space-y-4">
          <EmptyState title="No reading generated yet" copy="Open the Signal Chamber, upload or record a sound, and the simulated analysis engine will create the first reading." />
          <Link href="/signal-chamber" className="inline-block border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss">
            Open Signal Chamber
          </Link>
        </div>
      )}
    </div>
  );
}

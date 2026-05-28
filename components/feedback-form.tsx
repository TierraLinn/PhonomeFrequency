"use client";

import { useState } from "react";
import type { ContextLabel, Recording } from "@/lib/types";
import { addFeedback } from "@/lib/storage";
import { usePhonomeStore } from "@/components/store-provider";

const labels: ContextLabel[] = ["food", "door", "attention", "distress", "play", "unknown", "other"];

export function FeedbackForm({ recording }: { recording: Recording }) {
  const { refresh } = usePhonomeStore();
  const [accurate, setAccurate] = useState<"yes" | "no" | "unsure">(recording.feedback?.accurate ?? "unsure");
  const [contextLabel, setContextLabel] = useState<ContextLabel>(recording.feedback?.contextLabel ?? "unknown");
  const [happenedAfter, setHappenedAfter] = useState(recording.feedback?.happenedAfter ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="border border-white/10 bg-white/[0.03] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        addFeedback(recording.id, {
          accurate,
          contextLabel,
          happenedAfter,
          createdAt: new Date().toISOString()
        });
        setSaved(true);
        refresh();
      }}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Reading feedback</h3>
          <p className="mt-1 text-sm text-slate-400">Feedback strengthens the animal&apos;s individual signal profile over time.</p>
        </div>
        {saved ? <span className="font-mono text-xs uppercase tracking-[0.2em] text-ion">profile updated</span> : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label>
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Was this accurate?</span>
          <select value={accurate} onChange={(event) => setAccurate(event.target.value as "yes" | "no" | "unsure")} className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none focus:border-ion">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Confirmed context</span>
          <select value={contextLabel} onChange={(event) => setContextLabel(event.target.value as ContextLabel)} className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none focus:border-ion">
            {labels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="md:col-span-1">
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">What happened after?</span>
          <input value={happenedAfter} onChange={(event) => setHappenedAfter(event.target.value)} placeholder="e.g. walked to the door" className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ion" />
        </label>
      </div>

      <button type="submit" className="mt-5 border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss shadow-glow">
        Save feedback to profile
      </button>
    </form>
  );
}

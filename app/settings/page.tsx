"use client";

import { useState } from "react";
import { Disclaimer } from "@/components/disclaimer";
import { usePhonomeStore } from "@/components/store-provider";
import { loadStore, saveStore } from "@/lib/storage";
import { seedStore } from "@/lib/seed";
import { PageHeader, Panel } from "@/components/ui";

export default function SettingsPage() {
  const { store, refresh } = usePhonomeStore();
  const [exportText, setExportText] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings / Privacy" copy="Development controls for local browser storage, privacy posture, and data export." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold text-white">Local storage policy</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            This MVP stores profile and recording metadata in your browser&apos;s localStorage. Uploaded audio is converted to a local data URL for development preview. No cloud upload is configured yet.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={() => setExportText(JSON.stringify(loadStore(), null, 2))} className="border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss">
              Export local data
            </button>
            <button
              onClick={() => {
                saveStore(seedStore);
                setExportText("");
                refresh();
              }}
              className="border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
            >
              Reset demo data
            </button>
          </div>
        </Panel>
        <Panel>
          <h2 className="text-xl font-semibold text-white">Current local dataset</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <DatasetStat label="Profiles" value={store.profiles.length} />
            <DatasetStat label="Recordings" value={store.recordings.length} />
            <DatasetStat label="Feedback" value={store.recordings.filter((item) => item.feedback).length} />
          </div>
        </Panel>
      </div>
      {exportText ? (
        <textarea readOnly value={exportText} className="h-80 w-full border border-white/10 bg-black/40 p-4 font-mono text-xs leading-5 text-slate-300 outline-none" />
      ) : null}
      <Disclaimer />
    </div>
  );
}

function DatasetStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="font-mono text-2xl text-ion">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}

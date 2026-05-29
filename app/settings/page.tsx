"use client";

import { useState } from "react";
import { Disclaimer } from "@/components/disclaimer";
import { usePhonomeStore } from "@/components/store-provider";
import { loadStore, saveStore } from "@/lib/storage";
import { seedStore } from "@/lib/seed";
import { PageHeader, Panel } from "@/components/ui";
import { ensureCloudIdentity, getCloudSyncStatus, pullStoreFromCloud, pushStoreToCloud } from "@/lib/cloud-sync";

export default function SettingsPage() {
  const { store, refresh } = usePhonomeStore();
  const [exportText, setExportText] = useState("");
  const [cloudMessage, setCloudMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const cloudStatus = getCloudSyncStatus();

  async function runCloudAction(action: () => Promise<string>) {
    setSyncing(true);
    setCloudMessage("Connecting to cloud archive...");
    try {
      setCloudMessage(await action());
    } catch (error) {
      setCloudMessage(error instanceof Error ? error.message : "Cloud archive action failed.");
    } finally {
      setSyncing(false);
    }
  }

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
      <Panel>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ion">Cloud archive bridge</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Database-backed profiles and readings</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This bridge syncs animal profiles, acoustic feature layers, readings, and feedback to Supabase when the free project keys are configured. Audio file bytes stay local in this step; the next backend step is Supabase Storage for original recordings.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-4 lg:min-w-72">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Connection</p>
            <p className={`mt-2 font-mono text-sm ${cloudStatus.configured ? "text-ion" : "text-ember"}`}>{cloudStatus.configured ? "configured" : "not configured"}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{cloudStatus.projectHost}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            disabled={!cloudStatus.configured || syncing}
            onClick={() =>
              runCloudAction(async () => {
                const identity = await ensureCloudIdentity();
                return `Cloud identity ready: ${identity.userId.slice(0, 8)}...`;
              })
            }
            className="border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss disabled:cursor-not-allowed disabled:opacity-40"
          >
            Initialize cloud identity
          </button>
          <button
            type="button"
            disabled={!cloudStatus.configured || syncing}
            onClick={() =>
              runCloudAction(async () => {
                const result = await pushStoreToCloud(loadStore());
                return `Pushed ${result.profiles} profiles and ${result.recordings} readings to cloud.`;
              })
            }
            className="border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Push local to cloud
          </button>
          <button
            type="button"
            disabled={!cloudStatus.configured || syncing}
            onClick={() =>
              runCloudAction(async () => {
                const nextStore = await pullStoreFromCloud(store.selectedProfileId);
                saveStore(nextStore);
                refresh();
                return `Pulled ${nextStore.profiles.length} profiles and ${nextStore.recordings.length} readings from cloud.`;
              })
            }
            className="border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Pull cloud archive
          </button>
        </div>
        {cloudMessage ? <p className="mt-4 border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-300">{cloudMessage}</p> : null}
        {!cloudStatus.configured ? (
          <p className="mt-4 border border-ember/30 bg-ember/10 px-3 py-2 text-sm leading-6 text-amber-100">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to activate cloud sync. The exact setup steps and SQL are in `docs/SUPABASE_SETUP.md`.
          </p>
        ) : null}
      </Panel>
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

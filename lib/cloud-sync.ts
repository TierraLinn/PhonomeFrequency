"use client";

import type { AnimalProfile, ContextLabel, PhonomeStore, Recording } from "@/lib/types";

type CloudSyncStatus = {
  configured: boolean;
  projectHost: string;
};

type CloudIdentity = {
  userId: string;
  isAnonymous: boolean;
};

type SupabaseClientInstance = Awaited<ReturnType<typeof createBrowserClient>>;

let clientPromise: Promise<SupabaseClientInstance> | null = null;

export function getCloudSyncStatus(): CloudSyncStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  return {
    configured: Boolean(url && key),
    projectHost: url ? safeHost(url) : "not configured"
  };
}

export async function ensureCloudIdentity(): Promise<CloudIdentity> {
  const client = await getClient();
  const sessionResult = await client.auth.getSession();
  if (sessionResult.error) throw new Error(sessionResult.error.message);

  const existingUser = sessionResult.data.session?.user;
  if (existingUser) {
    return {
      userId: existingUser.id,
      isAnonymous: Boolean(existingUser.is_anonymous)
    };
  }

  const anonymousResult = await client.auth.signInAnonymously();
  if (anonymousResult.error) throw new Error(anonymousResult.error.message);
  const user = anonymousResult.data.user;
  if (!user) throw new Error("Supabase did not return an anonymous cloud identity.");

  return {
    userId: user.id,
    isAnonymous: Boolean(user.is_anonymous)
  };
}

export async function pushStoreToCloud(store: PhonomeStore) {
  const client = await getClient();
  const identity = await ensureCloudIdentity();

  const profileRows = store.profiles.map(profileToRow);
  if (profileRows.length) {
    const { error } = await client.from("phonome_profiles").upsert(profileRows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }

  const recordingRows = store.recordings.map(recordingToRow);
  if (recordingRows.length) {
    const { error } = await client.from("phonome_recordings").upsert(recordingRows, { onConflict: "id" });
    if (error) throw new Error(error.message);
  }

  return {
    identity,
    profiles: profileRows.length,
    recordings: recordingRows.length
  };
}

export async function pullStoreFromCloud(selectedProfileId?: string): Promise<PhonomeStore> {
  const client = await getClient();
  await ensureCloudIdentity();

  const profileResult = await client.from("phonome_profiles").select("*").order("created_at", { ascending: false });
  if (profileResult.error) throw new Error(profileResult.error.message);

  const recordingResult = await client.from("phonome_recordings").select("*").order("created_at", { ascending: false });
  if (recordingResult.error) throw new Error(recordingResult.error.message);

  const profiles = (profileResult.data ?? []).map(rowToProfile);
  const recordings = (recordingResult.data ?? []).map(rowToRecording);
  if (!profiles.length) throw new Error("No cloud profiles found yet. Push local data to cloud first.");

  const selectedStillExists = selectedProfileId && profiles.some((profile) => profile.id === selectedProfileId);

  return {
    profiles,
    recordings,
    selectedProfileId: selectedStillExists ? selectedProfileId : profiles[0]?.id ?? ""
  };
}

async function getClient() {
  if (!getCloudSyncStatus().configured) {
    throw new Error("Cloud sync is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
  }

  clientPromise ??= createBrowserClient();
  return clientPromise;
}

async function createBrowserClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true
    }
  });
}

function profileToRow(profile: AnimalProfile) {
  return {
    id: profile.id,
    name: profile.name,
    species: profile.species,
    temperament: profile.temperament,
    recording_ids: profile.recordings,
    confirmed_context_labels: profile.confirmedContextLabels,
    strongest_repeated_signal: profile.strongestRepeatedSignal,
    confidence_trend: profile.confidenceTrend,
    profile_maturity: profile.profileMaturity,
    created_at: profile.createdAt
  };
}

function rowToProfile(row: Record<string, unknown>): AnimalProfile {
  return {
    id: String(row.id),
    name: String(row.name ?? "Unnamed animal"),
    species: String(row.species ?? "Unknown species"),
    temperament: String(row.temperament ?? "early profile"),
    recordings: toStringArray(row.recording_ids),
    confirmedContextLabels: toContextLabels(row.confirmed_context_labels),
    strongestRepeatedSignal: String(row.strongest_repeated_signal ?? "early profile forming"),
    confidenceTrend: toNumberArray(row.confidence_trend),
    profileMaturity: Number(row.profile_maturity ?? 0),
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

function recordingToRow(recording: Recording) {
  return {
    id: recording.id,
    animal_id: recording.animalId,
    name: recording.name,
    type: recording.type,
    file_name: recording.fileName,
    duration_label: recording.durationLabel,
    size_label: recording.sizeLabel,
    created_at: recording.createdAt,
    context_note: recording.contextNote,
    spectrogram_seed: recording.spectrogramSeed,
    acoustic_features: recording.acousticFeatures ?? null,
    analysis: recording.analysis,
    feedback: recording.feedback ?? null
  };
}

function rowToRecording(row: Record<string, unknown>): Recording {
  return {
    id: String(row.id),
    animalId: String(row.animal_id),
    name: String(row.name ?? "Cloud recording"),
    type: row.type === "recording" ? "recording" : "upload",
    fileName: String(row.file_name ?? "cloud-signal"),
    durationLabel: String(row.duration_label ?? "cloud record"),
    sizeLabel: String(row.size_label ?? "metadata"),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    contextNote: String(row.context_note ?? ""),
    spectrogramSeed: Number(row.spectrogram_seed ?? 19),
    acousticFeatures: isObject(row.acoustic_features) ? (row.acoustic_features as Recording["acousticFeatures"]) : undefined,
    analysis: row.analysis as Recording["analysis"],
    feedback: isObject(row.feedback) ? (row.feedback as Recording["feedback"]) : undefined
  };
}

function toContextLabels(value: unknown): ContextLabel[] {
  const allowed = new Set<ContextLabel>(["food", "door", "attention", "distress", "play", "unknown", "other"]);
  return toStringArray(value).filter((item): item is ContextLabel => allowed.has(item as ContextLabel));
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function toNumberArray(value: unknown) {
  return Array.isArray(value) ? value.map(Number).filter(Number.isFinite) : [];
}

function isObject(value: unknown) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "invalid project url";
  }
}

"use client";

import type { AnimalProfile, ContextLabel, Feedback, PhonomeStore, Recording } from "@/lib/types";
import { seedStore } from "@/lib/seed";

const storeKey = "phonomefrequency:bioacoustic-store:v1";

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadStore(): PhonomeStore {
  if (typeof window === "undefined") return seedStore;
  const raw = window.localStorage.getItem(storeKey);
  if (!raw) {
    window.localStorage.setItem(storeKey, JSON.stringify(seedStore));
    return seedStore;
  }

  try {
    const store = JSON.parse(raw) as PhonomeStore;
    window.localStorage.setItem(storeKey, JSON.stringify(store));
    return store;
  } catch {
    window.localStorage.setItem(storeKey, JSON.stringify(seedStore));
    return seedStore;
  }
}

export function saveStore(store: PhonomeStore) {
  window.localStorage.setItem(storeKey, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("phonomefrequency-store-updated"));
}

export function addProfile(profile: Omit<AnimalProfile, "id" | "recordings" | "confirmedContextLabels" | "strongestRepeatedSignal" | "confidenceTrend" | "profileMaturity" | "createdAt">) {
  const store = loadStore();
  const newProfile: AnimalProfile = {
    id: createId("animal"),
    name: profile.name,
    species: profile.species,
    temperament: profile.temperament,
    recordings: [],
    confirmedContextLabels: [],
    strongestRepeatedSignal: "insufficient repeated signals",
    confidenceTrend: [32],
    profileMaturity: 24,
    createdAt: new Date().toISOString()
  };

  saveStore({
    ...store,
    selectedProfileId: newProfile.id,
    profiles: [newProfile, ...store.profiles]
  });

  return newProfile;
}

export function addRecording(recording: Recording) {
  const store = loadStore();
  saveStore({
    ...store,
    selectedProfileId: recording.animalId,
    recordings: [recording, ...store.recordings],
    profiles: store.profiles.map((profile) =>
      profile.id === recording.animalId
        ? {
            ...profile,
            recordings: [recording.id, ...profile.recordings],
            profileMaturity: Math.min(99, Math.round((profile.profileMaturity + recording.analysis.profileMaturity) / 2)),
            confidenceTrend: [...profile.confidenceTrend.slice(-7), recording.analysis.signalConfidence]
          }
        : profile
    )
  });
}

export function addFeedback(recordingId: string, feedback: Feedback) {
  const store = loadStore();
  const recording = store.recordings.find((item) => item.id === recordingId);
  if (!recording) return;

  const confidenceDelta = feedback.accurate === "yes" ? 5 : feedback.accurate === "no" ? -3 : 1;
  const maturityDelta = feedback.contextLabel === "unknown" ? 1 : 6;
  const label = feedback.contextLabel;

  saveStore({
    ...store,
    recordings: store.recordings.map((item) => (item.id === recordingId ? { ...item, feedback } : item)),
    profiles: store.profiles.map((profile) => {
      if (profile.id !== recording.animalId) return profile;

      const labels = mergeLabels(profile.confirmedContextLabels, label);
      const adjustedConfidence = Math.max(5, Math.min(99, recording.analysis.signalConfidence + confidenceDelta));

      return {
        ...profile,
        confirmedContextLabels: labels,
        confidenceTrend: [...profile.confidenceTrend.slice(-8), adjustedConfidence],
        profileMaturity: Math.min(99, profile.profileMaturity + maturityDelta),
        strongestRepeatedSignal: inferRepeatedSignal(labels)
      };
    })
  });
}

function mergeLabels(labels: ContextLabel[], label: ContextLabel) {
  if (labels.includes(label)) return labels;
  return [...labels, label];
}

function inferRepeatedSignal(labels: ContextLabel[]) {
  if (labels.includes("food")) return "resource request cluster";
  if (labels.includes("distress")) return "stress marker sequence";
  if (labels.includes("door")) return "threshold transition alert";
  if (labels.includes("play")) return "play invitation rhythm";
  if (labels.includes("attention")) return "social contact call";
  return "early profile forming";
}

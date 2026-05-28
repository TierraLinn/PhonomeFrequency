import type { AnimalProfile, PhonomeStore } from "@/lib/types";

export const disclaimer =
  "These readings are probabilistic, not absolute. PhonomeFrequency analyzes acoustic structure, species patterns, behavior, environment, and repeated signal history. The more confirmed recordings added over time, the stronger the animal's individual communication profile becomes.";

const now = "2026-01-01T00:00:00.000Z";

export const seedProfiles: AnimalProfile[] = [
  {
    id: "racer",
    name: "Racer",
    species: "Domestic dog",
    temperament: "Fast-response, alert, routine-sensitive",
    recordings: [],
    confirmedContextLabels: ["door", "attention", "play"],
    strongestRepeatedSignal: "doorway alert pulse",
    confidenceTrend: [61, 64, 68, 71],
    profileMaturity: 68,
    createdAt: now
  },
  {
    id: "blackee",
    name: "Blackee",
    species: "Domestic cat",
    temperament: "Selective, food-timed, proximity-aware",
    recordings: [],
    confirmedContextLabels: ["food", "attention"],
    strongestRepeatedSignal: "short harmonic food call",
    confidenceTrend: [54, 59, 63],
    profileMaturity: 61,
    createdAt: now
  },
  {
    id: "grandfather",
    name: "Grandfather",
    species: "Senior dog",
    temperament: "Slow cadence, comfort-seeking, bonded",
    recordings: [],
    confirmedContextLabels: ["distress", "attention", "unknown"],
    strongestRepeatedSignal: "low comfort-seeking rise",
    confidenceTrend: [47, 51, 57],
    profileMaturity: 56,
    createdAt: now
  },
  {
    id: "twinee",
    name: "Twinee",
    species: "Domestic cat",
    temperament: "Mirrored social timing, high curiosity",
    recordings: [],
    confirmedContextLabels: ["play", "door", "unknown"],
    strongestRepeatedSignal: "paired trill sequence",
    confidenceTrend: [50, 58, 66],
    profileMaturity: 64,
    createdAt: now
  }
];

export const seedStore: PhonomeStore = {
  profiles: seedProfiles,
  recordings: [],
  selectedProfileId: "racer"
};

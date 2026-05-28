export type ContextLabel =
  | "food"
  | "door"
  | "attention"
  | "distress"
  | "play"
  | "unknown"
  | "other";

export type SignalCategory =
  | "request"
  | "orientation"
  | "social-contact"
  | "stress-marker"
  | "play-invitation"
  | "environmental-alert";

export type AnimalProfile = {
  id: string;
  name: string;
  species: string;
  temperament: string;
  recordings: string[];
  confirmedContextLabels: ContextLabel[];
  strongestRepeatedSignal: string;
  confidenceTrend: number[];
  profileMaturity: number;
  createdAt: string;
};

export type Recording = {
  id: string;
  animalId: string;
  name: string;
  type: "upload" | "recording";
  fileName: string;
  dataUrl?: string;
  durationLabel: string;
  sizeLabel: string;
  createdAt: string;
  contextNote: string;
  spectrogramSeed: number;
  analysis: Reading;
  feedback?: Feedback;
};

export type Reading = {
  likelySpecies: string;
  signalCategory: SignalCategory;
  interpretation: string;
  signalConfidence: number;
  patternStrength: number;
  profileMaturity: number;
  supportingEvidence: string[];
  recommendedObservation: string;
};

export type Feedback = {
  accurate: "yes" | "no" | "unsure";
  happenedAfter: string;
  contextLabel: ContextLabel;
  createdAt: string;
};

export type PhonomeStore = {
  profiles: AnimalProfile[];
  recordings: Recording[];
  selectedProfileId: string;
};

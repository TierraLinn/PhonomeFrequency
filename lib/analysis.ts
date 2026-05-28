import type { AcousticFeatures, AnimalProfile, Reading, SignalCategory } from "@/lib/types";

const categories: SignalCategory[] = [
  "request",
  "orientation",
  "social-contact",
  "stress-marker",
  "play-invitation",
  "environmental-alert"
];

const interpretations: Record<SignalCategory, string[]> = {
  request: [
    "The sound resembles a directed request pattern, likely tied to a resource, doorway, or repeated household routine.",
    "A short repeated pulse suggests the animal is attempting to move a human toward a known outcome."
  ],
  orientation: [
    "The vocal shape reads as orientation-seeking: the animal may be checking location, presence, or next movement.",
    "A mid-confidence orientation call is likely when the environment changes or a familiar person moves away."
  ],
  "social-contact": [
    "The signal most closely matches a social contact call, with emphasis on proximity and recognition rather than urgency.",
    "The cadence suggests the animal is maintaining connection with a person or another animal."
  ],
  "stress-marker": [
    "The structure indicates elevated arousal. PhonomeFrequency would treat this as a possible stress marker until more context is confirmed.",
    "This pattern has tension-like timing and should be observed alongside posture, pacing, and environmental triggers."
  ],
  "play-invitation": [
    "The rhythm resembles an invitation pattern: brief, elastic, and likely tied to movement or engagement.",
    "This signal may be playful or anticipatory, especially if followed by approach, tail movement, or object interaction."
  ],
  "environmental-alert": [
    "The reading points to an environmental alert: a doorway, vehicle, unfamiliar sound, or threshold event may have triggered it.",
    "A sharp onset and repeated envelope suggest the animal is flagging something outside its immediate body state."
  ]
};

export function analyzeSignal(profile: AnimalProfile, fileName: string, contextNote: string, features?: AcousticFeatures): Reading {
  const seed = hash(`${profile.id}:${fileName}:${contextNote}:${Date.now()}`);
  const category = chooseCategory(profile, contextNote, seed, features);
  const confidenceBase = 42 + (seed % 27);
  const maturityInfluence = Math.round(profile.profileMaturity * 0.22);
  const acousticInfluence = features ? Math.round(features.pitchConfidence * 10 + Math.min(8, features.pulseCount)) : 0;
  const signalConfidence = clamp(confidenceBase + maturityInfluence + acousticInfluence, 28, 94);
  const patternStrength = clamp(
    38 + ((seed >> 3) % 31) + Math.round(profile.recordings.length * 1.8) + (features ? Math.min(18, Math.round(features.rmsAmplitude * 34 + features.pulseRatePerSecond * 2)) : 0),
    20,
    98
  );
  const profileMaturity = clamp(profile.profileMaturity + Math.round(profile.recordings.length * 2.1), 15, 99);

  return {
    likelySpecies: profile.species,
    signalCategory: category,
    interpretation: interpretations[category][seed % interpretations[category].length],
    signalConfidence,
    patternStrength,
    profileMaturity,
    supportingEvidence: [
      `Matched against ${profile.name}'s ${profile.recordings.length || "early"} stored recording marker${profile.recordings.length === 1 ? "" : "s"}.`,
      `Known context labels: ${profile.confirmedContextLabels.length ? profile.confirmedContextLabels.join(", ") : "none confirmed yet"}.`,
      features ? acousticEvidence(features) : `Detected simulated envelope family: ${profile.strongestRepeatedSignal}.`,
      features ? `Pulse structure: ${features.pulseCount} detected pulse${features.pulseCount === 1 ? "" : "s"} at ${features.pulseRatePerSecond}/sec, with ${features.dominantBand}.` : "No decoded acoustic feature layer was available for this reading.",
      contextNote ? `Handler note included: "${contextNote.slice(0, 96)}"` : "No handler note supplied; reading weighted toward acoustic pattern only."
    ],
    recommendedObservation: recommendationFor(category)
  };
}

export function hash(input: string) {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value << 5) - value + input.charCodeAt(index);
    value |= 0;
  }
  return Math.abs(value);
}

function chooseCategory(profile: AnimalProfile, contextNote: string, seed: number, features?: AcousticFeatures) {
  const note = contextNote.toLowerCase();
  if (note.includes("food") || profile.confirmedContextLabels.includes("food")) return "request";
  if (note.includes("door") || note.includes("outside")) return "environmental-alert";
  if (note.includes("play") || profile.confirmedContextLabels.includes("play")) return "play-invitation";
  if (note.includes("stress") || note.includes("hurt") || note.includes("scared")) return "stress-marker";
  if (note.includes("attention") || profile.confirmedContextLabels.includes("attention")) return "social-contact";
  if (features && features.pulseRatePerSecond > 3.5 && features.spectralCentroidHz > 2200) return "environmental-alert";
  if (features && features.estimatedPitchHz && features.estimatedPitchHz < 180 && features.rmsAmplitude > 0.08) return "stress-marker";
  if (features && features.pulseCount >= 4 && features.dynamicRangeDb > 10) return "request";
  return categories[seed % categories.length];
}

function acousticEvidence(features: AcousticFeatures) {
  if (features.source === "byte-fallback") {
    return "Audio decoder could not read the file, so PhonomeFrequency used a byte-level file signature fallback.";
  }

  const pitch = features.estimatedPitchHz ? `${features.estimatedPitchHz} Hz estimated pitch` : "no stable pitch lock";
  return `Decoded acoustic layer: ${Math.round(features.durationMs / 10) / 100}s sample, ${features.spectralCentroidHz} Hz centroid, ${pitch}.`;
}

function recommendationFor(category: SignalCategory) {
  switch (category) {
    case "request":
      return "Log what resource or routine followed within two minutes, then confirm or reject the label.";
    case "orientation":
      return "Observe whether the animal moves toward a person, room, doorway, or familiar object.";
    case "social-contact":
      return "Note who was present and whether contact, eye gaze, or approach followed.";
    case "stress-marker":
      return "Check posture, breathing, pacing, and environmental changes before assigning meaning.";
    case "play-invitation":
      return "Watch for object interaction, bouncing movement, or repeated approach-and-retreat behavior.";
    case "environmental-alert":
      return "Identify doors, windows, vehicles, visitors, or sudden sounds near the recording time.";
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

import type { AcousticFeatures } from "@/lib/types";

type BrowserAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

const spectralBandCount = 64;
const waveformPointCount = 80;

export async function extractAcousticFeatures(input: Blob): Promise<AcousticFeatures> {
  const buffer = await input.arrayBuffer();

  try {
    const AudioContextClass = window.AudioContext ?? (window as BrowserAudioWindow).webkitAudioContext;
    if (!AudioContextClass) return byteFallback(buffer);

    const audioContext = new AudioContextClass();
    const audioBuffer = await audioContext.decodeAudioData(buffer.slice(0));
    const mono = mixToMono(audioBuffer);
    const features = analyzePcm(mono, audioBuffer.sampleRate, audioBuffer.duration);
    await audioContext.close();
    return features;
  } catch {
    return byteFallback(buffer);
  }
}

function mixToMono(audioBuffer: AudioBuffer) {
  const channelCount = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const mono = new Float32Array(length);

  for (let channel = 0; channel < channelCount; channel += 1) {
    const data = audioBuffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      mono[index] += data[index] / channelCount;
    }
  }

  return mono;
}

function analyzePcm(samples: Float32Array, sampleRate: number, durationSeconds: number): AcousticFeatures {
  const trimmed = trimForAnalysis(samples, sampleRate);
  const peakAmplitude = findPeak(trimmed);
  const rmsAmplitude = findRms(trimmed);
  const zeroCrossingRate = findZeroCrossingRate(trimmed, sampleRate);
  const pitch = estimatePitch(trimmed, sampleRate);
  const spectrum = analyzeSpectrum(trimmed, sampleRate);
  const pulses = detectPulses(samples, sampleRate);

  return {
    source: "decoded-audio",
    durationMs: Math.round(durationSeconds * 1000),
    sampleRate,
    peakAmplitude,
    rmsAmplitude,
    dynamicRangeDb: toDb(peakAmplitude / Math.max(rmsAmplitude, 0.00001)),
    zeroCrossingRate,
    estimatedPitchHz: pitch.frequency,
    pitchConfidence: pitch.confidence,
    spectralCentroidHz: spectrum.centroid,
    spectralSpreadHz: spectrum.spread,
    dominantBand: bandLabel(spectrum.centroid),
    pulseCount: pulses.count,
    pulseRatePerSecond: pulses.rate,
    spectralBands: spectrum.bands,
    waveform: buildWaveform(samples)
  };
}

function trimForAnalysis(samples: Float32Array, sampleRate: number) {
  const maxLength = Math.min(samples.length, sampleRate * 4);
  if (samples.length <= maxLength) return samples;

  const start = Math.max(0, Math.floor(samples.length / 2 - maxLength / 2));
  return samples.slice(start, start + maxLength);
}

function findPeak(samples: Float32Array) {
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  return round(peak, 4);
}

function findRms(samples: Float32Array) {
  let sum = 0;
  for (const sample of samples) sum += sample * sample;
  return round(Math.sqrt(sum / Math.max(1, samples.length)), 4);
}

function findZeroCrossingRate(samples: Float32Array, sampleRate: number) {
  let crossings = 0;
  for (let index = 1; index < samples.length; index += 1) {
    if ((samples[index - 1] < 0 && samples[index] >= 0) || (samples[index - 1] >= 0 && samples[index] < 0)) {
      crossings += 1;
    }
  }
  const seconds = samples.length / sampleRate;
  return round(crossings / Math.max(seconds, 0.001), 2);
}

function estimatePitch(samples: Float32Array, sampleRate: number) {
  const segmentLength = Math.min(4096, samples.length);
  if (segmentLength < 512) return { frequency: null, confidence: 0 };

  const start = findStrongestWindowStart(samples, segmentLength);
  const segment = samples.slice(start, start + segmentLength);
  const minLag = Math.floor(sampleRate / 1200);
  const maxLag = Math.min(Math.floor(sampleRate / 45), Math.floor(segmentLength / 2));
  let bestLag = 0;
  let bestScore = -Infinity;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let score = 0;
    let energyA = 0;
    let energyB = 0;
    for (let index = 0; index < segmentLength - lag; index += 1) {
      const a = segment[index];
      const b = segment[index + lag];
      score += a * b;
      energyA += a * a;
      energyB += b * b;
    }
    const normalized = score / Math.sqrt(Math.max(energyA * energyB, 0.000001));
    if (normalized > bestScore) {
      bestScore = normalized;
      bestLag = lag;
    }
  }

  if (!bestLag || bestScore < 0.24) return { frequency: null, confidence: round(Math.max(0, bestScore), 2) };

  return {
    frequency: Math.round(sampleRate / bestLag),
    confidence: round(Math.max(0, Math.min(1, bestScore)), 2)
  };
}

function findStrongestWindowStart(samples: Float32Array, segmentLength: number) {
  let bestStart = 0;
  let bestEnergy = -Infinity;
  const step = Math.max(256, Math.floor(segmentLength / 4));

  for (let start = 0; start + segmentLength <= samples.length; start += step) {
    let energy = 0;
    for (let index = start; index < start + segmentLength; index += 1) {
      energy += samples[index] * samples[index];
    }
    if (energy > bestEnergy) {
      bestEnergy = energy;
      bestStart = start;
    }
  }

  return bestStart;
}

function analyzeSpectrum(samples: Float32Array, sampleRate: number) {
  const size = 1024;
  const start = findStrongestWindowStart(samples, Math.min(size, samples.length));
  const segment = new Float32Array(size);

  for (let index = 0; index < size; index += 1) {
    const sample = samples[start + index] ?? 0;
    const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (size - 1));
    segment[index] = sample * window;
  }

  const powers: number[] = [];
  let totalPower = 0;
  let weightedFrequency = 0;

  for (let bin = 1; bin < size / 2; bin += 1) {
    let real = 0;
    let imaginary = 0;
    for (let index = 0; index < size; index += 1) {
      const angle = (2 * Math.PI * bin * index) / size;
      real += segment[index] * Math.cos(angle);
      imaginary -= segment[index] * Math.sin(angle);
    }
    const power = real * real + imaginary * imaginary;
    const frequency = (bin * sampleRate) / size;
    powers.push(power);
    totalPower += power;
    weightedFrequency += frequency * power;
  }

  const centroid = totalPower ? weightedFrequency / totalPower : 0;
  let spreadSum = 0;
  powers.forEach((power, index) => {
    const frequency = ((index + 1) * sampleRate) / size;
    spreadSum += (frequency - centroid) ** 2 * power;
  });

  return {
    centroid: Math.round(centroid),
    spread: Math.round(Math.sqrt(spreadSum / Math.max(totalPower, 0.000001))),
    bands: buildSpectralBands(powers)
  };
}

function buildSpectralBands(powers: number[]) {
  const bands: number[] = [];
  const max = Math.max(...powers, 0.000001);
  const binsPerBand = powers.length / spectralBandCount;

  for (let band = 0; band < spectralBandCount; band += 1) {
    const start = Math.floor(band * binsPerBand);
    const end = Math.max(start + 1, Math.floor((band + 1) * binsPerBand));
    const slice = powers.slice(start, end);
    const average = slice.reduce((sum, value) => sum + value, 0) / slice.length;
    bands.push(Math.max(8, Math.min(100, Math.round((Math.sqrt(average) / Math.sqrt(max)) * 100))));
  }

  return bands;
}

function detectPulses(samples: Float32Array, sampleRate: number) {
  const frameSize = Math.max(128, Math.floor(sampleRate * 0.025));
  const envelopes: number[] = [];

  for (let start = 0; start < samples.length; start += frameSize) {
    let sum = 0;
    let count = 0;
    for (let index = start; index < Math.min(samples.length, start + frameSize); index += 1) {
      sum += Math.abs(samples[index]);
      count += 1;
    }
    envelopes.push(sum / Math.max(1, count));
  }

  const mean = envelopes.reduce((sum, value) => sum + value, 0) / Math.max(1, envelopes.length);
  const variance = envelopes.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, envelopes.length);
  const threshold = mean + Math.sqrt(variance) * 0.85;
  let count = 0;
  let armed = true;
  let lastPulseFrame = -Infinity;

  envelopes.forEach((value, frame) => {
    if (armed && value > threshold && frame - lastPulseFrame > 2) {
      count += 1;
      lastPulseFrame = frame;
      armed = false;
    }
    if (value < mean) armed = true;
  });

  const seconds = samples.length / sampleRate;
  return {
    count,
    rate: round(count / Math.max(seconds, 0.001), 2)
  };
}

function buildWaveform(samples: Float32Array) {
  const points: number[] = [];
  const samplesPerPoint = Math.max(1, Math.floor(samples.length / waveformPointCount));

  for (let point = 0; point < waveformPointCount; point += 1) {
    let peak = 0;
    const start = point * samplesPerPoint;
    for (let index = start; index < Math.min(samples.length, start + samplesPerPoint); index += 1) {
      peak = Math.max(peak, Math.abs(samples[index]));
    }
    points.push(Math.round(peak * 100));
  }

  return points;
}

function byteFallback(buffer: ArrayBuffer): AcousticFeatures {
  const bytes = new Uint8Array(buffer);
  const sampleCount = Math.max(bytes.length, 1);
  const waveform = Array.from({ length: waveformPointCount }, (_, point) => {
    const start = Math.floor((point / waveformPointCount) * sampleCount);
    const end = Math.max(start + 1, Math.floor(((point + 1) / waveformPointCount) * sampleCount));
    let peak = 0;
    for (let index = start; index < end; index += 1) {
      peak = Math.max(peak, Math.abs((bytes[index] ?? 128) - 128));
    }
    return Math.round((peak / 128) * 100);
  });
  const spectralBands = Array.from({ length: spectralBandCount }, (_, index) => {
    const byte = bytes[Math.floor((index / spectralBandCount) * sampleCount)] ?? 128;
    return Math.max(8, Math.round((Math.abs(byte - 128) / 128) * 100));
  });
  const average = bytes.reduce((sum, byte) => sum + Math.abs(byte - 128), 0) / sampleCount / 128;

  return {
    source: "byte-fallback",
    durationMs: 0,
    sampleRate: 0,
    peakAmplitude: round(Math.max(...waveform) / 100, 4),
    rmsAmplitude: round(average, 4),
    dynamicRangeDb: 0,
    zeroCrossingRate: 0,
    estimatedPitchHz: null,
    pitchConfidence: 0,
    spectralCentroidHz: 0,
    spectralSpreadHz: 0,
    dominantBand: "undecoded file signature",
    pulseCount: spectralBands.filter((value) => value > 55).length,
    pulseRatePerSecond: 0,
    spectralBands,
    waveform
  };
}

function bandLabel(centroid: number) {
  if (centroid < 350) return "low body resonance";
  if (centroid < 1400) return "mid harmonic call";
  if (centroid < 4200) return "high vocal band";
  if (centroid < 9000) return "upper harmonic band";
  return "ultrasonic-adjacent energy";
}

function toDb(ratio: number) {
  return round(20 * Math.log10(Math.max(ratio, 0.000001)), 2);
}

function round(value: number, places: number) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

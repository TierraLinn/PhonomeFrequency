"use client";

import { Mic, Square, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeSignal, hash } from "@/lib/analysis";
import { extractAcousticFeatures } from "@/lib/audio-features";
import { addRecording, createId } from "@/lib/storage";
import type { AcousticFeatures, Recording } from "@/lib/types";
import { usePhonomeStore } from "@/components/store-provider";
import { ProfilePicker } from "@/components/profile-picker";
import { Spectrogram } from "@/components/spectrogram";
import { AcousticFeaturePanel } from "@/components/acoustic-feature-panel";

export function SignalIntake() {
  const router = useRouter();
  const { store, refresh } = usePhonomeStore();
  const [contextNote, setContextNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string>("");
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [acousticFeatures, setAcousticFeatures] = useState<AcousticFeatures | undefined>();
  const [featureStatus, setFeatureStatus] = useState("Waiting for an audio signal.");
  const [formError, setFormError] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const selectedProfile = store.profiles.find((profile) => profile.id === store.selectedProfileId) ?? store.profiles[0];
  const previewSeed = hash(`${selectedProfile?.id}:${file?.name}:${recordingUrl}:${contextNote}`);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorder.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setRecordingBlob(blob);
      setRecordingUrl(URL.createObjectURL(blob));
      void extractFeatures(blob, "Microphone capture decoded into an acoustic feature layer.");
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  }

  async function submitSignal() {
    if (!selectedProfile) return;
    const activeFile = file ?? fileInput.current?.files?.[0] ?? null;
    const isRecorded = Boolean(recordingBlob);
    if (!activeFile && !recordingBlob) {
      setFormError("Upload an audio/video file or record a microphone sample before generating a reading.");
      return;
    }
    setFormError("");

    const fileName = activeFile?.name ?? `${selectedProfile.name.toLowerCase()}-field-recording.webm`;
    const dataUrl = activeFile ? await fileToDataUrl(activeFile) : recordingUrl;
    const size = activeFile?.size ?? recordingBlob?.size ?? 0;
    const features = acousticFeatures ?? (activeFile ? await extractAcousticFeatures(activeFile) : recordingBlob ? await extractAcousticFeatures(recordingBlob) : undefined);
    const analysis = analyzeSignal(selectedProfile, fileName, contextNote, features);
    const id = createId("signal");

    const recording: Recording = {
      id,
      animalId: selectedProfile.id,
      name: `${selectedProfile.name} signal ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      type: isRecorded ? "recording" : "upload",
      fileName,
      dataUrl,
      durationLabel: isRecorded ? "live capture" : "uploaded sample",
      sizeLabel: formatBytes(size),
      createdAt: new Date().toISOString(),
      contextNote,
      spectrogramSeed: previewSeed,
      acousticFeatures: features,
      analysis
    };

    addRecording(recording);
    refresh();
    router.push(`/reading?recording=${id}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="border border-white/10 bg-glass p-5 shadow-glow backdrop-blur-xl">
        <div className="space-y-5">
          <ProfilePicker />

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Upload animal audio</span>
            <div className="grid place-items-center border border-dashed border-ion/30 bg-ion/5 px-5 py-8 text-center">
              <Upload className="mb-3 size-7 text-ion" />
              <input
                type="file"
                accept="audio/*,video/*"
                ref={fileInput}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  setFile(nextFile);
                  setRecordingBlob(null);
                  setRecordingUrl("");
                  setAcousticFeatures(undefined);
                  if (nextFile) {
                    void extractFeatures(nextFile, "Uploaded file decoded into an acoustic feature layer.");
                  } else {
                    setFeatureStatus("Waiting for an audio signal.");
                  }
                }}
                className="w-full cursor-pointer text-sm text-slate-300 file:mr-4 file:border-0 file:bg-ion file:px-4 file:py-2 file:text-sm file:font-semibold file:text-abyss"
              />
              <p className="mt-3 text-xs leading-5 text-slate-500">Stored locally in browser storage for development. No server upload is performed in this MVP.</p>
            </div>
          </label>

          <div className="border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Record from microphone</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={startRecording} disabled={isRecording} className="inline-flex items-center gap-2 border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss disabled:cursor-not-allowed disabled:opacity-50">
                <Mic className="size-4" />
                Record
              </button>
              <button type="button" onClick={stopRecording} disabled={!isRecording} className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                <Square className="size-4" />
                Stop
              </button>
            </div>
            {recordingUrl ? <p className="mt-4 border border-ion/20 bg-ion/5 px-3 py-2 text-sm text-ion">Microphone capture stored locally for analysis preview.</p> : null}
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Behavioral context note</span>
            <textarea
              value={contextNote}
              onChange={(event) => setContextNote(event.target.value)}
              rows={4}
              placeholder="What was happening before the sound? Who was nearby? Any food, door, play, attention, or distress cues?"
              className="w-full resize-none border border-white/10 bg-abyss px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-ion"
            />
          </label>

          {formError ? <p className="border border-ember/30 bg-ember/10 px-3 py-2 text-sm text-amber-100">{formError}</p> : null}

          <button type="button" onClick={submitSignal} className="w-full border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss shadow-glow">
            {isExtracting ? "Extracting acoustic layer..." : "Generate probabilistic reading"}
          </button>
        </div>
      </section>

      <section className="border border-white/10 bg-black/20 p-5 shadow-violet">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-violet">Signal chamber</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Live analysis preview</h2>
          </div>
          <span className="font-mono text-xs text-slate-500">PHASE 2</span>
        </div>
        <Spectrogram seed={previewSeed} bands={acousticFeatures?.spectralBands} />
        <p className="mt-3 border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">{featureStatus}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <PreviewStat label="Species base" value={selectedProfile?.species ?? "none"} />
          <PreviewStat label="Profile" value={selectedProfile?.name ?? "none"} />
          <PreviewStat label="Input" value={file?.name ?? (recordingBlob ? "mic capture" : "waiting")} />
        </div>
        <div className="mt-4">
          <AcousticFeaturePanel features={acousticFeatures} compact />
        </div>
      </section>
    </div>
  );

  async function extractFeatures(blob: Blob, successMessage: string) {
    setIsExtracting(true);
    setFeatureStatus("Decoding acoustic structure in browser...");
    try {
      const features = await extractAcousticFeatures(blob);
      setAcousticFeatures(features);
      setFeatureStatus(features.source === "decoded-audio" ? successMessage : "Audio decoder fallback used; reading will use byte-level signal structure.");
    } catch {
      setAcousticFeatures(undefined);
      setFeatureStatus("Could not extract acoustic features from this file. Try another audio format.");
    } finally {
      setIsExtracting(false);
    }
  }
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-sm text-white">{value}</p>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

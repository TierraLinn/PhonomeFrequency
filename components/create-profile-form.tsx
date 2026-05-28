"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProfile } from "@/lib/storage";
import { usePhonomeStore } from "@/components/store-provider";

export function CreateProfileForm() {
  const router = useRouter();
  const { refresh } = usePhonomeStore();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [temperament, setTemperament] = useState("");

  return (
    <form
      className="border border-white/10 bg-glass p-5 shadow-glow"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim() || !species.trim()) return;
        const profile = addProfile({
          name: name.trim(),
          species: species.trim(),
          temperament: temperament.trim() || "Early profile, temperament not established"
        });
        refresh();
        router.push(`/profiles/detail?id=${profile.id}`);
      }}
    >
      <h2 className="text-xl font-semibold text-white">Create animal profile</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Profiles become stronger when readings are confirmed with real-world context.</p>
      <div className="mt-5 grid gap-4">
        <label>
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Luna" className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ion" />
        </label>
        <label>
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Species</span>
          <input value={species} onChange={(event) => setSpecies(event.target.value)} placeholder="e.g. Domestic cat" className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ion" />
        </label>
        <label>
          <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Temperament notes</span>
          <textarea value={temperament} onChange={(event) => setTemperament(event.target.value)} rows={4} placeholder="Routine-sensitive, food-timed, playful, anxious, bonded..." className="w-full resize-none border border-white/10 bg-abyss px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-ion" />
        </label>
      </div>
      <button type="submit" className="mt-5 w-full border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss shadow-glow">
        Create profile
      </button>
    </form>
  );
}

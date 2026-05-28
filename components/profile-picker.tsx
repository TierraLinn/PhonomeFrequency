"use client";

import { usePhonomeStore } from "@/components/store-provider";

export function ProfilePicker() {
  const { store, selectProfile } = usePhonomeStore();

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Animal profile</span>
      <select
        value={store.selectedProfileId}
        onChange={(event) => selectProfile(event.target.value)}
        className="w-full border border-white/10 bg-abyss px-3 py-3 text-sm text-white outline-none focus:border-ion"
      >
        {store.profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name} - {profile.species}
          </option>
        ))}
      </select>
    </label>
  );
}

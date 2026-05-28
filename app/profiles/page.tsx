"use client";

import { CreateProfileForm } from "@/components/create-profile-form";
import { ProfileCard } from "@/components/profile-card";
import { usePhonomeStore } from "@/components/store-provider";
import { PageHeader } from "@/components/ui";

export default function ProfilesPage() {
  const { store } = usePhonomeStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Species Matrix" copy="Animal profiles organize species data, repeated recordings, confirmed context labels, signal trends, and maturity scores." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {store.profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
        <CreateProfileForm />
      </div>
    </div>
  );
}

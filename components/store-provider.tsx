"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PhonomeStore } from "@/lib/types";
import { loadStore, saveStore } from "@/lib/storage";
import { seedStore } from "@/lib/seed";

type StoreContextValue = {
  store: PhonomeStore;
  refresh: () => void;
  selectProfile: (id: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<PhonomeStore>(seedStore);

  const refresh = () => setStore(loadStore());

  useEffect(() => {
    refresh();
    const listener = () => refresh();
    window.addEventListener("storage", listener);
    window.addEventListener("phonomefrequency-store-updated", listener);
    return () => {
      window.removeEventListener("storage", listener);
      window.removeEventListener("phonomefrequency-store-updated", listener);
    };
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      store,
      refresh,
      selectProfile: (id: string) => {
        const nextStore = { ...loadStore(), selectedProfileId: id };
        saveStore(nextStore);
        setStore(nextStore);
      }
    }),
    [store]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePhonomeStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("usePhonomeStore must be used inside StoreProvider");
  return context;
}

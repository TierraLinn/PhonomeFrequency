"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, AudioLines, BookOpenText, Dna, Home, Radar, Settings } from "lucide-react";
import { StoreProvider } from "@/components/store-provider";

const navItems = [
  { href: "/", label: "Landing", icon: Home },
  { href: "/signal-chamber", label: "Signal Chamber", icon: Radar },
  { href: "/reading", label: "Bioacoustic Reading", icon: AudioLines },
  { href: "/archive", label: "Echo Archive", icon: Archive },
  { href: "/profiles", label: "Species Matrix", icon: Dna },
  { href: "/research-vault", label: "Research Vault", icon: BookOpenText },
  { href: "/settings", label: "Privacy", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <StoreProvider>
      <div className="min-h-screen bg-abyss text-slate-100">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(118,247,213,0.16),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(157,124,255,0.16),transparent_32%),linear-gradient(135deg,#05070c_0%,#0a101b_42%,#05070c_100%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <header className="sticky top-0 z-30 border-b border-white/10 bg-abyss/72 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-10 place-items-center border border-ion/40 bg-ion/10 shadow-glow">
                <AudioLines className="size-5 text-ion" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-ion">PhonomeFrequency</p>
                <p className="text-sm text-slate-300">Animal Communication Intelligence</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 border px-3 py-2 text-xs transition ${
                      active
                        ? "border-ion/40 bg-ion/10 text-ion"
                        : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 border px-3 py-2 text-xs ${
                    active ? "border-ion/40 bg-ion/10 text-ion" : "border-white/10 text-slate-400"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </StoreProvider>
  );
}

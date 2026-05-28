import Link from "next/link";

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`border border-white/10 bg-glass p-5 shadow-glow backdrop-blur-xl ${className}`}>{children}</section>;
}

export function Metric({ label, value, tone = "ion" }: { label: string; value: string | number; tone?: "ion" | "violet" | "ember" }) {
  const color = tone === "ion" ? "text-ion" : tone === "violet" ? "text-violet" : "text-ember";
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className={`font-mono text-2xl ${color}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

export function PageHeader({ title, copy, actionHref, actionLabel }: { title: string; copy: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
      <div>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">{copy}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="w-fit border border-ion/40 bg-ion px-4 py-3 text-sm font-semibold text-abyss shadow-glow">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ConfidenceBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-ion">{value}%</span>
      </div>
      <div className="h-2 bg-white/10">
        <div className="h-full bg-gradient-to-r from-ion to-violet" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{copy}</p>
    </div>
  );
}

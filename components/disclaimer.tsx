import { disclaimer } from "@/lib/seed";

export function Disclaimer() {
  return (
    <aside className="border border-ember/30 bg-ember/10 p-4 text-sm leading-6 text-amber-100">
      <span className="font-semibold text-ember">Probabilistic reading:</span> {disclaimer}
    </aside>
  );
}

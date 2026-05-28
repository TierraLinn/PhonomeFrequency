import { BookOpenText, Database, Microscope, ShieldCheck } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { PageHeader, Panel } from "@/components/ui";

const vault = [
  {
    title: "MVP analysis engine",
    icon: Microscope,
    copy: "Current readings are simulated from profile state, context notes, and deterministic acoustic placeholders. This creates the full translation-mapping workflow before real ML arrives."
  },
  {
    title: "Global acoustic archive path",
    icon: Database,
    copy: "Next phases can ingest licensed animal acoustic archives, extract spectrogram features, and compare new recordings against species, context, emotion, and environment patterns."
  },
  {
    title: "Interpretation boundary",
    icon: ShieldCheck,
    copy: "PhonomeFrequency estimates likely signal categories. It should never claim certain animal translation or generate respond-back sounds."
  },
  {
    title: "Research language",
    icon: BookOpenText,
    copy: "The product vocabulary stays serious: confidence, evidence, context labels, trend, maturity, archive, observation, and signal history."
  }
];

export default function ResearchVaultPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Research Vault" copy="Technical notes, model boundaries, and the honest roadmap from simulated readings toward real bioacoustic intelligence." />
      <div className="grid gap-4 md:grid-cols-2">
        {vault.map((item) => {
          const Icon = item.icon;
          return (
            <Panel key={item.title}>
              <Icon className="size-7 text-ion" />
              <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>
            </Panel>
          );
        })}
      </div>
      <Panel>
        <h2 className="text-2xl font-semibold text-white">Implementation roadmap</h2>
        <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          <li className="border-l border-ion/40 pl-3">1. Replace placeholder spectrogram bars with Web Audio API frequency extraction.</li>
          <li className="border-l border-ion/40 pl-3">2. Persist recordings through a real database and object storage backend.</li>
          <li className="border-l border-ion/40 pl-3">3. Build licensed acoustic archive connectors for public research datasets and approved partner libraries.</li>
          <li className="border-l border-ion/40 pl-3">4. Add supervised labels from user feedback and repeated confirmed contexts.</li>
          <li className="border-l border-ion/40 pl-3">5. Train species-aware classifiers and individual profile calibration models.</li>
        </ol>
      </Panel>
      <Disclaimer />
    </div>
  );
}

import { Disclaimer } from "@/components/disclaimer";
import { SignalIntake } from "@/components/signal-intake";
import { PageHeader } from "@/components/ui";

export default function SignalChamberPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Signal Chamber"
        copy="Capture a vocal sample, attach observed behavior, and generate the first structured reading. This MVP stores recordings locally in the browser for development."
      />
      <SignalIntake />
      <Disclaimer />
    </div>
  );
}

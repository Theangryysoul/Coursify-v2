import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({
  message,
}: ErrorStateProps) {
  return (
    <div className="lp-clay-card lp-clay-peach lp-enter rounded-3xl p-8 text-center">
      <div className="lp-clay-icon lp-clay-peach mb-4 mx-auto">
        <AlertCircle className="h-6 w-6" style={{ color: "var(--lp-coral)" }} />
      </div>

      <p className="text-[var(--lp-coral)] font-medium">{message}</p>
    </div>
  );
}
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="lp-clay-card lp-clay-white lp-enter flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center">
      {icon && (
        <div className="lp-clay-icon lp-clay-peach mb-5">
          {icon}
        </div>
      )}

      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      <p className="text-muted-foreground mt-2">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
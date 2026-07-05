import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PropertySheet({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-border rounded-xl border border-border bg-surface">{children}</div>;
}

interface PropertyRowProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

export function PropertyRow({ icon: Icon, label, children }: PropertyRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex w-28 flex-shrink-0 items-center gap-2 pt-0.5 text-sm text-muted">
        <Icon size={15} />
        <span>{label}</span>
      </div>
      <div className="min-w-0 flex-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

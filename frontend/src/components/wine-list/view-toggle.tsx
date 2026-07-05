import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "grid";
  preservedParams: Record<string, string | undefined>;
}

function hrefFor(view: "list" | "grid", preservedParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preservedParams)) {
    if (value) params.set(key, value);
  }
  if (view === "list") params.set("view", "list");
  const qs = params.toString();
  return `/${qs ? `?${qs}` : ""}`;
}

export function ViewToggle({ view, preservedParams }: ViewToggleProps) {
  return (
    <div className="flex gap-1">
      <Link
        href={hrefFor("list", preservedParams)}
        aria-label="Ver em lista"
        className={`rounded-lg p-2 ${view === "list" ? "bg-surface text-foreground" : "text-muted hover:bg-surface-hover"}`}
      >
        <List size={18} />
      </Link>
      <Link
        href={hrefFor("grid", preservedParams)}
        aria-label="Ver em grade"
        className={`rounded-lg p-2 ${view === "grid" ? "bg-surface text-foreground" : "text-muted hover:bg-surface-hover"}`}
      >
        <LayoutGrid size={18} />
      </Link>
    </div>
  );
}

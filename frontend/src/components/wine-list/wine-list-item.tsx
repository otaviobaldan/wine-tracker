import Link from "next/link";
import { MapPin } from "lucide-react";
import { ScoreDisplay } from "@/components/wine-detail/grape-cluster";
import type { Wine } from "@/lib/types";

export function WineListItem({ wine }: { wine: Wine }) {
  return (
    <Link
      href={`/wines/${wine.id}`}
      className="block rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg leading-tight text-foreground">
            {wine.name}
            {wine.year ? <span className="text-muted"> · {wine.year}</span> : null}
          </h2>
          <p className="truncate text-sm text-muted">{wine.winery}</p>
        </div>
        <ScoreDisplay score={wine.score} size={13} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted">
        <span className="rounded-full border border-border px-2 py-0.5">{wine.type}</span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {wine.grapeOrigin}
        </span>
      </div>
    </Link>
  );
}

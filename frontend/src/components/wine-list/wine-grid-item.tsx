import Link from "next/link";
import { Wine as WineIcon } from "lucide-react";
import { ScoreDisplay } from "@/components/wine-detail/grape-cluster";
import type { Wine } from "@/lib/types";

export function WineGridItem({ wine }: { wine: Wine }) {
  return (
    <Link
      href={`/wines/${wine.id}`}
      className="block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:bg-surface-hover"
    >
      <div className="aspect-square w-full bg-background">
        {wine.bottlePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary Blob URL
          <img src={wine.bottlePhotoUrl} alt={wine.name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <WineIcon size={28} className="text-border" />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h2 className="truncate font-display text-sm leading-tight text-foreground">{wine.name}</h2>
        <div className="mt-1">
          <ScoreDisplay score={wine.score} size={11} />
        </div>
      </div>
    </Link>
  );
}

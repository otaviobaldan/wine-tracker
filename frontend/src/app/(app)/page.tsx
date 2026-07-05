import Link from "next/link";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/session";
import { backendFetch } from "@/lib/api-client";
import type { Wine } from "@/lib/types";
import { WineFilters } from "@/components/wine-list/wine-filters";
import { WineListItem } from "@/components/wine-list/wine-list-item";

interface WineListPageProps {
  searchParams: Promise<{ q?: string; type?: string; minScore?: string }>;
}

export default async function WineListPage({ searchParams }: WineListPageProps) {
  const { token } = await requireSession();
  const { q, type, minScore } = await searchParams;

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (minScore) params.set("minScore", minScore);

  const { wines } = await backendFetch<{ wines: Wine[] }>(
    `/api/wines${params.size ? `?${params}` : ""}`,
    { token },
  );

  return (
    <div>
      <WineFilters q={q} type={type} minScore={minScore} />

      {wines.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          {q || type || minScore ? "No wines match those filters." : "No wines logged yet."}
        </p>
      ) : (
        <ul className="space-y-2">
          {wines.map((wine) => (
            <li key={wine.id}>
              <WineListItem wine={wine} />
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/wines/new"
        aria-label="Add a wine"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}

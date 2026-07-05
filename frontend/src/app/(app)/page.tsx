import Link from "next/link";
import { Plus } from "lucide-react";
import { requireSession } from "@/lib/session";
import { backendFetch } from "@/lib/api-client";
import type { Wine } from "@/lib/types";
import { WineFilters } from "@/components/wine-list/wine-filters";
import { WineListItem } from "@/components/wine-list/wine-list-item";
import { WineGridItem } from "@/components/wine-list/wine-grid-item";
import { ViewToggle } from "@/components/wine-list/view-toggle";

interface WineListPageProps {
  searchParams: Promise<{ q?: string; type?: string; minScore?: string; view?: string }>;
}

export default async function WineListPage({ searchParams }: WineListPageProps) {
  const { token } = await requireSession();
  const { q, type, minScore, view: rawView } = await searchParams;
  const view = rawView === "grid" ? "grid" : "list";

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
      <div className="mb-4 flex items-start gap-3">
        <div className="flex-1">
          <WineFilters q={q} type={type} minScore={minScore} />
        </div>
        <ViewToggle view={view} preservedParams={{ q, type, minScore }} />
      </div>

      {wines.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          {q || type || minScore
            ? "Nenhum vinho corresponde a esses filtros."
            : "Nenhum vinho registrado ainda."}
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {wines.map((wine) => (
            <WineGridItem key={wine.id} wine={wine} />
          ))}
        </div>
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
        aria-label="Adicionar vinho"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}

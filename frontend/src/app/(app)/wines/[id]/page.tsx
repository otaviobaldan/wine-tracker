import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Grape as GrapeIcon,
  MapPin,
  ShoppingBag,
  Sparkles,
  StickyNote,
  Tag,
  User,
  Users,
  Wine as WineIcon,
} from "lucide-react";
import { requireSession } from "@/lib/session";
import { backendFetch } from "@/lib/api-client";
import type { Wine } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PropertyRow, PropertySheet } from "@/components/wine-detail/property-sheet";
import { ScoreDisplay } from "@/components/wine-detail/grape-cluster";
import { DeleteWineButton } from "@/components/wine-detail/delete-wine-button";
import { deleteWineAction } from "../actions";

interface WineDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function WineDetailPage({ params }: WineDetailPageProps) {
  const { token } = await requireSession();
  const { id } = await params;
  const { wine } = await backendFetch<{ wine: Wine }>(`/api/wines/${id}`, { token });

  return (
    <div className="space-y-6">
      <div>
        {wine.bottlePhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary Blob URL
          <img
            src={wine.bottlePhotoUrl}
            alt={wine.name}
            className="mb-4 h-48 w-36 rounded-lg object-cover"
          />
        )}
        <h1 className="font-display text-2xl text-foreground">
          {wine.name}
          {wine.year ? <span className="text-muted"> · {wine.year}</span> : null}
        </h1>
        <p className="text-muted">{wine.winery}</p>
        <div className="mt-2">
          <ScoreDisplay score={wine.score} size={20} />
        </div>
      </div>

      <PropertySheet>
        <PropertyRow icon={Tag} label="Tipo">
          {wine.type}
        </PropertyRow>
        <PropertyRow icon={GrapeIcon} label="Uva">
          {wine.grape}
        </PropertyRow>
        <PropertyRow icon={MapPin} label="Origem">
          {wine.grapeOrigin}
        </PropertyRow>
        <PropertyRow icon={WineIcon} label="Onde bebemos">
          {wine.whereTried}
          {wine.citySippedIn ? `, ${wine.citySippedIn}` : ""}
        </PropertyRow>
        {wine.whenTried && (
          <PropertyRow icon={Calendar} label="Data">
            {formatDate(wine.whenTried)}
          </PropertyRow>
        )}
        {wine.companions && wine.companions.length > 0 && (
          <PropertyRow icon={Users} label="Com quem">
            {wine.companions.join(", ")}
          </PropertyRow>
        )}
        <PropertyRow icon={StickyNote} label="Notas">
          <p className="whitespace-pre-wrap">{wine.personalFeels}</p>
        </PropertyRow>
        {wine.notes && (
          <PropertyRow icon={StickyNote} label="Mais notas">
            <p className="whitespace-pre-wrap">{wine.notes}</p>
          </PropertyRow>
        )}
        {wine.descriptionByAi && (
          <PropertyRow icon={Sparkles} label="IA">
            <p className="whitespace-pre-wrap">{wine.descriptionByAi}</p>
          </PropertyRow>
        )}
        {wine.price != null && (
          <PropertyRow icon={DollarSign} label="Preço">
            R$ {formatPrice(wine.price)}
          </PropertyRow>
        )}
        {wine.purchaseLocation && (
          <PropertyRow icon={ShoppingBag} label="Comprado em">
            {wine.purchaseLocation}
          </PropertyRow>
        )}
        <PropertyRow icon={User} label="Registrado por">
          {wine.createdBy}
        </PropertyRow>
      </PropertySheet>

      <div className="flex gap-3">
        <Link href={`/wines/${wine.id}/edit`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Editar
          </Button>
        </Link>
        <div className="flex-1">
          <DeleteWineButton action={deleteWineAction.bind(null, wine.id)} />
        </div>
      </div>
    </div>
  );
}

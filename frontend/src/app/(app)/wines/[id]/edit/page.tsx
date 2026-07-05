import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { ApiError, backendFetch } from "@/lib/api-client";
import type { Wine } from "@/lib/types";
import { WineForm } from "@/components/wine-form/wine-form";
import { updateWineAction } from "../../actions";

interface EditWinePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWinePage({ params }: EditWinePageProps) {
  const { token } = await requireSession();
  const { id } = await params;

  let wine: Wine;
  try {
    ({ wine } = await backendFetch<{ wine: Wine }>(`/api/wines/${id}`, { token }));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Edit wine</h1>
      <WineForm
        action={updateWineAction.bind(null, id)}
        initialValues={wine}
        submitLabel="Save changes"
      />
    </div>
  );
}

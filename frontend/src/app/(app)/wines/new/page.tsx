import { requireSession } from "@/lib/session";
import { WineForm } from "@/components/wine-form/wine-form";
import { createWineAction } from "../actions";

export default async function NewWinePage() {
  await requireSession();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Adicionar vinho</h1>
      <WineForm action={createWineAction} submitLabel="Adicionar vinho" />
    </div>
  );
}

import { requireSession } from "@/lib/session";
import { backendFetch } from "@/lib/api-client";
import type { RegisteredUser } from "@/lib/types";
import { WineForm } from "@/components/wine-form/wine-form";
import { createWineAction } from "../actions";

export default async function NewWinePage() {
  const { token } = await requireSession();
  const { users } = await backendFetch<{ users: RegisteredUser[] }>("/api/users", { token });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-foreground">Adicionar vinho</h1>
      <WineForm action={createWineAction} registeredUsers={users} submitLabel="Adicionar vinho" />
    </div>
  );
}

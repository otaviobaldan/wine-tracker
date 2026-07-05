"use client";

import { useActionState } from "react";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScorePicker } from "./score-picker";
import { PhotoUpload } from "./photo-upload";
import { WINE_TYPES, type Wine } from "@/lib/types";
import type { WineFormState } from "@/app/(app)/wines/actions";

interface WineFormProps {
  action: (state: WineFormState, formData: FormData) => Promise<WineFormState>;
  initialValues?: Wine;
  submitLabel: string;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-accent">{messages.join(", ")}</p>;
}

export function WineForm({ action, initialValues, submitLabel }: WineFormProps) {
  const [state, formAction, pending] = useActionState<WineFormState, FormData>(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8 pb-16">
      {state.error && (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          {state.error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-lg text-foreground">Identidade</h2>
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name} />
          <FieldError messages={errors.name} />
        </div>
        <div>
          <Label htmlFor="winery">Vinícola</Label>
          <Input id="winery" name="winery" required defaultValue={initialValues?.winery} />
          <FieldError messages={errors.winery} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              name="year"
              type="number"
              placeholder="Sem safra"
              defaultValue={initialValues?.year ?? undefined}
            />
            <FieldError messages={errors.year} />
          </div>
          <div className="flex-1">
            <Label htmlFor="type">Tipo</Label>
            <Select id="type" name="type" required defaultValue={initialValues?.type ?? ""}>
              <option value="" disabled>
                Selecione…
              </option>
              {WINE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <FieldError messages={errors.type} />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="grape">Uva</Label>
            <Input id="grape" name="grape" required defaultValue={initialValues?.grape} />
            <FieldError messages={errors.grape} />
          </div>
          <div className="flex-1">
            <Label htmlFor="grapeOrigin">Origem da uva</Label>
            <Input
              id="grapeOrigin"
              name="grapeOrigin"
              required
              defaultValue={initialValues?.grapeOrigin}
            />
            <FieldError messages={errors.grapeOrigin} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-foreground">Degustação</h2>
        <div>
          <Label>Nota</Label>
          <ScorePicker defaultValue={initialValues?.score ?? 3} />
          <FieldError messages={errors.score} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="whereTried">Onde bebemos</Label>
            <Input
              id="whereTried"
              name="whereTried"
              required
              placeholder="Casa, Restaurante X…"
              defaultValue={initialValues?.whereTried}
            />
            <FieldError messages={errors.whereTried} />
          </div>
          <div className="flex-1">
            <Label htmlFor="citySippedIn">Cidade</Label>
            <Input
              id="citySippedIn"
              name="citySippedIn"
              defaultValue={initialValues?.citySippedIn ?? undefined}
            />
            <FieldError messages={errors.citySippedIn} />
          </div>
        </div>
        <div>
          <Label htmlFor="whenTried">Data</Label>
          <Input
            id="whenTried"
            name="whenTried"
            type="date"
            defaultValue={initialValues?.whenTried ?? undefined}
          />
          <FieldError messages={errors.whenTried} />
        </div>
        <div>
          <Label htmlFor="personalFeels">Notas pessoais</Label>
          <Textarea
            id="personalFeels"
            name="personalFeels"
            required
            defaultValue={initialValues?.personalFeels}
          />
          <FieldError messages={errors.personalFeels} />
        </div>
        <div>
          <Label htmlFor="notes">Notas adicionais</Label>
          <Textarea id="notes" name="notes" defaultValue={initialValues?.notes ?? undefined} />
          <FieldError messages={errors.notes} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-foreground">Extra</h2>
        <div>
          <Label htmlFor="photo">Foto da garrafa</Label>
          <PhotoUpload name="bottlePhotoUrl" defaultUrl={initialValues?.bottlePhotoUrl} />
        </div>
        <div>
          <Label htmlFor="descriptionByAi">Descrição gerada por IA</Label>
          <Textarea
            id="descriptionByAi"
            name="descriptionByAi"
            defaultValue={initialValues?.descriptionByAi ?? undefined}
          />
          <FieldError messages={errors.descriptionByAi} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={initialValues?.price ?? undefined}
            />
            <FieldError messages={errors.price} />
          </div>
          <div className="flex-1">
            <Label htmlFor="purchaseLocation">Local de compra</Label>
            <Input
              id="purchaseLocation"
              name="purchaseLocation"
              defaultValue={initialValues?.purchaseLocation ?? undefined}
            />
            <FieldError messages={errors.purchaseLocation} />
          </div>
        </div>
      </section>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Salvando…" : submitLabel}
      </Button>
    </form>
  );
}

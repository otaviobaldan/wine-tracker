"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { ApiError, backendFetch } from "@/lib/api-client";
import type { Wine, WineInput } from "@/lib/types";

export interface WineFormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

function str(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function nullableStr(formData: FormData, name: string): string | null {
  const value = str(formData, name);
  return value === "" ? null : value;
}

function nullableNumber(formData: FormData, name: string): number | null {
  const value = str(formData, name);
  return value === "" ? null : Number(value);
}

function stringArray(formData: FormData, name: string): string[] {
  const raw = str(formData, name);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function parseWineFormData(formData: FormData): WineInput {
  return {
    name: str(formData, "name"),
    winery: str(formData, "winery"),
    year: nullableNumber(formData, "year"),
    type: str(formData, "type") as WineInput["type"],
    grape: str(formData, "grape"),
    grapeOrigin: str(formData, "grapeOrigin"),
    whereTried: str(formData, "whereTried"),
    citySippedIn: nullableStr(formData, "citySippedIn"),
    whenTried: nullableStr(formData, "whenTried"),
    companions: stringArray(formData, "companions"),
    score: Number(str(formData, "score")),
    personalFeels: str(formData, "personalFeels"),
    notes: nullableStr(formData, "notes"),
    descriptionByAi: nullableStr(formData, "descriptionByAi"),
    bottlePhotoUrl: nullableStr(formData, "bottlePhotoUrl"),
    price: nullableNumber(formData, "price"),
    purchaseLocation: nullableStr(formData, "purchaseLocation"),
  };
}

function toFormState(err: unknown): WineFormState {
  if (err instanceof ApiError) {
    const fieldErrors: Record<string, string[]> = {};
    if (Array.isArray(err.details)) {
      for (const issue of err.details as { path: (string | number)[]; message: string }[]) {
        const key = String(issue.path[0] ?? "_");
        fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
      }
    }
    return { error: err.message, fieldErrors };
  }
  return { error: "Something went wrong. Please try again." };
}

export async function createWineAction(
  _prevState: WineFormState,
  formData: FormData,
): Promise<WineFormState> {
  const { token } = await requireSession();
  const payload = parseWineFormData(formData);

  let wine: Wine;
  try {
    ({ wine } = await backendFetch<{ wine: Wine }>("/api/wines", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }));
  } catch (err) {
    return toFormState(err);
  }

  revalidatePath("/");
  redirect(`/wines/${wine.id}`);
}

export async function updateWineAction(
  id: string,
  _prevState: WineFormState,
  formData: FormData,
): Promise<WineFormState> {
  const { token } = await requireSession();
  const payload = parseWineFormData(formData);

  try {
    await backendFetch(`/api/wines/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return toFormState(err);
  }

  revalidatePath("/");
  revalidatePath(`/wines/${id}`);
  redirect(`/wines/${id}`);
}

export async function deleteWineAction(id: string) {
  const { token } = await requireSession();
  await backendFetch(`/api/wines/${id}`, { method: "DELETE", token });
  revalidatePath("/");
  redirect("/");
}

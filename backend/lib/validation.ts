import { z } from "zod";

export const wineTypes = ["Tinto", "Branco", "Rosé", "Laranja", "Espumante", "Outro"] as const;

const winePayloadShape = {
  name: z.string().trim().min(1),
  winery: z.string().trim().min(1),
  year: z.number().int().nullable().optional(),
  type: z.enum(wineTypes),
  grape: z.string().trim().min(1),
  grapeOrigin: z.string().trim().min(1),
  whereTried: z.string().trim().min(1),
  citySippedIn: z.string().trim().nullable().optional(),
  whenTried: z.string().date().nullable().optional(),
  companions: z.array(z.string().trim().min(1)).optional(),
  score: z.number().min(0.5).max(5).multipleOf(0.5),
  personalFeels: z.string().trim().min(1),
  notes: z.string().nullable().optional(),
  descriptionByAi: z.string().nullable().optional(),
  bottlePhotoUrl: z.string().url().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  purchaseLocation: z.string().trim().nullable().optional(),
};

export const createWineSchema = z.object(winePayloadShape);

export const updateWineSchema = z.object(winePayloadShape).partial();

export const wineFilterSchema = z.object({
  q: z.string().trim().optional(),
  type: z.enum(wineTypes).optional(),
  grapeOrigin: z.string().trim().optional(),
  minScore: z.coerce.number().int().min(1).max(5).optional(),
  maxScore: z.coerce.number().int().min(1).max(5).optional(),
});

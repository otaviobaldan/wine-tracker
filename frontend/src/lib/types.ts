export const WINE_TYPES = ["Tinto", "Branco", "Rosé", "Laranja", "Espumante", "Outro"] as const;
export type WineType = (typeof WINE_TYPES)[number];

export interface Wine {
  id: string;
  name: string;
  winery: string;
  year: number | null;
  type: WineType;
  grape: string;
  grapeOrigin: string;
  whereTried: string;
  citySippedIn: string | null;
  whenTried: string | null;
  companions: string[] | null;
  score: number;
  personalFeels: string;
  notes: string | null;
  descriptionByAi: string | null;
  bottlePhotoUrl: string | null;
  price: number | null;
  purchaseLocation: string | null;
  createdBy: string;
  createdAt: string;
}

export type WineInput = Omit<Wine, "id" | "createdBy" | "createdAt">;

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface RegisteredUser {
  id: string;
  displayName: string;
}

export type WeatherCondition = "sun" | "rain" | "snow" | "wind";

/** Categories the user sets a rate for (1 every N days) */
export type ClothingCategory =
  | "underwear"
  | "socks"
  | "bottoms"
  | "tees"
  | "jumper"
  | "shirts"
  | "bras"
  | "dresses"
  | "skirts";

/** Categories that appear in the output packing list */
export type OutputClothingCategory =
  | "underwear"
  | "socks"
  | "trousers"
  | "shorts"
  | "tees"
  | "shirts"
  | "thinJumper"
  | "thickJumper"
  | "bras"
  | "dresses"
  | "skirts";

export interface ClothingRate {
  /** One item every N days */
  everyNDays: number;
}

export interface TripConfig {
  days: number;
  temperature: number;
  weather: WeatherCondition[];
  laundryEveryNDays: number | null;
  clothing: Record<ClothingCategory, ClothingRate | null>;
}

export interface PackingList {
  clothing: Record<OutputClothingCategory, number>;
  accessories: {
    sunglasses: boolean;
    lightJacket: boolean;
    warmJacket: boolean;
    waterproof: boolean;
    hat: boolean;
    gloves: boolean;
    gaitor: boolean;
    thermals: boolean;
  };
}

/** Optional categories that can be toggled on/off */
export const optionalCategories: ClothingCategory[] = [
  "shirts",
  "bras",
  "dresses",
  "skirts",
];
export const femaleCategories: ClothingCategory[] = [
  "bras",
  "dresses",
  "skirts",
];

export interface Preset {
  name: string;
  clothing: Record<ClothingCategory, ClothingRate | null>;
}

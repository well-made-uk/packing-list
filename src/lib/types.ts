export type WeatherCondition =
  | "sun"
  | "cloud"
  | "rain"
  | "storm"
  | "snow"
  | "wind";

/** Categories the user sets a rate for (1 every N days) */
export type ClothingCategory =
  | "pants"
  | "socks"
  | "bottoms"
  | "tees"
  | "shirts"
  | "jumper";

/** Categories that appear in the output packing list */
export type OutputClothingCategory =
  | "pants"
  | "socks"
  | "trousers"
  | "shorts"
  | "tees"
  | "shirts"
  | "thinJumper"
  | "thickJumper";

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
    jacket: boolean;
    waterproof: boolean;
    hat: boolean;
    gloves: boolean;
    gaitor: boolean;
    thermals: boolean;
  };
}

export interface Preset {
  name: string;
  clothing: Record<ClothingCategory, ClothingRate>;
}

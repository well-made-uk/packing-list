import type { TripConfig, PackingList, WeatherCondition } from "./types";

/**
 * Returns the fraction of "bottoms" that should be shorts (0..1).
 * - <= 12°C → 0 (all trousers)
 * - >= 26°C → all but one pair are shorts (handled in caller, here we return 1)
 * - Linear interpolation between 12 and 26
 */
function shortsFraction(temperature: number): number {
  if (temperature <= 12) return 0;
  if (temperature >= 26) return 1;
  return (temperature - 12) / (26 - 12);
}

/**
 * Returns the fraction of "jumpers" that should be thin (0..1).
 * - <= 5°C → 0 (all thick)
 * - >= 18°C → 1 (all thin)
 * - Linear interpolation between 5 and 18
 */
function thinJumperFraction(temperature: number): number {
  if (temperature <= 5) return 0;
  if (temperature >= 18) return 1;
  return (temperature - 5) / (18 - 5);
}

export function calculatePackingList(config: TripConfig): PackingList {
  const { days, temperature, weather, clothing, laundryEveryNDays } = config;

  // Effective days is capped by laundry frequency: you only need enough
  // clothes to last until the next wash. null = no laundry available.
  const effectiveDays =
    laundryEveryNDays != null ? Math.min(days, laundryEveryNDays) : days;

  const count = (everyNDays: number) => Math.ceil(effectiveDays / everyNDays);
  const optCount = (rate: { everyNDays: number } | null) =>
    rate ? count(rate.everyNDays) : 0;

  // Simple categories
  const underwear = optCount(clothing.underwear);
  const socks = optCount(clothing.socks);
  const tees = optCount(clothing.tees);
  const shirts = optCount(clothing.shirts);

  // Bottoms: split into trousers vs shorts by temperature
  const totalBottoms = optCount(clothing.bottoms);
  const sf = shortsFraction(temperature);
  let shorts = Math.round(totalBottoms * sf);
  // At 25°+ all but one should be shorts, not literally all
  if (sf >= 1 && totalBottoms > 1) {
    shorts = totalBottoms - 1;
  }
  const trousers = totalBottoms - shorts;

  // Jumpers: split into thin vs thick by temperature
  const totalJumpers = optCount(clothing.jumper);
  const tf = thinJumperFraction(temperature);
  let thinJumper = Math.round(totalJumpers * tf);
  if (tf >= 1) thinJumper = totalJumpers;
  const thickJumper = totalJumpers - thinJumper;

  const has = (w: WeatherCondition) => weather.includes(w);
  const cold = temperature < 8;

  const accessories: PackingList["accessories"] = {
    sunglasses: has("sun"),
    lightJacket: temperature >= 12,
    warmJacket: temperature < 12,
    waterproof: has("rain"),
    hat: cold || has("snow"),
    gloves: cold || has("snow"),
    gaitor: has("wind") || has("snow"),
    thermals: temperature < 7,
  };

  const bras = optCount(clothing.bras);
  const dresses = optCount(clothing.dresses);
  const skirts = optCount(clothing.skirts);

  return {
    clothing: {
      underwear,
      socks,
      trousers,
      shorts,
      tees,
      shirts,
      thinJumper,
      thickJumper,
      bras,
      dresses,
      skirts,
    },
    accessories,
  };
}

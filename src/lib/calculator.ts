import type { TripConfig, PackingList, WeatherCondition } from "./types";

/**
 * Returns the fraction of "bottoms" that should be shorts (0..1).
 * - <= 13°C → 0 (all trousers)
 * - >= 25°C → all but one pair are shorts (handled in caller, here we return ~1)
 * - Linear interpolation between 13 and 25
 */
function shortsFraction(temperature: number): number {
  if (temperature <= 13) return 0;
  if (temperature >= 25) return 1;
  return (temperature - 13) / (25 - 13);
}

/**
 * Returns the fraction of "jumpers" that should be thin (0..1).
 * - <= 10°C → 0 (all thick)
 * - >= 20°C → 1 (all thin)
 * - Linear interpolation between 10 and 20
 */
function thinJumperFraction(temperature: number): number {
  if (temperature <= 10) return 0;
  if (temperature >= 20) return 1;
  return (temperature - 10) / (20 - 10);
}

export function calculatePackingList(config: TripConfig): PackingList {
  const { days, temperature, weather, clothing, laundryEveryNDays } = config;

  // Effective days is capped by laundry frequency: you only need enough
  // clothes to last until the next wash. null = no laundry available.
  const effectiveDays =
    laundryEveryNDays != null ? Math.min(days, laundryEveryNDays) : days;

  const count = (everyNDays: number) => Math.round(effectiveDays / everyNDays);
  const optCount = (rate: { everyNDays: number } | null) =>
    rate ? count(rate.everyNDays) : 0;

  // Simple categories
  const pants = optCount(clothing.pants);
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
    jacket: cold || has("wind") || has("cloud"),
    waterproof: has("rain") || has("storm"),
    hat: cold || has("snow"),
    gloves: cold || has("snow"),
    gaitor: has("wind") || has("storm") || has("snow"),
    thermals: temperature < 5,
  };

  return {
    clothing: {
      pants,
      socks,
      trousers,
      shorts,
      tees,
      shirts,
      thinJumper,
      thickJumper,
    },
    accessories,
  };
}

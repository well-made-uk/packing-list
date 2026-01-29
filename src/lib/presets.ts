import type { Preset } from "./types";

export const presets: Preset[] = [
  {
    name: "Ben",
    clothing: {
      underwear: { everyNDays: 2.5 },
      socks: { everyNDays: 2.5 },
      bottoms: { everyNDays: 4 },
      tees: { everyNDays: 2.5 },
      jumper: { everyNDays: 7 },
      shirts: { everyNDays: 7 },
      bras: null,
      dresses: null,
      skirts: null,
    },
  },
  {
    name: "Naeem",
    clothing: {
      underwear: { everyNDays: 2 },
      socks: { everyNDays: 2 },
      bottoms: { everyNDays: 3 },
      tees: { everyNDays: 2 },
      jumper: { everyNDays: 4 },
      shirts: { everyNDays: 7 },
      bras: null,
      dresses: null,
      skirts: null,
    },
  },
];

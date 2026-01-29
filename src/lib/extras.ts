import type { ExtrasCategory } from "./types";

export function defaultExtras(): ExtrasCategory[] {
  return [
    {
      label: "Essentials",
      items: {
        passport: { enabled: true },
        wallet: { enabled: true },
        medication: { enabled: false },
      },
    },
    {
      label: "Electronics",
      items: {
        phone: { enabled: true },
        laptop: { enabled: false },
        tablet: { enabled: false },
        kindle: { enabled: false },
        gameConsole: { enabled: false },
      },
    },
    {
      label: "Power",
      items: {
        usbCCable: { enabled: false, count: 1 },
        lightningCable: { enabled: false, count: 1 },
        microUsbCable: { enabled: false, count: 1 },
        powerAdapter: { enabled: false },
        euAdapter: { enabled: false },
        powerBank: { enabled: false },
      },
    },
    {
      label: "Toiletries",
      items: {
        toothpasteBrush: { enabled: false },
        shampoo: { enabled: false },
        conditioner: { enabled: false },
        soap: { enabled: false },
        lipBalm: { enabled: false },
        moisturiser: { enabled: false },
      },
    },
    {
      label: "Miscellaneous",
      items: {
        handWarmers: { enabled: false },
        towel: { enabled: false },
        earplugs: { enabled: false },
        bumbag: { enabled: false },
        dayBag: { enabled: false },
        book: { enabled: false, count: 1 },
      },
    },
  ];
}

export const extraItemLabels: Record<string, string> = {
  passport: "Passport",
  wallet: "Wallet",
  medication: "Medication",
  phone: "Phone",
  laptop: "Laptop",
  tablet: "Tablet",
  kindle: "Kindle",
  gameConsole: "Game Console",
  usbCCable: "USB-C Cable",
  lightningCable: "Lightning Cable",
  microUsbCable: "Micro-USB Cable",
  powerAdapter: "Power Adapter",
  euAdapter: "Regional Adapter",
  powerBank: "Power Bank",
  toothpasteBrush: "Toothpaste/Brush",
  shampoo: "Shampoo",
  conditioner: "Conditioner",
  soap: "Soap",
  lipBalm: "Lip Balm",
  moisturiser: "Moisturiser",
  handWarmers: "Hand Warmers",
  towel: "Towel",
  earplugs: "Earplugs",
  bumbag: "Bumbag",
  dayBag: "Day Bag",
  book: "Book",
};

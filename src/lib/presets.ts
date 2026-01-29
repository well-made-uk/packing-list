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
    extras: [
      {
        label: "Essentials",
        items: {
          passport: { enabled: true },
          wallet: { enabled: true },
          medication: { enabled: true },
        },
      },
      {
        label: "Electronics",
        items: {
          phone: { enabled: true },
          laptop: { enabled: true },
          tablet: { enabled: false },
          kindle: { enabled: true },
          gameConsole: { enabled: false },
        },
      },
      {
        label: "Power",
        items: {
          usbCCable: { enabled: true, count: 1 },
          lightningCable: { enabled: true, count: 1 },
          microUsbCable: { enabled: false, count: 1 },
          powerAdapter: { enabled: true },
          euAdapter: { enabled: true },
          powerBank: { enabled: true },
        },
      },
      {
        label: "Toiletries",
        items: {
          toothpasteBrush: { enabled: true },
          shampoo: { enabled: false },
          conditioner: { enabled: false },
          soap: { enabled: false },
          lipBalm: { enabled: true },
          moisturiser: { enabled: false },
        },
      },
      {
        label: "Miscellaneous",
        items: {
          handWarmers: { enabled: false },
          towel: { enabled: true },
          earplugs: { enabled: true },
          bumbag: { enabled: true },
          dayBag: { enabled: true },
          book: { enabled: false, count: 1 },
        },
      },
    ],
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
    extras: [
      {
        label: "Essentials",
        items: {
          passport: { enabled: true },
          wallet: { enabled: true },
          medication: { enabled: true },
        },
      },
      {
        label: "Electronics",
        items: {
          phone: { enabled: true },
          laptop: { enabled: true },
          tablet: { enabled: false },
          kindle: { enabled: true },
          gameConsole: { enabled: false },
        },
      },
      {
        label: "Power",
        items: {
          usbCCable: { enabled: true, count: 2 },
          lightningCable: { enabled: false, count: 1 },
          microUsbCable: { enabled: false, count: 1 },
          powerAdapter: { enabled: true },
          euAdapter: { enabled: true },
          powerBank: { enabled: true },
        },
      },
      {
        label: "Toiletries",
        items: {
          toothpasteBrush: { enabled: true },
          shampoo: { enabled: true },
          conditioner: { enabled: true },
          soap: { enabled: true },
          lipBalm: { enabled: true },
          moisturiser: { enabled: false },
        },
      },
      {
        label: "Miscellaneous",
        items: {
          handWarmers: { enabled: true },
          towel: { enabled: false },
          earplugs: { enabled: true },
          bumbag: { enabled: true },
          dayBag: { enabled: false },
          book: { enabled: false, count: 1 },
        },
      },
    ],
  },
];

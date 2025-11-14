import { DrinkOptionSection } from "../components/drink-options/drink-options";

export const DEFAULT_DRINK_SECTIONS: DrinkOptionSection[] = [
  {
    id: "recent",
    title: "Ostatnie",
    icon: "time-outline",
    items: [
      { id: "1", label: "Wódka", isSelected: false },
      { id: "2", label: "Rum", isSelected: false },
    ],
    isExpanded: false,
  },
  {
    id: "alcohol",
    title: "Alkohol",
    icon: "wine-outline",
    items: [
      { id: "3", label: "Wódka", isSelected: false },
      { id: "4", label: "Rum", isSelected: false },
      { id: "5", label: "Gin", isSelected: false },
      { id: "6", label: "Whiskey", isSelected: false },
    ],
    isExpanded: false,
  },
  {
    id: "additives",
    title: "Dodatki",
    icon: "add-circle-outline",
    items: [
      { id: "7", label: "Coca-cola", isSelected: false },
      { id: "8", label: "Brukselka", isSelected: false },
      { id: "9", label: "Mleko", isSelected: false },
    ],
    isExpanded: false,
  },
];

export const DEFAULT_POWER_LEVELS = ["Słabe", "Średnie", "Mocne"];

export const DEFAULT_FLAVOR_PROFILES = [
  "Słodki",
  "Wytrawy",
  "Pikantny",
  "Półsłodki",
];

export const DEFAULT_SELECTED_POWER = "Średnie";

export const DEFAULT_SELECTED_FLAVOR = "Słodki";

import { DrinkOptionSection } from "../components/drink-options/drink-options";

export const DEFAULT_DRINK_SECTIONS: DrinkOptionSection[] = [
  {
    id: "recent",
    title: "Ostatnie",
    icon: "time-outline",
    items: [],
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

export const DEFAULT_POWER_LEVELS = ["Low", "Medium", "High"];

export const DEFAULT_POWER_LEVELS_LABELS = ["Słabe", "Średnie", "Mocne"];

export const DEFAULT_FLAVOR_PROFILES = [
  "Sweet",
  "Dry",
  "Semi_sweet",
];

export const DEFAULT_FLAVOR_PROFILES_LABELS = [
  "Słodki",
  "Wytrawny",
  "Półsłodki",
];

export const DEFAULT_SELECTED_POWER = "Medium";

export const DEFAULT_SELECTED_FLAVOR = "Sweet";

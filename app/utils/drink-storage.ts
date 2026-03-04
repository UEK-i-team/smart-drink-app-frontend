import AsyncStorage from "@react-native-async-storage/async-storage";
import { Drink } from "../types/drink";

const FAVORITES_KEY = "@smartdrink:favorites";
const HISTORY_KEY = "@smartdrink:history";
const RECENT_OPTIONS_KEY = "@smartdrink:recent_options";

const MAX_RECENT_OPTIONS = 10;

const safeParse = (value: string | null): Drink[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const serialize = (drinks: Drink[]): string => JSON.stringify(drinks);

export const loadFavorites = async (): Promise<Drink[]> => {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return safeParse(stored);
};

export const loadHistory = async (): Promise<Drink[]> => {
  const stored = await AsyncStorage.getItem(HISTORY_KEY);
  return safeParse(stored);
};

export const saveFavorites = async (drinks: Drink[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, serialize(drinks));
};

export const saveHistory = async (drinks: Drink[]): Promise<void> => {
  await AsyncStorage.setItem(HISTORY_KEY, serialize(drinks));
};

export const ensureHistorySeeded = async (
  seed: Drink[]
): Promise<Drink[]> => {
  const current = await loadHistory();
  if (current.length > 0) {
    return current;
  }

  await saveHistory(seed);
  return seed;
};

export const upsertHistoryEntry = async (
  drink: Drink,
  currentHistory: Drink[]
): Promise<Drink[]> => {
  const exists = currentHistory.some((item) => item.id === drink.id);
  const nextHistory = exists ? currentHistory : [drink, ...currentHistory];
  await saveHistory(nextHistory);
  return nextHistory;
};

export const loadRecentOptions = async (): Promise<string[]> => {
  const stored = await AsyncStorage.getItem(RECENT_OPTIONS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRecentOptions = async (
  newLabels: string[],
  existing: string[]
): Promise<void> => {
  const merged = [
    ...newLabels,
    ...existing.filter((l) => !newLabels.includes(l)),
  ].slice(0, MAX_RECENT_OPTIONS);
  await AsyncStorage.setItem(RECENT_OPTIONS_KEY, JSON.stringify(merged));
};

const SELECTED_OPTIONS_KEY = "@smartdrink:selected_options";

export const loadSelectedOptions = async (): Promise<{
  labels: string[];
  power: string;
  flavorProfile: string;
} | null> => {
  const stored = await AsyncStorage.getItem(SELECTED_OPTIONS_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveSelectedOptions = async (
  labels: string[],
  power: string,
  flavorProfile: string
): Promise<void> => {
  await AsyncStorage.setItem(
    SELECTED_OPTIONS_KEY,
    JSON.stringify({ labels, power, flavorProfile })
  );
};

export const toggleFavoritePersisted = async (
  drink: Drink,
  currentFavorites: Drink[]
): Promise<Drink[]> => {
  const exists = currentFavorites.some((item) => item.id === drink.id);
  const nextFavorites = exists
    ? currentFavorites.filter((item) => item.id !== drink.id)
    : [...currentFavorites, drink];

  await saveFavorites(nextFavorites);
  return nextFavorites;
};
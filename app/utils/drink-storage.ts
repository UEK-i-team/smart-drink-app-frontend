import AsyncStorage from "@react-native-async-storage/async-storage";
import { Drink } from "../types/drink";

const FAVORITES_KEY = "@smartdrink:favorites";
const HISTORY_KEY = "@smartdrink:history";

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
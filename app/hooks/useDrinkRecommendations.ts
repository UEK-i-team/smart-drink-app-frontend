import { useCallback } from 'react';
import { getDrinkRecommendations, getMockDrinks } from '../services/api';
import { Drink } from '../types/drink';
import { mapApiDrinkToDrink } from '../utils/drink-mapper';
import { SAMPLE_DRINKS } from '../constants/sample-drinks';

export function useDrinkRecommendations() {
  const fetchDrinks = useCallback(async (prompt: string): Promise<Drink[]> => {
    try {
      const response = await getDrinkRecommendations(prompt);
      return response.drinks.map(mapApiDrinkToDrink);
    } catch {
      // First fallback: try mock drinks endpoint
      try {
        const fallback = await getMockDrinks();
        return fallback.drinks.map(mapApiDrinkToDrink);
      } catch {
        // Final fallback: local sample data
        return SAMPLE_DRINKS;
      }
    }
  }, []);

  return { fetchDrinks };
}
